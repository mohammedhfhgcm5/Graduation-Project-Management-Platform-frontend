import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';

import App from '@/App';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n';
import '@/index.css';
import { queryClient } from '@/lib/queryClient';
import { store } from '@/store/redux/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>,
);
