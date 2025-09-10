import { db } from '../utils/db';
export default defineEventHandler((event) => {
  const q = getQuery(event);
  const limit = Math.min(parseInt((q.limit as string) || '100'), 200);
  const offset = parseInt((q.offset as string) || '0');
  const rows = db.prepare(`SELECT id, title, content, image_name, created_at FROM entries ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    image_url: `/api/uploads/${r.image_name}`,
    created_at: r.created_at
  }));
});