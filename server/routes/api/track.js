const express = require('express');
const router = express.Router();

const analytics = require('../../services/analytics');

// Public endpoint (visitors are anonymous), so it is small, bounded and rate limited per client.
const MAX_EVENTS_PER_REQUEST = 10;
const WINDOW_MS = 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 120;

const windows = new Map();

const clientKey = req => req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';

// Fixed-window counter in memory; per process, which is enough to stop one client flooding the queue.
const allow = (key, cost) => {
  const now = Date.now();
  let entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    windows.set(key, entry);
  }
  if (entry.count + cost > MAX_EVENTS_PER_WINDOW) return false;
  entry.count += cost;
  return true;
};

const sweep = setInterval(() => {
  const now = Date.now();
  windows.forEach((entry, key) => {
    if (entry.resetAt <= now) windows.delete(key);
  });
}, WINDOW_MS);
if (sweep.unref) sweep.unref();

/**
 * Receives browser events (page views, product clicks, cart changes) and hands them to the
 * analytics queue. It answers 202 as soon as the events are queued: whether Pulseboard or Kafka
 * is reachable is invisible to the browser, so tracking can never slow down or break the shop.
 * Only whitelisted fields are used (see services/analytics.js); order events are never accepted
 * from the browser.
 */
router.post('/', (req, res) => {
  const events = req.body && req.body.events;

  if (
    !Array.isArray(events) ||
    events.length === 0 ||
    events.length > MAX_EVENTS_PER_REQUEST
  ) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  if (!allow(clientKey(req), events.length)) {
    res.set('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
    return res.status(429).json({ error: 'Too many requests.' });
  }

  let accepted = 0;
  events.forEach(event => {
    if (analytics.track(event).accepted) accepted += 1;
  });

  res.status(202).json({ accepted });
});

module.exports = router;
