import React, { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { initI18n } from './index';

export const bootstrapApp = async (App: ReactNode) => {
  await initI18n();

  const container = document.getElementById('root');
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <HashRouter>
          {App}
        </HashRouter>
      </StrictMode>
    );
  }
};
