import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './lib/providers';
import App from './App';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);