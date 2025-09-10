<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listEntries, deleteEntry } from '~/composables/api';
import '~/assets/styles/common.css';
import '~/assets/styles/index.css';


const items = ref<any[]>([]);
async function load(){ items.value = await listEntries(); }
async function removeItem(id:number){ if(confirm('정말 삭제할까요?')){ await deleteEntry(id); load(); } }


onMounted(load);
</script>


<template>
<div class="container">
<header class="head">
  <div class="logo">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17V7c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4v10c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 7h8M8 12h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
  <h1>10초 그림일기</h1>
</header>

<section class="grid">
  <NuxtLink to="/write" class="card add-card">
    <div class="add-content">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>새 일기 쓰기</span>
    </div>
  </NuxtLink>
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


