<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
const emit = defineEmits(['locked','snapshot']);
const canvasRef = ref<HTMLCanvasElement|null>(null);
let ctx: CanvasRenderingContext2D|null = null;
let drawing=false, started=false, locked=false; let remain=10_000; let lastTs=0; let rafId=0; let prev:{x:number,y:number}|null=null;


function getPos(e: MouseEvent | TouchEvent){
const c = canvasRef.value!; const r = c.getBoundingClientRect();
if (e instanceof TouchEvent && e.touches[0]) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
const me = e as MouseEvent; return { x: me.clientX - r.left, y: me.clientY - r.top };
}
function startTimer(){ if(started) return; started=true; lastTs=performance.now(); tick(); }
function tick(){ const now=performance.now(); const dt=now-lastTs; lastTs=now; if(!locked){ remain=Math.max(0, remain-dt); const s=document.getElementById('left'); if(s) s.textContent=(remain/1000).toFixed(1); if(remain<=0) lockCanvas(); else rafId=requestAnimationFrame(tick);} }
function lockCanvas(){ locked=true; drawing=false; cancelAnimationFrame(rafId); canvasRef.value!.style.opacity='0.95'; emit('locked', true); emit('snapshot', canvasRef.value!.toDataURL('image/png')); }
function clearCanvas(){ if(locked) return; ctx!.clearRect(0,0,canvasRef.value!.width, canvasRef.value!.height); }
function down(e: MouseEvent | TouchEvent){ if(locked) return; startTimer(); drawing=true; prev=getPos(e); }
function move(e: MouseEvent | TouchEvent){ if(!drawing||locked) return; const p=getPos(e); ctx!.beginPath(); ctx!.moveTo(prev!.x, prev!.y); ctx!.lineTo(p.x, p.y); ctx!.stroke(); prev=p; }
function up(){ drawing=false; }


onMounted(()=>{
const c = canvasRef.value!; ctx = c.getContext('2d');
if(!ctx) return; ctx.lineWidth=3; ctx.lineCap='round'; ctx.lineJoin='round';
c.addEventListener('mousedown', down); c.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
c.addEventListener('touchstart', (e)=>{ e.preventDefault(); down(e); }, { passive:false });
c.addEventListener('touchmove', (e)=>{ e.preventDefault(); move(e); }, { passive:false });
c.addEventListener('touchend', (e)=>{ e.preventDefault(); up(); }, { passive:false });
});


onBeforeUnmount(()=>{ cancelAnimationFrame(rafId); });
</script>


<template>
<div style="display:flex; gap:12px; align-items:center;">
<canvas ref="canvasRef" width="800" height="500" style="border:1px dashed #bbb; border-radius:12px; background:#fff; touch-action:none;"></canvas>
<div>
<div style="font-weight:700">남은시간: <span id="left">10.0</span>s</div>
<div style="margin-top:8px; display:flex; gap:8px;">
<button class="btn" @click="clearCanvas" title="10초가 끝나기 전까지만 초기화 가능">초기화</button>
<button class="btn" @click="lockCanvas" title="더 이상 못 그리도록 잠금">잠금</button>
</div>
<p style="color:#666; font-size:14px;">첫 드로잉이 시작되면 타이머가 작동합니다. 락이 걸리면 수정할 수 없습니다.</p>
</div>
</div>
</template>


<style scoped>
.btn{ padding:8px 12px; border:1px solid #ddd; border-radius:10px; background:#fafafa; cursor:pointer; }
</style>