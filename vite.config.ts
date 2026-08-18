import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }, },
    server: {
      host: '0.0.0.0',
      // Cloudflare Quick Tunnel처럼 개발 중 임시 도메인으로 접속하는 경우를 허용합니다.
      allowedHosts: true,
      proxy: {
        '/api/admin': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (request) => {
              if (env.ADMIN_API_KEY) request.setHeader('x-admin-api-key', env.ADMIN_API_KEY);
            });
          },
        },
      },
    },
  };
});
