import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Main.tsx: Loading...');

const rootElement = document.getElementById('root');
console.log('Main.tsx: Root element found:', !!rootElement);

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
