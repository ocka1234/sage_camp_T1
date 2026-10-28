// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js
// test edit

export function init(ctx) {
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'ค้นหาประกาศ...';
  ctx.toolbar.append(input);

  let query = '';
  ctx.addFilter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return String(item.title ?? '').toLowerCase().includes(q) ||
      String(item.body ?? '').toLowerCase().includes(q);
  });

  input.addEventListener('input', () => {
    query = input.value.trim();
    ctx.render();
  });
}
