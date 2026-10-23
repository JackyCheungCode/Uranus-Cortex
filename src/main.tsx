import React from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@carbon/react';
import App from './App';
import '@carbon/styles/css/styles.css';
import './styles.css';
import './design-system/tokens/index.css';
import './design-system/themes/dark.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme theme="g10">
      <App />
    </Theme>
  </React.StrictMode>,
);
