import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    host: '0.0.0.0',
    // Cloudflare Quick Tunnel처럼 개발 중 임시 도메인으로 접속하는 경우를 허용합니다.
    allowedHosts: true,
  },
});
