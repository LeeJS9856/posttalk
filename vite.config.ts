import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 개발 서버를 https 로 띄운다. 브라우저는 https 나 localhost 가 아니면 카메라를 막아서,
  // 폰에서 사내망 주소(https://192.168.x.x:5173)로 열어 촬영하려면 필요하다.
  // 인증서는 자체 서명이라 처음 한 번 "고급 → 계속"을 눌러야 한다. 배포 빌드에는 영향이 없다.
  plugins: [react(), basicSsl()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    host: '0.0.0.0',
    // 전시용 기기에서 임시 도메인으로 접속하는 경우를 허용합니다.
    allowedHosts: true,
    // 개발 중에는 /api 를 백엔드로 넘긴다. 백엔드 CORS 가 배포 주소만 열려 있어서다.
    // 배포에서는 vercel.json 이 같은 일을 한다. 백엔드가 바뀌면 둘 다 고친다.
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET ?? 'https://postalkbackend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
