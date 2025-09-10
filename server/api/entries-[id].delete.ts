import { db } from '../utils/db';
import { removeImage } from '../utils/image';


export default defineEventHandler((event) => {
const id = Number(getRouterParam(event, 'id'));
const row = db.prepare(`SELECT image_name FROM entries WHERE id = ?`).get(id);
if (!row) throw createError({ statusCode: 404, statusMessage: '존재하지 않는 일기입니다.' });
removeImage(row.image_name);
db.prepare(`DELETE FROM entries WHERE id = ?`).run(id);
return { ok: true };
});