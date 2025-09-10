<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createEntry } from '~/composables/api';
import DrawBoard from '~/components/DrawBoard.client.vue';
import '~/assets/styles/common.css';
import '~/assets/styles/write.css';


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
await useRouter().push('/');
}catch(e:any){ alert(e.message || '저장 실패'); }
}
</script>


<template>
<div class="container">
  <header class="head">
    <NuxtLink to="/" class="back-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      리스트로 돌아가기
    </NuxtLink>
    <h1>10초 그림일기 작성</h1>
  </header>

  <div class="form-group">
    <label class="label">
      <span class="label-text">제목</span>
      <span class="label-required">*</span>
    </label>
    <input 
      class="input" 
      v-model="title" 
      maxlength="100" 
      placeholder="오늘의 그림일기 제목을 입력해 주세요" 
    />
  </div>

  <div class="form-group">
    <label class="label">
      <span class="label-text">그림</span>
      <span class="label-required">*</span>
      <span class="label-hint">10초 동안만 그릴 수 있어요</span>
    </label>
    <DrawBoard 
      @locked="v=>locked=v" 
      @snapshot="v=>imageData=v" 
    />
  </div>

  <div class="form-group">
    <label class="label">
      <span class="label-text">내용</span>
      <span class="label-required">*</span>
    </label>
    <textarea 
      class="textarea" 
      v-model="content" 
      rows="5" 
      placeholder="오늘 있었던 일을 자유롭게 적어주세요" 
    />
  </div>

  <div class="actions">
    <button class="submit-btn" @click="submit" :disabled="!title.trim() || !content.trim()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      저장하기
    </button>
  </div>
</div>
</template>

