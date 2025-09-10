import { db } from '../utils/db';
import { saveBase64Image } from '../utils/image';


export default defineEventHandler(async (event) => {
const body = await readBody<{ title: string; content: string; image: string }>(event);
if (!body?.title || !body?.content || !body?.image) {
throw createError({ statusCode: 400, statusMessage: 'title, content, image는 필수입니다.' });
}
const name = saveBase64Image(body.image);
const stmt = db.prepare(`INSERT INTO entries (title, content, image_name) VALUES (?, ?, ?)`);
const info = stmt.run(body.title, body.content, name);
const row = db.prepare(`SELECT id, title, content, image_name, created_at FROM entries WHERE id = ?`).get(info.lastInsertRowid);
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    image_url: `/api/uploads/${row.image_name}`,
    created_at: row.created_at
  };
});