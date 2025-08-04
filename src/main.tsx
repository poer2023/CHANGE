import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 全局错误处理
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  console.error('Stack:', e.error?.stack);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);