import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

async function withServer(callback) {
  const srv = await startTestServer();
  try {
    await callback(srv);
  } finally {
    await srv.close();
  }
}

test('PATCH /api/announcements/:id แก้ประกาศได้และคง body เดิม', async () => {
  await withServer(async (srv) => {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'Updated title' });

    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'Updated title');
    assert.equal(res.data.body, 'แอปนี้ใช้ฝึก Git, Pull Request, CI และการ Deploy ด้วย Docker / PM2');
  });
});

test('PATCH /api/announcements/:id ส่งหัวข้อว่างตอบ 400', async () => {
  await withServer(async (srv) => {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: '   ' });

    assert.equal(res.status, 400);
    assert.equal(typeof res.data.error, 'string');
  });
});

test('PATCH /api/announcements/:id ที่ไม่พบตอบ 404', async () => {
  await withServer(async (srv) => {
    const res = await srv.request('PATCH', '/api/announcements/9999', { title: 'x' });

    assert.equal(res.status, 404);
    assert.equal(typeof res.data.error, 'string');
  });
});

test('PATCH ไม่บันทึกฟิลด์อื่นนอกจาก title และ body', async () => {
  await withServer(async (srv) => {
    const res = await srv.request('PATCH', '/api/announcements/1', {
      title: 'Again',
      pinned: true,
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'Again');
    assert.equal(Object.hasOwn(res.data, 'pinned'), false);
  });
});