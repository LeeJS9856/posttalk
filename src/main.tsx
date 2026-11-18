import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import { AdsProvider } from '@/hooks/useAds';
import { AdDraftProvider } from '@/hooks/useAdDraft';
import { AuthProvider } from '@/hooks/useAuth';
import { ShopProvider } from '@/hooks/useShop';
import { WorkspaceProvider } from '@/hooks/useWorkspace';
import GlobalStyle from '@/styles/GlobalStyle';

// 설치형 웹앱으로 쓰려면 서비스 워커가 있어야 한다. 개발 중에는 켜지 않는다.
// 껍데기를 캐시해 두는 워커가 끼면 고친 화면이 바로 반영되지 않는다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      <ShopProvider>
        <WorkspaceProvider>
          <AdsProvider>
            <AdDraftProvider>
              <App />
            </AdDraftProvider>
          </AdsProvider>
        </WorkspaceProvider>
      </ShopProvider>
    </AuthProvider>
  </StrictMode>,
);
