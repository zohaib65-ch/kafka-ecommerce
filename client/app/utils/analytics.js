 /**
 *
 * analytics.js
 * Anonymous storefront events (page views, product clicks, cart changes) for Pulseboard.
 *
 * Events go to the store's own API (POST {API_URL}/track), which validates them and relays them
 * to Pulseboard; the browser never talks to Pulseboard or Kafka and holds no credentials for them.
 * Orders are not tracked here: the server emits `order_created` itself once an order is saved.
 *
 * Privacy: events carry a random per-tab session id, a pathname (never a query string), and a
 * product slug. The login token is never attached (no Authorization header, no cookies), tracking
 * is skipped for visitors who send Do Not Track / Global Privacy Control, and routes that contain
 * secrets or record ids (password reset, merchant signup, dashboard, order pages) are not tracked.
 *
 * Delivery is best effort: a small in-memory queue, batched, retried a few times with the SAME
 * event ids (the server and Pulseboard discard duplicates). Failures are silent by design.
 */

import { API_URL } from '../constants';

const SESSION_KEY = 'analytics_session_id';
const ENDPOINT = `${API_URL}/track`;

const FLUSH_DELAY_MS = 1000;
const RETRY_BASE_MS = 2000;
const MAX_BATCH = 10;
const MAX_QUEUE = 100;
const MAX_ATTEMPTS = 4;

const PRODUCT_ID_RE = /^[a-z0-9][a-z0-9_-]*$/;
const MAX_PRODUCT_ID_LENGTH = 64;

let queue = [];
let timer = null;
let memorySession = null;
let initialized = false;
let lastPage;

const randomUuid = () => {
  const cryptoApi = typeof window !== 'undefined' ? window.crypto : undefined;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => `0${byte.toString(16)}`.slice(-2)).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-');
};

// Anonymous, random, and scoped to this tab; it is not derived from the user or the login.
export const getSessionId = () => {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomUuid();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (error) {
    // Storage can be unavailable (private mode, blocked cookies): fall back to this page load.
    if (!memorySession) memorySession = randomUuid();
    return memorySession;
  }
};

const trackingAllowed = () => {
  if (!API_URL || typeof window === 'undefined') return false;
  const nav = window.navigator || {};
  const doNotTrack = nav.doNotTrack || window.doNotTrack || nav.msDoNotTrack;
  if (doNotTrack === '1' || doNotTrack === 'yes') return false;
  return nav.globalPrivacyControl !== true;
};

// Only storefront routes are tracked, and ids are collapsed out of the ones that have them.
export const normalizePath = pathname => {
  if (typeof pathname !== 'string') return null;
  const path = pathname.split(/[?#]/)[0];
  if (path === '/') return '/';
  if (/^\/order\/success(\/|$)/.test(path)) return '/order/success';
  if (/^\/(shop|product)(\/|$)/.test(path)) return path;
  if (/^\/(sell|contact|brands|login|register)\/?$/.test(path)) {
    return path.replace(/\/$/, '');
  }
  return null;
};

// The product slug when it fits Pulseboard's id rules, otherwise the database id.
export const analyticsProductId = product => {
  if (!product) return null;
  const slug = typeof product.slug === 'string' ? product.slug : '';
  if (
    slug &&
    slug.length <= MAX_PRODUCT_ID_LENGTH &&
    PRODUCT_ID_RE.test(slug)
  ) {
    return slug;
  }
  const id = typeof product._id === 'string' ? product._id.toLowerCase() : '';
  return PRODUCT_ID_RE.test(id) ? id : null;
};

const send = (events, unloading) =>
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
    // Lets the request finish while the page is closing; cookies and auth headers are never sent.
    keepalive: Boolean(unloading),
    credentials: 'omit'
  });

const schedule = delay => {
  if (timer) return;
  timer = setTimeout(() => {
    flush(false); // eslint-disable-line no-use-before-define
  }, delay);
};

const requeue = batch => {
  const retry = batch
    .map(entry => ({ event: entry.event, attempts: entry.attempts + 1 }))
    .filter(entry => entry.attempts < MAX_ATTEMPTS);
  if (retry.length === 0) return;
  queue = retry.concat(queue).slice(0, MAX_QUEUE);
  const attempts = Math.max(...retry.map(entry => entry.attempts));
  schedule(RETRY_BASE_MS * Math.pow(2, attempts - 1));
};

const flush = unloading => {
  timer = null;
  if (queue.length === 0) return Promise.resolve();

  const batch = queue.splice(0, MAX_BATCH);
  return send(batch.map(entry => entry.event), unloading)
    .then(
      response => {
        // Server trouble or throttling is worth retrying; a 4xx will not change.
        if (response.status >= 500 || response.status === 429) requeue(batch);
      },
      () => requeue(batch)
    )
    .then(() => {
      if (queue.length > 0) schedule(FLUSH_DELAY_MS);
    });
};

const track = (type, { page, fallbackPage, productId }) => {
  try {
    if (!trackingAllowed()) return;

    const path = normalizePath(
      page === undefined ? window.location.pathname : page
    );
    const eventPage = path || fallbackPage;
    if (!eventPage) return;

    const event = {
      eventId: randomUuid(),
      type,
      sessionId: getSessionId(),
      page: eventPage
    };
    if (productId) event.productId = productId;

    queue.push({ event, attempts: 0 });
    if (queue.length > MAX_QUEUE) queue.shift();
    schedule(queue.length >= MAX_BATCH ? 0 : FLUSH_DELAY_MS);
  } catch (error) {
    // Analytics must never break the shop.
  }
};

export const trackProductClick = product => {
  const productId = analyticsProductId(product);
  if (productId) {
    track('product_click', { productId, fallbackPage: '/shop' });
  }
};

export const trackAddToCart = product => {
  const productId = analyticsProductId(product);
  if (productId) {
    track('add_to_cart', { productId, fallbackPage: '/cart' });
  }
};

export const trackRemoveFromCart = product => {
  const productId = analyticsProductId(product);
  if (productId) {
    track('remove_from_cart', { productId, fallbackPage: '/cart' });
  }
};

// Starts page view tracking for a react-router history object. Safe to call more than once.
export const initAnalytics = history => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const pageView = location => {
    const page = normalizePath(location.pathname);
    // Remember untracked pages too, so coming back from one counts as a new view.
    if (page === lastPage) return;
    lastPage = page;
    if (page) track('page_view', { page });
  };

  pageView(history.location);
  history.listen(pageView);

  window.addEventListener('pagehide', () => {
    flush(true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });
};
