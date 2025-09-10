import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';


const uploadRoot = join(process.cwd(), 'server', 'uploads');
if (!existsSync(uploadRoot)) mkdirSync(uploadRoot, { recursive: true });


export function saveBase64Image(dataUrl: string) {
const m = dataUrl.match(/^data:(.+);base64,(.*)$/);
if (!m) throw new Error('Invalid image data');
const ext = m[1].split('/')[1] || 'png';
const buf = Buffer.from(m[2], 'base64');
const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
writeFileSync(join(uploadRoot, name), buf);
return name; // 실제 서빙은 /api/uploads/:name 으로 제공
}


export function removeImage(name: string) {
const p = join(uploadRoot, name);
if (existsSync(p)) unlinkSync(p);
}