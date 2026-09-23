hexo.extend.filter.register('after_render:html', function configureBlogHome(html, data) {
  // Stellar hardcodes the root URL in article breadcrumbs and the 404 link.
  // Keep these home controls inside the blog rather than returning to the entrance.
  html = html.replace(/(<a\b[^>]*\bclass=["'][^"']*\bbreadcrumb\b[^"']*["'][^>]*\bhref=["'])\/(["'])/g, '$1/blog/$2');
  html = html.replace(/(<a\b[^>]*\bid=["']back["'][^>]*\bhref=["'])\/(["'])/g, '$1/blog/$2');
  if (/^posts\/[^/]+\/index\.html$/.test(data?.path || '')) {
    const views = '<span class="sep post-page-views-sep"></span><span class="text post-page-views">阅读：<strong id="busuanzi_page_pv">加载中</strong> 次</span>';
    html = html.replace(/(<div class="flex-row" id="post-meta">[\s\S]*?)(<\/div>)/, `$1${views}$2`);
  }
  if (data?.path !== 'blog/index.html') return html;
  return html.replace('<div class="post-list post">', '<h2 class="home-section-title" id="latest-posts">近期文章</h2>\n<div class="post-list post">');
});
