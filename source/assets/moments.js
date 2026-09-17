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
  const url = new URL(location.href);
  if (card?.id) url.hash = card.id;
  const original = button.dataset.originalText || button.textContent;
  button.dataset.originalText = original;
  try {
    if (typeof navigator.share === 'function') {
      await navigator.share({ title: document.title, text, url: url.href });
      showShareResult(button, '✓ 已分享', original);
    } else {
      await copyText(url.href);
      showShareResult(button, '✓ 已复制', original);
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    try {
      await copyText(url.href);
      showShareResult(button, '✓ 已复制', original);
    } catch {
      showShareResult(button, '请手动复制地址', original, 2400);
    }
  }
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('copy failed');
}

function showShareResult(button, message, original, delay = 1600) {
  button.textContent = message;
  clearTimeout(Number(button.dataset.restoreTimer || 0));
  const timer = setTimeout(() => {
    button.textContent = original;
    delete button.dataset.restoreTimer;
  }, delay);
  button.dataset.restoreTimer = String(timer);
}

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
