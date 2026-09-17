'use strict';
const { escapeHTML } = require('hexo-util');

hexo.extend.tag.register('pdf', function (args) {
  const source = args[0] || '';
  const height = /^\d{2,4}(?:px|vh)$/.test(args[1] || '') ? args[1] : '720px';
  if (!/^(?:\/|https:\/\/)/i.test(source) || /["'<>\s]/.test(source)) {
    return '<p class="pdf-error">PDF 地址无效：仅支持站内绝对路径或 HTTPS 地址。</p>';
  }
  const url = escapeHTML(source);
  return `<figure class="pdf-embed"><iframe src="${url}#view=FitH" title="PDF 文档" loading="lazy" style="height:${height}"></iframe><figcaption>若浏览器无法显示，请 <a href="${url}" target="_blank" rel="noopener">打开或下载 PDF</a>。</figcaption></figure>`;
});
