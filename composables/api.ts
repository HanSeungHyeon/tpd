export async function listEntries(limit = 100, offset = 0) {
const res = await fetch(`/api/entries?limit=${limit}&offset=${offset}`);
return await res.json();
}
export async function createEntry(payload: { title: string; content: string; image: string }) {
const res = await fetch('/api/entries', {
method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
});
if (!res.ok) throw new Error((await res.json()).message || '생성 실패');
return await res.json();
}
export async function deleteEntry(id: number) {
const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
if (!res.ok) throw new Error('삭제 실패');
return await res.json();
}