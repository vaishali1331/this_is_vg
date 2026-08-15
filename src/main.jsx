import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mounts the React tree into the <div id="root"> defined in index.html.
// StrictMode is dev-only (stripped in production builds) and helps catch
// accidental side effects / deprecated APIs early.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
