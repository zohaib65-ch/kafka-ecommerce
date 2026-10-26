// Run with: npm test (Node >= 18 for the built-in test runner and global fetch)
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const crypto = require('crypto');
const express = require('express');

const uuid = () => crypto.randomUUID();

// A fake Pulseboard that records what it receives. Set BEFORE the service is loaded: the
// singleton reads its configuration from the environment once.
const pulseboard = { requests: [], status: 202 };
const pulseboardServer = http.createServer((req, res) => {
  let raw = '';
  req.on('data', chunk => (raw += chunk));
  req.on('end', () => {
    pulseboard.requests.push({
      url: req.url,
      headers: req.headers,
      body: JSON.parse(raw)
    });
    res.writeHead(pulseboard.status, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: pulseboard.status === 202 }));
  });
});

let app;
let base;
let analytics;

test.before(async () => {
  await new Promise(resolve => pulseboardServer.listen(0, '127.0.0.1', resolve));
  process.env.PULSEBOARD_URL = `http://127.0.0.1:${pulseboardServer.address().port}`;
  process.env.PULSEBOARD_ADMIN_TOKEN = 'route-test-token-not-a-secret';
  process.env.JWT_SECRET = 'route-test-jwt';

  analytics = require('../services/analytics');
  const trackRoutes = require('../routes/api/track');

  const server = express();
  server.use(express.json());
  server.use('/api/track', trackRoutes);
  app = http.createServer(server);
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${app.address().port}/api/track`;
});

test.after(async () => {
  await analytics.shutdown(1000);
  await new Promise(resolve => app.close(resolve));
  await new Promise(resolve => pulseboardServer.close(resolve));
});

const post = (body, headers = {}) =>
  fetch(base, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });

const event = (overrides = {}) => ({
  type: 'page_view',
  eventId: uuid(),
  sessionId: uuid(),
  page: '/shop',
  ...overrides
});

const delivered = async () => {
  await analytics.flush({ force: true });
  return pulseboard.requests.flatMap(request => request.body.events);
};

test('accepts valid browser events with 202 and forwards them as store events', async () => {
  const click = event({ type: 'product_click', productId: 'blue-mug', page: '/shop?utm=x' });
  const response = await post({ events: [click, event({ type: 'page_view', page: '/' })] });

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: 2 });

  const sent = await delivered();
  const forwarded = sent.find(item => item.eventId === click.eventId);
  assert.equal(forwarded.source, 'store');
  assert.equal(forwarded.page, '/shop', 'query string stripped');
  assert.equal(forwarded.productId, 'blue-mug');
  const request = pulseboard.requests[pulseboard.requests.length - 1];
  assert.equal(request.url, '/api/events');
  assert.equal(request.headers.authorization, 'Bearer route-test-token-not-a-secret');
});

test('never forwards what the browser sends beyond the whitelisted fields, or its credentials', async () => {
  const spoofed = {
    ...event(),
    email: 'shopper@example.com',
    password: 'hunter2',
    token: 'jwt-from-body',
    source: 'simulator',
    timestamp: '1999-01-01T00:00:00Z'
  };
  const before = pulseboard.requests.length;
  const response = await post(
    { events: [spoofed] },
    { authorization: 'Bearer shopper-jwt-must-not-leak', cookie: 'sid=secret' }
  );
  assert.equal(response.status, 202);

  await analytics.flush({ force: true });
  const requests = pulseboard.requests.slice(before);
  const forwarded = requests.flatMap(request => request.body.events).find(item => item.eventId === spoofed.eventId);
  assert.deepEqual(Object.keys(forwarded).sort(), ['eventId', 'page', 'sessionId', 'source', 'timestamp', 'type']);
  assert.equal(forwarded.source, 'store');
  assert.notEqual(forwarded.timestamp, '1999-01-01T00:00:00Z');
  const wire = JSON.stringify(requests);
  for (const secret of ['hunter2', 'shopper@example.com', 'jwt-from-body', 'shopper-jwt-must-not-leak', 'sid=secret']) {
    assert.equal(wire.includes(secret), false, `${secret} must not reach Pulseboard`);
  }
});

test('order events are authoritative: the browser cannot submit them', async () => {
  const forged = event({ type: 'order_created', page: '/order/success' });
  const response = await post({ events: [forged] });

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: 0 });
  assert.equal((await delivered()).some(item => item.eventId === forged.eventId), false);
});

test('does not track pages that carry secrets or ids', async () => {
  const leaky = [
    event({ page: '/reset-password/abc123secret' }),
    event({ page: '/dashboard/orders' }),
    event({ page: '/order/success/65a1b2c3d4e5f60718293a4b' })
  ];
  const response = await post({ events: leaky });
  assert.deepEqual(await response.json(), { accepted: 1 });

  const sent = await delivered();
  assert.equal(JSON.stringify(sent).includes('abc123secret'), false);
  assert.equal(JSON.stringify(sent).includes('65a1b2c3d4e5f60718293a4b'), false);
  assert.equal(sent.find(item => item.eventId === leaky[2].eventId).page, '/order/success');
});

test('rejects malformed envelopes with 400', async () => {
  for (const body of [{}, { events: [] }, { events: 'x' }, { events: Array.from({ length: 11 }, () => event()) }, []]) {
    assert.equal((await post(body)).status, 400, JSON.stringify(body).slice(0, 40));
  }
});

test('a client retrying the same events is not double counted', async () => {
  const click = event({ type: 'add_to_cart', productId: 'blue-mug' });
  const first = await (await post({ events: [click] })).json();
  const retry = await (await post({ events: [click] })).json();
  assert.deepEqual(first, { accepted: 1 });
  assert.deepEqual(retry, { accepted: 0 });
  const count = (await delivered()).filter(item => item.eventId === click.eventId).length;
  assert.equal(count, 1);
});

test('shopping is unaffected when Pulseboard is down: still 202, events wait for retry', async () => {
  pulseboard.status = 503;
  const click = event({ type: 'product_click', productId: 'red-lamp' });
  const response = await post({ events: [click] });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: 1 });

  await analytics.flush({ force: true });
  assert.ok(analytics.getStats().queued >= 1, 'kept for retry, not lost and not an error to the shopper');

  pulseboard.status = 202;
  await analytics.flush({ force: true });
  assert.equal(analytics.getStats().queued, 0);
  assert.ok((await delivered()).some(item => item.eventId === click.eventId));
});

test('rate limits a single client instead of flooding Pulseboard', async () => {
  let limited = 0;
  for (let i = 0; i < 20 && limited === 0; i += 1) {
    const response = await post({ events: Array.from({ length: 10 }, () => event()) });
    if (response.status === 429) {
      limited += 1;
      assert.ok(Number(response.headers.get('retry-after')) > 0);
    }
  }
  assert.equal(limited, 1, 'a 429 appears once the per-minute event allowance is used up');
});
