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
  const siteStats = [
    { source: document.querySelector('#vercount_value_site_pv'), output: document.querySelector('#site-total-pv') },
    { source: document.querySelector('#vercount_value_site_uv'), output: document.querySelector('#site-total-uv') },
  ];
  const renderSiteStat = ({ source, output }) => {
    if (!source || !output) return;
    const raw = Number(source.textContent.replace(/[^0-9]/g, ''));
    if (!Number.isFinite(raw)) return;
    const base = Number(output.dataset.base || 0);
    const anchor = Number(output.dataset.anchor || 0);
    output.textContent = String(base + Math.max(0, raw - anchor));
  };
  for (const stat of siteStats) {
    if (!stat.source) continue;
    new MutationObserver(() => renderSiteStat(stat)).observe(stat.source, { childList: true, characterData: true, subtree: true });
  }
  const counters = [
    document.querySelector('#site-total-pv'),
    document.querySelector('#site-total-uv'),
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
