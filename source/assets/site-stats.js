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
  const counters = [
    document.querySelector('#vercount_value_site_pv'),
    document.querySelector('#vercount_value_site_uv'),
    document.querySelector('#vercount_value_page_pv'),
  ].filter(Boolean);
  const showUnavailable = () => {
    for (const counter of counters) {
      if (counter.textContent.trim() === '加载中') counter.textContent = '—';
    }
  };
  if (isLocal) {
    const visits = document.querySelector('.site-visits');
    if (visits) visits.title = '本地预览不计入正式站点访问量';
    const pageViews = document.querySelector('#vercount_value_page_pv');
    if (pageViews) {
      pageViews.closest('.post-page-views')?.setAttribute('title', '本地预览不计入正式文章阅读量');
    }
    showUnavailable();
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://events.vercount.one/js';
  script.defer = true;
  script.onerror = showUnavailable;
  document.body.appendChild(script);
  window.setTimeout(showUnavailable, 8000);
});
