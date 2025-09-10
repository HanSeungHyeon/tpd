<script setup lang="ts">
import { ref } from 'vue';
import { createEntry } from '~/composables/api';
import DrawBoard from '~/components/DrawBoard.client.vue';


const title = ref('');
const content = ref('');
const locked = ref(false);
const imageData = ref('');


async function submit(){
if(!title.value.trim() || !content.value.trim()) return alert('제목과 내용을 입력해 주세요.');
if(!locked.value){
if(!confirm('아직 10초가 지나지 않았어요. 지금 그만 그리고 저장할까요?')) return;
}
try{
await createEntry({ title: title.value.trim(), content: content.value.trim(), image: imageData.value });
await navigateTo('/');
}catch(e:any){ alert(e.message || '저장 실패'); }
}
</script>


<template>
<div class="container">
<header class="head">
<NuxtLink to="/" class="btn">← 리스트</NuxtLink>
<h1>일기 작성</h1>
<div></div>
</header>


<label>제목</label>
<input class="input" v-model="title" maxlength="100" placeholder="제목을 입력해 주세요" />


<label style="display:block;margin-top:12px;">그림 (10초 동안만 그릴 수 있어요)</label>
<DrawBoard @locked="v=>locked=v" @snapshot="v=>imageData=v" />


<label style="display:block;margin-top:12px;">내용</label>
<textarea class="textarea" v-model="content" rows="5" placeholder="내용을 입력해 주세요" />


<div class="actions" style="margin-top:12px;">
<button class="btn" @click="submit">저장</button>
</div>
</div>
</template>


<style scoped>
.container{ max-width: 920px; margin: 0 auto; padding: 20px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, sans-serif; }
.head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.btn{ padding:8px 12px; border:1px solid #ddd; border-radius:10px; background:#fafafa; cursor:pointer; text-decoration:none; color:inherit; }
.input, .textarea{ width:100%; padding:10px; border:1px solid #ddd; border-radius:10px; }
</style>