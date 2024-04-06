import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import routes from './routes';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <BrowserRouter>{routes}</BrowserRouter>
  </ErrorBoundary>
);
