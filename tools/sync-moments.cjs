'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'source', '_data', 'moments.yml');
const pagePath = path.join(root, 'source', 'moments', 'index.md');
const widgetsPath = path.join(root, 'source', '_data', 'widgets.yml');

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const moments = yaml.load(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(moments) || moments.length === 0) throw new Error('moments.yml 至少需要一条心得');

const momentIds = new Set();
for (const moment of moments) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(moment.id)) throw new Error(`心得 id 格式错误：${moment.id ?? '(empty)'}`);
  if (momentIds.has(moment.id)) throw new Error(`心得 id 重复：${moment.id}`);
  momentIds.add(moment.id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(moment.date)) throw new Error(`心得 date 格式错误：${moment.date ?? '(empty)'}`);
  if (!moment.text) throw new Error(`心得 ${moment.id} 缺少 text`);
}

const cards = moments.map(moment => {
  const id = `moment-${escapeHtml(moment.id)}`;
  const displayTime = moment.time ? `${escapeHtml(moment.date)} ${escapeHtml(moment.time)}` : escapeHtml(moment.date);
  const datetime = `${escapeHtml(moment.date)}${moment.time ? `T${escapeHtml(moment.time)}:00+08:00` : ''}`;
  const photo = moment.image
    ? `\n    <img class="moment-photo" src="${escapeHtml(moment.image)}" alt="${escapeHtml(moment.image_alt || '心得照片')}">`
    : '';
  const likeAliases = [...new Set([moment.date, ...(moment.like_aliases || [])])]
    .filter(alias => alias && alias !== moment.id)
    .map(alias => `moment-${escapeHtml(alias)}`)
    .join(',');
  const aliasAttribute = likeAliases ? ` data-like-aliases="${likeAliases}"` : '';
  return `  <article class="moment-card" id="${id}">
    <header><img src="/assets/avatar.jpg" alt="Luckylotus"><div><strong>Luckylotus</strong><time datetime="${datetime}">${displayTime}</time></div></header>
    <p>${escapeHtml(moment.text)}</p>${photo}
    <footer><button type="button" class="moment-like" data-like-id="${id}"${aliasAttribute} aria-pressed="false" aria-label="喜欢这条心得">♡ <span>0</span></button><a href="#comments">▢ 写评论</a><button type="button" data-share>⌯ 分享</button></footer>
  </article>`;
}).join('\n');

const page = `---
title: 近期心得
layout: page
menu_id: moments
rightbar: toolbox
description: 一些短暂但值得留下的想法。
banner: /assets/moments-cover.jpg
---

<div class="moments-intro"><span>THOUGHTS & MOMENTS</span><h2>把日常的小事，留在时间里。</h2><p>学习、生活和偶尔停下来的片刻。照片可以有，也可以只有几句话。</p></div>

<div class="moments-grid">
${cards}
</div>
`;
fs.writeFileSync(pagePath, page, 'utf8');

const sidebar = moments.slice(0, 5).map(moment => {
  const id = `moment-${escapeHtml(moment.id)}`;
  const displayTime = `${escapeHtml(moment.date)}${moment.time ? ` ${escapeHtml(moment.time)}` : ''}`;
  return `  <a class="thought-link" href="/moments/#${id}" aria-label="查看 ${escapeHtml(moment.date)} 的近期心得"><article class="thought"><header><img src="/assets/avatar.jpg" alt=""><strong>Luckylotus</strong><time>${displayTime}</time></header><p>${escapeHtml(moment.text)}</p></article></a>`;
}).join('\n');

const widgets = yaml.load(fs.readFileSync(widgetsPath, 'utf8'));
widgets.journal.content = `<div class="thought-stream">\n${sidebar}\n</div>\n`;
fs.writeFileSync(widgetsPath, yaml.dump(widgets, { lineWidth: -1, noRefs: true }), 'utf8');

console.log(`已同步 ${moments.length} 条近期心得到心得页和首页侧栏。`);
