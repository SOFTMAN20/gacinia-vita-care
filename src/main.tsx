import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { RealtimeProvider } from './providers/RealtimeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RealtimeProvider>
      <App />
    </RealtimeProvider>
  </StrictMode>
);
