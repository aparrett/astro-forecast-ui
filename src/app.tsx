import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import routes from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{routes}</BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);
