'use strict';
// Render TeX before Markdown can consume backslashes or underscores.
const MarkdownIt = require('markdown-it');
const texmath = require('markdown-it-texmath');
const katex = require('katex');
const fs = require('node:fs');
const path = require('node:path');
const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
  .use(texmath, { engine: katex, delimiters: 'dollars', katexOptions: { throwOnError: true, strict: 'warn', trust: false } });
md.core.ruler.push('heading_ids', state => {
  const used = new Map();
  state.tokens.forEach((token, i) => {
    if (token.type !== 'heading_open') return;
    const title = state.tokens[i + 1].content;
    const base = title.trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-|-$/g, '') || 'section';
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    token.attrSet('id', count ? base + '-' + count : base);
  });
});
hexo.extend.renderer.register('md', 'html', data => md.render(data.text), true);
hexo.extend.renderer.register('markdown', 'html', data => md.render(data.text), true);
hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/assets/katex/katex.min.css">');
hexo.extend.filter.register('after_generate', function () {
  const root = path.join(path.dirname(require.resolve('katex')), '..', 'dist');
  for (const name of ['katex.min.css', ...fs.readdirSync(path.join(root, 'fonts')).map(f => 'fonts/' + f)]) {
    hexo.route.set('assets/katex/' + name, () => fs.createReadStream(path.join(root, name)));
  }
});
