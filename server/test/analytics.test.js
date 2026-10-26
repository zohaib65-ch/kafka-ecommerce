// Run with: npm test (Node >= 18 for the built-in test runner)
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const crypto = require('crypto');

const {
  Analytics,
  sanitizeEvent,
  normalizePage,
  uuidV5,
  CLIENT_EVENT_TYPES
} = require('../services/analytics');

const uuid = () => crypto.randomUUID();
const silent = { warn: () => undefined };

const clientEvent = (overrides = {}) => ({
  type: 'page_view',
  eventId: uuid(),
  sessionId: uuid(),
  page: '/shop',
  ...overrides
});

// A stand-in for axios that records requests and answers from a script of outcomes.
const fakeHttp = (script = []) => {
  const calls = [];
  return {
    calls,
    post: async (url, body, config) => {
      calls.push({ url, body, config });
      const outcome = script.length > 0 ? script.shift() : { status: 202 };
      if (typeof outcome === 'function') return outcome(body);
      if (outcome.status >= 200 && outcome.status < 300) return { status: outcome.status };
      if (outcome.networkError) {
        const error = new Error('connect ECONNREFUSED');
        error.code = 'ECONNREFUSED';
        throw error;
      }
      const error = new Error(`Request failed with status code ${outcome.status}`);
      error.response = { status: outcome.status, data: outcome.data, headers: outcome.headers || {} };
      throw error;
    }
  };
};

const make = (options = {}) =>
  new Analytics({
    url: 'http://pulseboard.test',
    token: 'test-token-not-a-secret',
    flushIntervalMs: 60000,
    log: silent,
    ...options
  });

test('sanitizeEvent keeps only whitelisted fields and stamps the time itself', () => {
  const result = sanitizeEvent(
    {
      ...clientEvent({ type: 'product_click', productId: 'blue-mug' }),
      timestamp: '1999-01-01T00:00:00Z',
      email: 'shopper@example.com',
      token: 'Bearer abc',
      source: 'simulator'
    },
    CLIENT_EVENT_TYPES
  );
  assert.equal(result.ok, true);
  assert.deepEqual(Object.keys(result.event).sort(), [
    'eventId',
    'page',
    'productId',
    'sessionId',
    'source',
    'timestamp',
    'type'
  ]);
  assert.equal(result.event.source, 'store');
  assert.notEqual(result.event.timestamp, '1999-01-01T00:00:00Z');
  assert.ok(Math.abs(Date.parse(result.event.timestamp) - Date.now()) < 5000);
});

test('sanitizeEvent rejects malformed ids, unknown types and bad products', () => {
  const bad = [
    clientEvent({ eventId: 'nope' }),
    clientEvent({ sessionId: 'user@example.com' }),
    clientEvent({ type: 'purchase' }),
    clientEvent({ page: 'shop' }),
    clientEvent({ type: 'add_to_cart' }),
    clientEvent({ type: 'add_to_cart', productId: 'Blue Mug' }),
    clientEvent({ type: 'add_to_cart', productId: 'a'.repeat(65) }),
    null,
    'string'
  ];
  bad.forEach(input => assert.equal(sanitizeEvent(input, CLIENT_EVENT_TYPES).ok, false));
});

test('order_created cannot be submitted by the browser, and never carries a product', () => {
  const order = clientEvent({ type: 'order_created', page: '/order/success' });
  assert.equal(sanitizeEvent(order, CLIENT_EVENT_TYPES).ok, false);
  const result = sanitizeEvent({ ...order, productId: 'blue-mug' }, ['order_created']);
  assert.equal(result.ok, true);
  assert.equal('productId' in result.event, false);
});

test('page paths: query strings go, secrets and record ids never reach Pulseboard', () => {
  assert.equal(normalizePage('/shop?email=a@b.c#top'), '/shop');
  assert.equal(normalizePage('/product/blue-mug'), '/product/blue-mug');
  assert.equal(normalizePage('/reset-password/3f9a1c'), null);
  assert.equal(normalizePage('/merchant-signup/abcdef'), null);
  assert.equal(normalizePage('/auth/success'), null);
  assert.equal(normalizePage('/dashboard/orders'), null);
  assert.equal(normalizePage('/order/success/65a1b2c3d4e5f60718293a4b'), '/order/success');
  assert.equal(normalizePage('/order/65a1b2c3d4e5f60718293a4b'), '/order');
  assert.equal(normalizePage('/my page'), null);
  assert.equal(normalizePage(`/${'a'.repeat(200)}`), null);
});

test('is disabled, and does nothing, without a URL and token', async () => {
  const http = fakeHttp();
  const noToken = new Analytics({ url: 'http://pulseboard.test', http, log: silent });
  const off = make({ enabled: false, http });
  for (const analytics of [noToken, off]) {
    assert.equal(analytics.isEnabled(), false);
    assert.deepEqual(analytics.track(clientEvent()), { accepted: false, reason: 'disabled' });
    await analytics.flush({ force: true });
  }
  assert.equal(http.calls.length, 0);
});

test('sends batches of at most 10 with the bearer token and the store source', async () => {
  const http = fakeHttp();
  const analytics = make({ http });
  for (let i = 0; i < 23; i += 1) assert.equal(analytics.track(clientEvent()).accepted, true);

  await analytics.flush({ force: true });

  assert.deepEqual(
    http.calls.map(call => call.body.events.length),
    [10, 10, 3]
  );
  assert.equal(http.calls[0].url, 'http://pulseboard.test/api/events');
  assert.equal(http.calls[0].config.headers.Authorization, 'Bearer test-token-not-a-secret');
  assert.ok(http.calls.every(call => call.body.events.every(event => event.source === 'store')));
  assert.equal(analytics.getStats().sent, 23);
  assert.equal(analytics.getStats().queued, 0);
});

test('the same eventId is queued once, so a batch can never contain a duplicate', async () => {
  const http = fakeHttp();
  const analytics = make({ http });
  const event = clientEvent();

  assert.equal(analytics.track(event).accepted, true);
  assert.deepEqual(analytics.track(event), { accepted: false, reason: 'duplicate' });
  assert.deepEqual(analytics.track({ ...event }), { accepted: false, reason: 'duplicate' });
  await analytics.flush({ force: true });
  // Still remembered after delivery: a client retry of an already delivered event is ignored.
  assert.equal(analytics.track(event).accepted, false);

  assert.equal(http.calls.length, 1);
  assert.equal(http.calls[0].body.events.length, 1);
  assert.equal(analytics.getStats().duplicates, 3);
});

test('retries after an outage with the SAME eventIds, then succeeds', async () => {
  const http = fakeHttp([{ networkError: true }, { status: 503, data: { error: { code: 'kafka_unavailable' } } }, { status: 202 }]);
  const analytics = make({ http, backoffInitialMs: 1, backoffMaxMs: 2 });
  const events = [clientEvent(), clientEvent(), clientEvent()];
  events.forEach(event => analytics.track(event));

  await analytics.flush({ force: true });
  assert.equal(analytics.getStats().queued, 3, 'kept after a network error');
  await analytics.flush({ force: true });
  assert.equal(analytics.getStats().queued, 3, 'kept after a 503');
  await analytics.flush({ force: true });

  assert.equal(analytics.getStats().queued, 0);
  assert.equal(http.calls.length, 3);
  const ids = call => call.body.events.map(event => event.eventId).sort();
  assert.deepEqual(ids(http.calls[1]), ids(http.calls[0]));
  assert.deepEqual(ids(http.calls[2]), ids(http.calls[0]));
  assert.deepEqual(ids(http.calls[2]), events.map(event => event.eventId).sort());
  assert.equal(analytics.getStats().failedAttempts, 2);
});

test('honours backoff: no new request is made before the retry time', async () => {
  const http = fakeHttp([{ status: 503 }]);
  const analytics = make({ http, backoffInitialMs: 60000, backoffMaxMs: 60000 });
  analytics.track(clientEvent());

  await analytics.flush({ force: true });
  assert.equal(http.calls.length, 1);
  await analytics.flush();
  assert.equal(http.calls.length, 1, 'still backing off');
  assert.equal(analytics.getStats().queued, 1);
});

test('gives up on events after maxAttempts failures instead of retrying forever', async () => {
  const http = fakeHttp(Array.from({ length: 10 }, () => ({ status: 503 })));
  const analytics = make({ http, maxAttempts: 3, backoffInitialMs: 1, backoffMaxMs: 1 });
  analytics.track(clientEvent());

  for (let i = 0; i < 3; i += 1) await analytics.flush({ force: true });

  assert.equal(analytics.getStats().queued, 0);
  assert.equal(analytics.getStats().dropped, 1);
});

test('one rejected event does not sink the rest of its batch', async () => {
  const poison = clientEvent();
  const good = [clientEvent(), clientEvent(), clientEvent()];
  const reject = body =>
    body.events.some(event => event.eventId === poison.eventId)
      ? Promise.reject(
          Object.assign(new Error('400'), {
            response: {
              status: 400,
              data: { error: { issues: [{ path: 'events.1.page', message: 'bad' }] } },
              headers: {}
            }
          })
        )
      : { status: 202 };
  const http = fakeHttp(Array.from({ length: 20 }, () => reject));
  const analytics = make({ http });
  [good[0], poison, good[1], good[2]].forEach(event => analytics.track(event));

  await analytics.flush({ force: true });

  const delivered = http.calls
    .filter(call => !call.body.events.some(event => event.eventId === poison.eventId))
    .flatMap(call => call.body.events.map(event => event.eventId));
  assert.deepEqual(delivered.sort(), good.map(event => event.eventId).sort());
  assert.equal(analytics.getStats().rejected, 1);
  assert.equal(analytics.getStats().queued, 0);
});

test('a refused token pauses delivery instead of hammering Pulseboard', async () => {
  const http = fakeHttp([{ status: 401, data: { error: { code: 'unauthorized' } } }]);
  const analytics = make({ http, authCooldownMs: 60000 });
  analytics.track(clientEvent());

  await analytics.flush({ force: true });
  await analytics.flush();
  await analytics.flush();

  assert.equal(http.calls.length, 1);
  assert.equal(analytics.getStats().queued, 1);
});

test('honours Pulseboard rate limiting (429 retryAfterSeconds)', async () => {
  const http = fakeHttp([{ status: 429, data: { error: { code: 'rate_limited', retryAfterSeconds: 30 } } }]);
  const analytics = make({ http });
  analytics.track(clientEvent());

  await analytics.flush({ force: true });
  const waitMs = analytics.retryAt - Date.now();
  assert.ok(waitMs > 25000 && waitMs <= 30500, `retry in ~30s, got ${waitMs}ms`);
  assert.equal(analytics.getStats().queued, 1);
});

test('the queue is bounded and overflow is dropped without throwing', () => {
  const analytics = make({ http: fakeHttp(), maxQueue: 3 });
  const results = Array.from({ length: 5 }, () => analytics.track(clientEvent()));

  assert.deepEqual(
    results.map(result => result.accepted),
    [true, true, true, false, false]
  );
  assert.equal(results[4].reason, 'queue_full');
  assert.equal(analytics.getStats().dropped, 2);
  assert.equal(analytics.getStats().queued, 3);
});

test('track never throws, even when the transport itself is broken', async () => {
  const http = {
    post: () => {
      throw new Error('synchronous explosion');
    }
  };
  const analytics = make({ http });
  assert.doesNotThrow(() => analytics.track(clientEvent()));
  assert.doesNotThrow(() => analytics.track(undefined));
  await assert.doesNotReject(() => analytics.flush({ force: true }));
});

test('order_created ids are deterministic per order, so a repeat is the same event', async () => {
  const http = fakeHttp();
  const analytics = make({ http });
  const orderId = '65a1b2c3d4e5f60718293a4b';

  assert.equal(uuidV5(`order:${orderId}`), uuidV5(`order:${orderId}`));
  assert.notEqual(uuidV5(`order:${orderId}`), uuidV5('order:65a1b2c3d4e5f60718293a4c'));
  assert.match(uuidV5('x'), /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);

  const first = analytics.trackOrderCreated({ orderId, userId: 'u1' });
  const again = analytics.trackOrderCreated({ orderId, userId: 'u1' });
  const other = analytics.trackOrderCreated({ orderId: '65a1b2c3d4e5f60718293a4c', userId: 'u1' });
  await analytics.flush({ force: true });

  assert.equal(first.accepted, true);
  assert.deepEqual(again, { accepted: false, reason: 'duplicate' });
  assert.equal(other.accepted, true);
  const sent = http.calls.flatMap(call => call.body.events);
  assert.equal(sent.length, 2);
  assert.ok(sent.every(event => event.type === 'order_created' && event.page === '/order/success' && !('productId' in event)));
});

test('server-side session ids are pseudonymous and stable; the browser session wins when valid', () => {
  const analytics = make({ sessionSecret: 'a-secret' });
  const other = make({ sessionSecret: 'another-secret' });
  const userId = '65a1b2c3d4e5f60718293a99';

  const a = analytics.pseudonymousSession(userId);
  assert.equal(a, analytics.pseudonymousSession(userId));
  assert.notEqual(a, analytics.pseudonymousSession('65a1b2c3d4e5f60718293a98'));
  assert.notEqual(a, other.pseudonymousSession(userId), 'depends on the secret');
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(a.replace(/-/g, '').includes(userId), false);

  const events = [];
  const capture = make({ http: { post: async (url, body) => events.push(...body.events) } });
  const browserSession = uuid();
  capture.trackOrderCreated({ orderId: 'o1', userId, sessionId: browserSession });
  capture.trackOrderCreated({ orderId: 'o2', userId, sessionId: 'not-a-uuid' });
  return capture.flush({ force: true }).then(() => {
    assert.equal(events.find(e => e.eventId === uuidV5('order:o1')).sessionId, browserSession);
    assert.equal(
      events.find(e => e.eventId === uuidV5('order:o2')).sessionId,
      capture.pseudonymousSession(userId)
    );
  });
});

test('shutdown flushes what it can and reports what is left', async () => {
  const delivered = make({ http: fakeHttp() });
  delivered.track(clientEvent());
  assert.equal(await delivered.shutdown(1000), 0);

  const down = make({ http: fakeHttp(Array.from({ length: 5 }, () => ({ status: 503 }))) });
  down.track(clientEvent());
  assert.equal(await down.shutdown(1000), 1);
});

// The classification above depends on how the real axios client reports failures.
test('works against a real HTTP server through axios (success, 503, 401)', async () => {
  const received = [];
  let mode = 'ok';
  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      received.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(raw) });
      const status = mode === 'ok' ? 202 : mode === 'down' ? 503 : 401;
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(status === 202 ? { ok: true, data: {} } : { ok: false, error: { code: 'x', message: 'x' } }));
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;

  try {
    const analytics = new Analytics({
      url,
      token: 'real-axios-token',
      log: silent,
      flushIntervalMs: 60000,
      backoffInitialMs: 1,
      backoffMaxMs: 1,
      authCooldownMs: 60000
    });
    const event = clientEvent({ type: 'add_to_cart', productId: 'blue-mug' });
    analytics.track(event);

    mode = 'down';
    await analytics.flush({ force: true });
    assert.equal(analytics.getStats().queued, 1, 'kept after a real 503');

    mode = 'ok';
    await analytics.flush({ force: true });
    assert.equal(analytics.getStats().queued, 0);
    const last = received[received.length - 1];
    assert.equal(last.url, '/api/events');
    assert.equal(last.auth, 'Bearer real-axios-token');
    assert.equal(last.body.events[0].eventId, event.eventId);
    assert.equal(last.body.events[0].productId, 'blue-mug');

    mode = 'unauthorized';
    analytics.track(clientEvent());
    const before = received.length;
    await analytics.flush({ force: true });
    await analytics.flush();
    assert.equal(received.length, before + 1, 'paused after a real 401');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
