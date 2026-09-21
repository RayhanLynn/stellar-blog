'use strict';

const cover = `
<section class="home-cover" aria-labelledby="home-cover-title">
  <div class="home-cover-center">
    <span class="home-cover-eyebrow">LUCKYLOTUS</span>
    <h1 id="home-cover-title">Luckylotus</h1>
    <p>记录我的学习和生活</p>
  </div>
  <nav class="home-cover-nav" aria-label="首页快捷入口">
    <a href="/"><svg class="icon" data-icon="default:documents" aria-hidden="true"></svg><span>首页</span></a>
    <a href="/wiki/"><svg class="icon" data-icon="example:notebook" aria-hidden="true"></svg><span>知识库</span></a>
    <a href="/moments/"><svg class="icon" data-icon="default:bookmark.active" aria-hidden="true"></svg><span>心得</span></a>
    <a href="/archives/"><svg class="icon" data-icon="default:calendar" aria-hidden="true"></svg><span>归档</span></a>
    <a href="/about/"><svg class="icon" data-icon="default:shield-user" aria-hidden="true"></svg><span>关于</span></a>
  </nav>
  <a class="home-cover-scroll" href="#start" aria-label="向下浏览">⌄</a>
</section>`;

hexo.extend.filter.register('after_render:html', function addHomepageHero(html, data) {
  if (data?.path !== 'index.html' || html.includes('class="home-cover"')) return html;
  html = html.replace('<div id="l_cover"></div>', `<div id="l_cover">${cover}</div>`);
  return html.replace('<div class="post-list post">', '<h2 class="home-section-title" id="latest-posts">近期文章</h2>\n<div class="post-list post">');
});
