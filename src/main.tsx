import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import { AdDraftProvider } from '@/hooks/useAdDraft';
import { AuthProvider } from '@/hooks/useAuth';
import GlobalStyle from '@/styles/GlobalStyle';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      <AdDraftProvider>
        <App />
      </AdDraftProvider>
    </AuthProvider>
  </StrictMode>,
);
