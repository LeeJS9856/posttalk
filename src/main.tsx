import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import { AdDraftProvider } from '@/hooks/useAdDraft';
import GlobalStyle from '@/styles/GlobalStyle';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.error('Service worker registration failed.', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <AdDraftProvider>
      <App />
    </AdDraftProvider>
  </StrictMode>,
);
