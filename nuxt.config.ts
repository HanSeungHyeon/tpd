export default defineNuxtConfig({
  ssr: false,
  app: { head: { title: '10초 그림일기' } },
  nitro: { preset: 'node-server' },
  runtimeConfig: {
    public: {
    apiBase: '' // 동일 오리진 사용
    }
  }
});