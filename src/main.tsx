import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import { AdDraftProvider } from '@/hooks/useAdDraft';
import { AuthProvider } from '@/hooks/useAuth';
import { ShopProvider } from '@/hooks/useShop';
import { WorkspaceProvider } from '@/hooks/useWorkspace';
import GlobalStyle from '@/styles/GlobalStyle';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      <ShopProvider>
        <WorkspaceProvider>
          <AdDraftProvider>
            <App />
          </AdDraftProvider>
        </WorkspaceProvider>
      </ShopProvider>
    </AuthProvider>
  </StrictMode>,
);
