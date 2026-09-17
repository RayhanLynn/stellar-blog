document.addEventListener('click', async event => {
  const like = event.target.closest('[data-like-id]');
  if (like) {
    const key = `luckylotus-like:${like.dataset.likeId}`;
    const active = localStorage.getItem(key) !== '1';
    if (active) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
    renderLike(like, active);
    return;
  }
  const button = event.target.closest('[data-share]');
  if (!button) return;
  const card = button.closest('.moment-card');
  const text = card?.querySelector('p')?.textContent?.trim() || document.title;
  try {
    if (navigator.share) await navigator.share({ title: document.title, text, url: location.href });
    else { await navigator.clipboard.writeText(location.href); button.textContent = '✓ 已复制链接'; }
  } catch (error) {
    if (error.name !== 'AbortError') button.textContent = '复制失败';
  }
});

function renderLike(button, active) {
  button.classList.toggle('is-liked', active);
  button.setAttribute('aria-pressed', String(active));
  button.firstChild.textContent = active ? '♥ ' : '♡ ';
  const count = button.querySelector('span');
  if (count) count.textContent = active ? '1' : '0';
}

function restoreLikes() {
  document.querySelectorAll('[data-like-id]').forEach(button => {
    renderLike(button, localStorage.getItem(`luckylotus-like:${button.dataset.likeId}`) === '1');
  });
}

function renderCalendars() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  document.querySelectorAll('[data-calendar]').forEach(calendar => {
    const cells = [];
    for (let index = 0; index < firstDay; index++) cells.push('<span class="is-empty" aria-hidden="true"></span>');
    for (let day = 1; day <= days; day++) {
      const isToday = day === now.getDate();
      cells.push(`<span${isToday ? ' class="is-today" aria-current="date"' : ''}>${day}</span>`);
    }
    calendar.innerHTML = `<header><strong>${year} 年 ${month + 1} 月</strong><a href="/archives/" title="查看归档">归档 ↗</a></header><div class="calendar-week">${weekdays.map(day => `<b>${day}</b>`).join('')}</div><div class="calendar-days">${cells.join('')}</div>`;
  });
}

function initializePersonalWidgets() {
  renderCalendars();
  restoreLikes();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePersonalWidgets);
else initializePersonalWidgets();
