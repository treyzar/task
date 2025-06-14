import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Providers } from './lib/providers';
import './styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);