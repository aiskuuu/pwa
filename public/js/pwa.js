if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker terdaftar:', reg.scope))
      .catch(err => console.log('❌ Gagal daftarkan SW:', err));
  });
}
