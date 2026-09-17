document.addEventListener('DOMContentLoaded', () => {
  const counter = document.querySelector('#site-runtime-days[data-start]');
  if (counter) {
    const parts = counter.dataset.start.split('-').map(Number);
    const start = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.max(1, Math.floor((today - start) / 86400000) + 1);
    counter.textContent = String(days);
  }

  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (isLocal) {
    const visits = document.querySelector('.site-visits');
    if (visits) visits.title = '本地预览不计入正式站点访问量';
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js';
  script.defer = true;
  document.body.appendChild(script);
});
