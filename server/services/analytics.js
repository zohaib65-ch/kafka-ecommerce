/**
 * Pulseboard analytics publisher.
 *
 * Turns store activity into events for Pulseboard's `website-events` Kafka topic by calling
 * Pulseboard's `POST /api/events` ingestion endpoint (so Pulseboard's own validation, rate limits
 * and consumer-side deduplication apply, and no Kafka credentials are needed here).
 *
 * Delivery model: BEST EFFORT. Events wait in a bounded in-memory queue and are sent in small
 * batches with retry and exponential backoff, always with the same eventId so Pulseboard's
 * consumers can discard duplicates. Nothing is persisted: events still queued when the process
 * crashes, or dropped after repeated failures or a full queue, are lost. `track()` never throws
 * and never waits for the network, so analytics can never break a shopping request.
 */
const crypto = require('crypto');
const axios = require('axios');

const keys = require('../config/keys');

// Mirrors Pulseboard's event contract (src/shared/event-schema.ts).
const EVENT_TYPES = [
  'page_view',
  'product_click',
  'add_to_cart',
  'remove_from_cart',
  'order_created'
];
// order_created is authoritative and may only be produced by the server itself.
const CLIENT_EVENT_TYPES = [
  'page_view',
  'product_click',
  'add_to_cart',
  'remove_from_cart'
];
const PRODUCT_EVENT_TYPES = ['product_click', 'add_to_cart', 'remove_from_cart'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAGE_RE = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/;
const PRODUCT_ID_RE = /^[a-z0-9][a-z0-9_-]*$/;
const MAX_PAGE_LENGTH = 200;
const MAX_PRODUCT_ID_LENGTH = 64;
const SOURCE = 'store';

// Pulseboard accepts at most 10 events per request.
const PULSEBOARD_MAX_BATCH = 10;

// Fixed namespace for the deterministic (UUIDv5) ids of authoritative events.
const EVENT_ID_NAMESPACE = '6f1d2c0e-8b1a-4d57-9a3e-0c5b7e9d4f21';

const isUuid = value => typeof value === 'string' && UUID_RE.test(value);

const bytesToUuid = bytes => {
  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
};

/** RFC 4122 UUIDv5: the same name always yields the same id, so retries can never double count. */
const uuidV5 = name => {
  const namespace = Buffer.from(EVENT_ID_NAMESPACE.replace(/-/g, ''), 'hex');
  const hash = crypto
    .createHash('sha1')
    .update(namespace)
    .update(String(name))
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  return bytesToUuid(hash.slice(0, 16));
};

/**
 * Pulseboard only stores pathnames. Routes that carry secrets (reset and signup tokens), record
 * ids or admin screens are dropped or collapsed here, whatever the browser sent.
 */
const normalizePage = rawPage => {
  if (typeof rawPage !== 'string') return null;
  const path = rawPage.split(/[?#]/)[0];
  if (path.length === 0 || path.length > MAX_PAGE_LENGTH || !PAGE_RE.test(path)) {
    return null;
  }
  if (/^\/(dashboard|reset-password|merchant-signup|auth)(\/|$)/.test(path)) {
    return null;
  }
  if (/^\/order\/success(\/|$)/.test(path)) return '/order/success';
  if (/^\/order(\/|$)/.test(path)) return '/order';
  return path;
};

/**
 * Validates and rebuilds an event from untrusted input. Only known fields survive, so nothing
 * else the browser sends (tokens, emails, free text) can reach Kafka. The timestamp is always
 * stamped here: a wrong client clock would make Pulseboard reject the whole batch.
 */
const sanitizeEvent = (input, allowedTypes) => {
  if (!input || typeof input !== 'object') {
    return { ok: false, reason: 'invalid_event' };
  }
  if (!allowedTypes.includes(input.type)) {
    return { ok: false, reason: 'invalid_type' };
  }
  if (!isUuid(input.eventId)) return { ok: false, reason: 'invalid_event_id' };
  if (!isUuid(input.sessionId)) return { ok: false, reason: 'invalid_session' };

  const page = normalizePage(input.page);
  if (!page) return { ok: false, reason: 'page_not_tracked' };

  const event = {
    eventId: input.eventId.toLowerCase(),
    type: input.type,
    timestamp: new Date().toISOString(),
    sessionId: input.sessionId.toLowerCase(),
    page,
    source: SOURCE
  };

  if (PRODUCT_EVENT_TYPES.includes(input.type)) {
    const productId = input.productId;
    if (
      typeof productId !== 'string' ||
      productId.length > MAX_PRODUCT_ID_LENGTH ||
      !PRODUCT_ID_RE.test(productId)
    ) {
      return { ok: false, reason: 'invalid_product' };
    }
    event.productId = productId;
  }
  return { ok: true, event };
};

const originOf = url => {
  try {
    return new URL(url).origin;
  } catch (error) {
    return 'an invalid URL';
  }
};

class Analytics {
  constructor(options = {}) {
    const url = (options.url || '').trim().replace(/\/+$/, '');
    const token = (options.token || '').trim();

    this.url = url;
    this.token = token;
    this.enabled = options.enabled !== false && Boolean(url && token);

    this.maxQueue = options.maxQueue || 1000;
    this.batchSize = Math.min(options.batchSize || 10, PULSEBOARD_MAX_BATCH);
    this.flushIntervalMs = options.flushIntervalMs || 1000;
    this.maxAttempts = options.maxAttempts || 8;
    this.backoffInitialMs = options.backoffInitialMs || 1000;
    this.backoffMaxMs = options.backoffMaxMs || 30000;
    this.authCooldownMs = options.authCooldownMs || 5 * 60 * 1000;
    this.requestTimeoutMs = options.requestTimeoutMs || 5000;
    this.dedupeWindowMs = options.dedupeWindowMs || 10 * 60 * 1000;
    this.maxSeen = options.maxSeen || 10000;
    this.http = options.http || axios;
    this.log = options.log || console;

    // Pseudonymous session ids for server-side events: an HMAC of the user id, never the raw id.
    const secret =
      options.sessionSecret || crypto.randomBytes(32).toString('hex');
    this.sessionKey = crypto
      .createHmac('sha256', secret)
      .update('pulseboard-analytics-session-v1')
      .digest();

    this.queue = [];
    this.seen = new Map();
    this.timer = null;
    this.running = null;
    this.retryAt = 0;
    this.failures = 0;
    this.warned = new Map();
    this.stats = {
      accepted: 0,
      sent: 0,
      duplicates: 0,
      invalid: 0,
      dropped: 0,
      rejected: 0,
      failedAttempts: 0
    };
  }

  isEnabled() {
    return this.enabled;
  }

  getStats() {
    return Object.assign({ queued: this.queue.length }, this.stats);
  }

  /**
   * Queues one event. Returns { accepted, reason? } and never throws or waits for the network.
   * `accepted` means "queued for delivery", not "delivered".
   */
  track(input, { allowedTypes = CLIENT_EVENT_TYPES } = {}) {
    try {
      if (!this.enabled) return { accepted: false, reason: 'disabled' };

      const result = sanitizeEvent(input, allowedTypes);
      if (!result.ok) {
        this.stats.invalid += 1;
        return { accepted: false, reason: result.reason };
      }
      const { event } = result;

      if (this.isDuplicate(event.eventId)) {
        this.stats.duplicates += 1;
        return { accepted: false, reason: 'duplicate' };
      }
      if (this.queue.length >= this.maxQueue) {
        this.stats.dropped += 1;
        this.warnOnce(
          'queue-full',
          `queue full (${this.maxQueue}); dropping new events until Pulseboard is reachable again`
        );
        return { accepted: false, reason: 'queue_full' };
      }

      this.remember(event.eventId);
      this.queue.push({ event, attempts: 0, solo: false });
      this.stats.accepted += 1;
      this.schedule(this.queue.length >= this.batchSize ? 0 : this.flushIntervalMs);
      return { accepted: true };
    } catch (error) {
      this.warnOnce('track-error', `could not queue an event: ${error.message}`);
      return { accepted: false, reason: 'error' };
    }
  }

  /**
   * Authoritative order event. The id is derived from the order id, so however often this runs
   * for one order (a retried request, a replayed job) it is the same event to Pulseboard.
   */
  trackOrderCreated({ orderId, userId, sessionId }) {
    const session = isUuid(sessionId)
      ? sessionId
      : this.pseudonymousSession(userId);
    return this.track(
      {
        type: 'order_created',
        eventId: uuidV5(`order:${orderId}`),
        sessionId: session,
        page: '/order/success'
      },
      { allowedTypes: EVENT_TYPES }
    );
  }

  pseudonymousSession(userId) {
    const digest = crypto
      .createHmac('sha256', this.sessionKey)
      .update(`user:${userId}`)
      .digest();
    digest[6] = (digest[6] & 0x0f) | 0x40;
    digest[8] = (digest[8] & 0x3f) | 0x80;
    return bytesToUuid(digest.slice(0, 16));
  }

  isDuplicate(eventId) {
    const expiresAt = this.seen.get(eventId);
    return expiresAt !== undefined && expiresAt > Date.now();
  }

  remember(eventId) {
    this.seen.delete(eventId);
    this.seen.set(eventId, Date.now() + this.dedupeWindowMs);
    if (this.seen.size > this.maxSeen) {
      // Maps iterate in insertion order, so the first key is the oldest.
      this.seen.delete(this.seen.keys().next().value);
    }
  }

  schedule(delayMs) {
    if (this.timer || this.queue.length === 0) return;
    const wait = Math.max(delayMs, this.retryAt - Date.now(), 0);
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush().catch(() => undefined);
    }, wait);
    // Never keep the process alive just to send analytics.
    if (this.timer.unref) this.timer.unref();
  }

  /**
   * Sends queued events until the queue is empty or a send fails. `force` ignores the backoff
   * (used on shutdown and by tests). Concurrent calls share one run.
   */
  flush({ force = false } = {}) {
    if (this.running) return this.running;
    this.running = this.drain(force)
      .catch(error => {
        this.warnOnce('flush-error', `unexpected error while sending: ${error.message}`);
      })
      .finally(() => {
        this.running = null;
        this.schedule(this.flushIntervalMs);
      });
    return this.running;
  }

  async drain(force) {
    while (this.queue.length > 0) {
      if (!force && Date.now() < this.retryAt) return;

      const head = this.queue[0];
      const batch = head.solo
        ? [head]
        : this.queue.slice(0, this.batchSize).filter(entry => !entry.solo);
      const outcome = await this.send(batch.map(entry => entry.event));

      if (outcome.ok) {
        this.queue.splice(0, batch.length);
        this.stats.sent += batch.length;
        this.failures = 0;
        this.retryAt = 0;
        continue;
      }

      if (outcome.permanent) {
        if (batch.length > 1) {
          // One bad event must not sink the others: retry them one at a time.
          batch.forEach(entry => {
            entry.solo = true;
          });
          continue;
        }
        this.queue.splice(0, 1);
        this.stats.rejected += 1;
        this.warnOnce(
          `rejected-${outcome.status}`,
          `Pulseboard rejected an event (HTTP ${outcome.status}); it was dropped${
            outcome.detail ? `: ${outcome.detail}` : ''
          }`
        );
        continue;
      }

      this.stats.failedAttempts += 1;
      this.failures += 1;
      batch.forEach(entry => {
        entry.attempts += 1;
      });
      const exhausted = batch.filter(entry => entry.attempts >= this.maxAttempts);
      if (exhausted.length > 0) {
        this.queue = this.queue.filter(entry => !exhausted.includes(entry));
        this.stats.dropped += exhausted.length;
        this.warnOnce(
          'gave-up',
          `gave up on ${exhausted.length} event(s) after ${this.maxAttempts} failed attempts`
        );
      }
      this.retryAt = Date.now() + this.retryDelay(outcome);
      this.warnOnce(
        `failing-${outcome.status || outcome.code}`,
        `could not reach Pulseboard (${outcome.status || outcome.code}); retrying with backoff, ${this.queue.length} event(s) queued`
      );
      return;
    }
  }

  retryDelay(outcome) {
    if (outcome.authFailure) return this.authCooldownMs;
    if (outcome.retryAfterMs) {
      return Math.min(outcome.retryAfterMs, this.authCooldownMs);
    }
    const exponential = Math.min(
      this.backoffMaxMs,
      this.backoffInitialMs * 2 ** Math.max(0, this.failures - 1)
    );
    // Jitter so several store instances do not retry in lockstep.
    return Math.round(exponential * (0.75 + Math.random() * 0.5));
  }

  async send(events) {
    try {
      await this.http.post(
        `${this.url}/api/events`,
        { events },
        {
          timeout: this.requestTimeoutMs,
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { ok: true };
    } catch (error) {
      return this.classify(error);
    }
  }

  classify(error) {
    const response = error && error.response;
    if (!response) {
      return { ok: false, code: (error && error.code) || 'network_error' };
    }
    const { status, data } = response;
    const body = data && data.error ? data.error : {};

    if (status === 401 || status === 403) {
      // Wrong token: retrying fast would also burn Pulseboard's failed-auth allowance.
      this.warnOnce(
        'auth',
        'Pulseboard refused the token (check PULSEBOARD_ADMIN_TOKEN); pausing delivery for a while'
      );
      return { ok: false, status, authFailure: true };
    }
    if (status === 429) {
      const seconds = Number(
        body.retryAfterSeconds || (response.headers || {})['retry-after']
      );
      return {
        ok: false,
        status,
        retryAfterMs: Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0
      };
    }
    if (status >= 500) return { ok: false, status };

    // Any other 4xx will not succeed on retry.
    const issues = Array.isArray(body.issues)
      ? body.issues
          .slice(0, 3)
          .map(issue => `${issue.path}: ${issue.message}`)
          .join('; ')
      : '';
    return { ok: false, status, permanent: true, detail: issues };
  }

  warnOnce(key, message) {
    const now = Date.now();
    if (now - (this.warned.get(key) || 0) < 30000) return;
    this.warned.set(key, now);
    this.log.warn(`[analytics] ${message}`);
  }

  /** Best-effort final flush; resolves with how many events were still queued. */
  async shutdown(timeoutMs = 3000) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.enabled || this.queue.length === 0) return this.queue.length;
    let timeout;
    await Promise.race([
      this.flush({ force: true }),
      new Promise(resolve => {
        timeout = setTimeout(resolve, timeoutMs);
      })
    ]);
    clearTimeout(timeout);
    return this.queue.length;
  }

  describe() {
    return this.enabled
      ? `enabled, sending to ${originOf(this.url)}`
      : 'disabled (set PULSEBOARD_URL and PULSEBOARD_ADMIN_TOKEN to enable)';
  }
}

const analyticsKeys = keys.analytics || {};
const analytics = new Analytics({
  url: analyticsKeys.url,
  token: analyticsKeys.token,
  enabled: analyticsKeys.enabled,
  sessionSecret: analyticsKeys.sessionSecret || (keys.jwt && keys.jwt.secret)
});

module.exports = analytics;
module.exports.Analytics = Analytics;
module.exports.sanitizeEvent = sanitizeEvent;
module.exports.normalizePage = normalizePage;
module.exports.uuidV5 = uuidV5;
module.exports.CLIENT_EVENT_TYPES = CLIENT_EVENT_TYPES;
