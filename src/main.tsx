import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import flow test helper in development
if (import.meta.env.DEV) {
  import('./utils/flowTestHelper');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);