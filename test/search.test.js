import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;

before(async () => {
  srv = await startTestServer();
});

after(async () => {
  await srv.close();
});

test('search case-insensitive', async () => {
  const res = await srv.request('GET', '/api/search?q=DOCKER');
  assert.equal(res.status, 200);
  assert.ok(res.data.some((x) => x.id === 1));
});

test('no q returns all', async () => {
  const res = await srv.request('GET', '/api/search');
  assert.equal(res.status, 200);
  assert.equal(res.data.length, 2);
});

test('not found returns empty', async () => {
  const res = await srv.request('GET', '/api/search?q=zzzz');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
});

test('special char does not crash', async () => {
  const res = await fetch(`${srv.baseUrl}/api/search?q=%28`);
  assert.equal(res.status, 200);
});
