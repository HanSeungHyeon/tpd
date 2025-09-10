import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import mime from 'mime';


export default defineEventHandler((event) => {
const name = getRouterParam(event, 'name') as string;
const filePath = join(process.cwd(), 'server', 'uploads', name);
if (!existsSync(filePath)) throw createError({ statusCode: 404, statusMessage: 'Not Found' });
const buf = readFileSync(filePath);
const type = mime.getType(name) || 'application/octet-stream';
setHeader(event, 'Content-Type', type);
return buf; // Nitro가 Buffer 응답 처리
});