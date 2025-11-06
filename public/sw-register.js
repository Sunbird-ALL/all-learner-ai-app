// public/sw-register.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('[PWA] Service Worker registered successfully.'))
      .catch((err) => console.error('[PWA] Service Worker registration failed:', err));
  }
  