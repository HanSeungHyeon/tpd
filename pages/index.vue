<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listEntries, deleteEntry } from '~/composables/api';


const items = ref<any[]>([]);
async function load(){ items.value = await listEntries(); }
async function removeItem(id:number){ if(confirm('정말 삭제할까요?')){ await deleteEntry(id); load(); } }


onMounted(load);
</script>


<template>
<div class="container">
<header class="head">
<h1>10초 그림일기</h1>
<NuxtLink to="/write" class="btn">일기 쓰기</NuxtLink>
</header>


<section class="grid">
<article v-for="e in items" :key="e.id" class="card">
<img :src="e.image_url" alt="drawing" />
<div class="body">
<h3>{{ e.title }}</h3>
<p>{{ e.content }}</p>
<div class="actions">
<button class="btn danger" @click="removeItem(e.id)">삭제</button>
</div>
<small class="small">{{ new Date(e.created_at).toLocaleString() }}</small>
</div>
</article>
</section>
</div>
</template>


<style scoped>
.container{ max-width: 920px; margin: 0 auto; padding: 20px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, sans-serif; }
.head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.btn{ padding:8px 12px; border:1px solid #ddd; border-radius:10px; background:#fafafa; cursor:pointer; text-decoration:none; color:inherit; }
.grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap:16px; }
.card{ border:1px solid #e5e5e5; border-radius:14px; overflow:hidden; background:#fff; }
.card img{ width:100%; display:block; aspect-ratio:4/3; object-fit:cover; }
.body{ padding:12px; }
.actions{ margin-top:8px; }
.small{ color:#666; font-size:14px; }
.danger{ border-color:#ff6b6b; color:#ff3b30; }
</style>