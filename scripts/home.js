'use strict';

const hero = `
<section class="home-hero" aria-labelledby="home-hero-title">
  <div class="home-hero-copy">
    <span class="home-hero-eyebrow">LUCKYLOTUS · PERSONAL ARCHIVE</span>
    <h1 id="home-hero-title">把学习写成路径，<br><span>把生活留作坐标。</span></h1>
    <p>这里收藏课程笔记、技术实践与生活片段。愿每一次整理，都让来时的路更清晰。</p>
    <nav class="home-hero-actions" aria-label="首页快捷入口">
      <a href="#latest-posts">阅读文章</a>
      <a href="/wiki/">进入知识库</a>
      <a href="/moments/">查看近期心得</a>
    </nav>
  </div>
  <div class="home-hero-index" aria-hidden="true">
    <span><b>01</b>LEARNING</span>
    <span><b>02</b>NOTES</span>
    <span><b>03</b>MOMENTS</span>
  </div>
</section>
<h2 class="home-section-title" id="latest-posts">近期文章</h2>`;

hexo.extend.filter.register('after_render:html', function addHomepageHero(html, data) {
  if (data?.path !== 'index.html' || html.includes('class="home-hero"')) return html;
  return html.replace('<div class="post-list post">', `${hero}\n<div class="post-list post">`);
});
