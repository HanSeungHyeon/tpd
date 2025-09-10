<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const emit = defineEmits(['locked','snapshot']);
const canvasRef = ref<HTMLCanvasElement|null>(null);
let ctx: CanvasRenderingContext2D|null = null;
let drawing = false, started = false, locked = false;
let remain = 10_000;
let lastTs = 0;
let rafId = 0;
let prev: {x:number,y:number}|null = null;

const isReady = ref(false);
const isPaused = ref(false);
const strokeWidth = ref(3);
const strokeColor = ref('#000000');
const customColor = ref('#000000');
const remainTime = ref(10_000);

const colors = [
  { color: '#000000', name: '검정' },
  { color: '#e03131', name: '빨강' },
  { color: '#1971c2', name: '파랑' },
  { color: '#2f9e44', name: '초록' },
  { color: '#f08c00', name: '노랑' },
  { color: '#9c36b5', name: '보라' },
  { color: '#ff8c00', name: '주황' }
];

function getPos(e: MouseEvent | TouchEvent) {
  const c = canvasRef.value!;
  const r = c.getBoundingClientRect();
  const scaleX = c.width / r.width;
  const scaleY = c.height / r.height;
  
  if (e instanceof TouchEvent && e.touches[0]) {
    return { 
      x: (e.touches[0].clientX - r.left) * scaleX, 
      y: (e.touches[0].clientY - r.top) * scaleY 
    };
  }
  const me = e as MouseEvent;
  return { 
    x: (me.clientX - r.left) * scaleX, 
    y: (me.clientY - r.top) * scaleY 
  };
}

function startDrawing() {
  if (!isReady.value) {
    isReady.value = true;
    ctx!.strokeStyle = strokeColor.value;
    ctx!.lineWidth = strokeWidth.value;
    startTimer();
  }
}

function startTimer() {
  lastTs = performance.now();
  rafId = requestAnimationFrame(tick);
}

function tick(ts: number) {
  const delta = ts - lastTs;
  remain -= delta;
  remainTime.value = remain;
  lastTs = ts;
  
  if (remain <= 0) {
    lockCanvas();
    return;
  }
  
  rafId = requestAnimationFrame(tick);
}

function lockCanvas() {
  locked = true;
  canvasRef.value!.style.opacity = '0.95';
  emit('locked', true);
  emit('snapshot', canvasRef.value!.toDataURL('image/png'));
}

function down(e: MouseEvent | TouchEvent) {
  if (locked) return;
  
  if (!isReady.value) {
    startDrawing();
    return;
  }
  
  if (isPaused.value) return;
  
  drawing = true;
  prev = getPos(e);
}

function move(e: MouseEvent | TouchEvent) {
  if (locked || !isReady.value || isPaused.value) return;
  const p = getPos(e);
  if (!drawing) return;
  ctx!.beginPath();
  ctx!.moveTo(prev!.x, prev!.y);
  ctx!.lineTo(p.x, p.y);
  ctx!.stroke();
  prev = p;
}

function up() {
  drawing = false;
}

function updateStrokeStyle(color: string) {
  strokeColor.value = color;
  if (ctx && !locked) {
    ctx.strokeStyle = color;
  }
}

function updateStrokeWidth(width: number) {
  strokeWidth.value = width;
  if (ctx && !locked) {
    ctx.lineWidth = width;
  }
}

function clearCanvas() {
  if (!ctx || !canvasRef.value) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  if (!isReady.value) {
    startDrawing();
  }
}

function updateCustomColor(color: string) {
  customColor.value = color;
  updateStrokeStyle(color);
}

onMounted(() => {
  const c = canvasRef.value!;
  ctx = c.getContext('2d');
  if (!ctx) return;
  
  ctx.lineWidth = strokeWidth.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = strokeColor.value;
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="draw-container">
    <div class="canvas-section">
      <div class="canvas-header">
        <span class="canvas-title">그림 (10초 제한)</span>
        <button class="time-reset-btn" v-if="isReady && remainTime > 0">
          {{ Math.ceil(remainTime / 1000) }}초 남음
        </button>
        <button class="time-reset-btn time-finished" v-else-if="isReady && remainTime <= 0">
          시간 종료!
        </button>
        <span class="time-waiting" v-else>
          캔버스를 클릭하여 시작
        </span>
      </div>
      
      <div class="canvas-wrapper">
        <canvas
          ref="canvasRef"
          width="600"
          height="400"
          :class="['drawing-canvas', { locked }]"
          @mousedown="down"
          @mousemove="move"
          @mouseup="up"
          @mouseleave="up"
          @touchstart="down"
          @touchmove="move"
          @touchend="up"
        ></canvas>
      </div>
      
      <div class="color-controls">
        <button 
          v-for="c in colors" 
          :key="c.color"
          class="color-circle"
          :class="{ active: strokeColor === c.color }"
          :style="{ backgroundColor: c.color }"
          @click="updateStrokeStyle(c.color)"
        ></button>
        
        <div class="size-control">
          펜 크기: 
          <input 
            type="range" 
            min="1" 
            max="20" 
            v-model="strokeWidth"
            @input="updateStrokeWidth(Number(strokeWidth))"
            class="size-slider"
          >
          <div 
            class="size-preview-circle" 
            :style="{ 
              width: strokeWidth + 'px', 
              height: strokeWidth + 'px', 
              backgroundColor: strokeColor 
            }"
          ></div>
        </div>
        
        <button class="clear-btn" @click="clearCanvas">
          그리기 시작
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.draw-container {
  width: 100%;
  max-width: 600px;
}

.canvas-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.canvas-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.time-reset-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-reset-btn:not(.time-finished) {
  background: #4263eb;
}

.time-waiting {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.canvas-wrapper {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
  max-width: 600px;
}

.drawing-canvas {
  display: block;
  width: 100%;
  height: auto;
  max-width: 600px;
  max-height: 400px;
  background: white;
  cursor: crosshair;
}

.drawing-canvas.locked {
  cursor: not-allowed;
  opacity: 0.8;
}

.color-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.color-circle {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-circle:hover {
  transform: scale(1.1);
}

.color-circle.active {
  border-color: #4263eb;
  transform: scale(1.2);
}

.size-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.size-slider {
  width: 80px;
}

.size-preview-circle {
  border-radius: 50%;
  border: 1px solid #ccc;
}

.clear-btn {
  background: #4263eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
}

.clear-btn:hover {
  background: #3452d1;
}
</style>