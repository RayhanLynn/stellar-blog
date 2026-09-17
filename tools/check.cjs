const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const cheerio = require('cheerio');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'public');
let pages=0;
function inspect(dir) {
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) {inspect(file);continue;}
    if(!file.endsWith('.html')) continue;
    pages++;
    const $=cheerio.load(fs.readFileSync(file,'utf8'));
    assert($('title').text(),'Missing page title: '+file);
    for(const a of $('a[href]').toArray()) {
      const href=$(a).attr('href');
      if(!href.startsWith('/') || href.startsWith('//')) continue;
      const url=new URL(href,'https://example.com');
      let destination=path.join(output,decodeURIComponent(url.pathname));
      if(fs.existsSync(destination)&&fs.statSync(destination).isDirectory()) destination=path.join(destination,'index.html');
      assert(fs.existsSync(destination),file+' links to missing '+href);
    }
  }
}
inspect(output);
const home=cheerio.load(fs.readFileSync(path.join(output,'index.html'),'utf8'));
assert.equal(home('.page-footer .sitemap-group').length,4,'Footer sitemap groups missing');
assert.equal(home('#busuanzi_site_pv').length,1,'Site page-view counter missing');
assert.equal(home('#busuanzi_site_uv').length,1,'Site visitor counter missing');
assert.equal(home('#site-runtime-days[data-start="2026-09-16"]').length,1,'Site runtime counter missing');
assert(home('script[src="/assets/site-stats.js"]').length,'Site runtime script missing');
assert(fs.readFileSync(path.join(output,'assets/site-stats.js'),'utf8').includes('cdn.busuanzi.cc/busuanzi/3.6.9'),'Visitor counter loader missing');
assert.equal(home('.thought-link[href^="/moments/#moment-"]').length,3,'Recent thoughts are not linked');
assert.equal(home('.l_left a.social[href="https://github.com/RayhanLynn"]').length,1,'GitHub sidebar link missing');
assert(home('link[href="/assets/fonts/lxgw/lxgwwenkai-regular.css"]').length,'LXGW WenKai stylesheet missing');
for(const page of ['privacy','license','disclaimer']) assert(fs.existsSync(path.join(output,page,'index.html')),`Missing footer page: ${page}`);
const fontCssPath=path.join(output,'assets/fonts/lxgw/lxgwwenkai-regular.css');
assert(fs.existsSync(fontCssPath),'LXGW WenKai CSS was not published');
const fontCss=fs.readFileSync(fontCssPath,'utf8');
const fontFile=fontCss.match(/url\(['"]?\.\/files\/([^)'"\s]+)/);
assert(fontFile,'LXGW WenKai CSS has no font URL');
assert(fs.existsSync(path.join(output,'assets/fonts/lxgw/files',fontFile[1])),'LXGW WenKai font subset was not published');
const chapter=cheerio.load(fs.readFileSync(path.join(output,'wiki/networks/02-physical-layer/index.html'),'utf8'));
assert(chapter('.katex').length>=7,'Math did not render');
assert.equal(chapter('.katex-error').length,0,'Invalid math');
assert(chapter('[data-reading-content]').length,'Missing reading progress content');
for(const el of chapter('article.content h2,article.content h3').toArray()) assert(chapter(el).attr('id'),'Missing heading anchor');
for(const a of chapter('.toc a[href^="#"]').toArray()) {
  const id=decodeURIComponent(chapter(a).attr('href').slice(1));
  if(id) assert(chapter('[id]').toArray().some(el=>chapter(el).attr('id')===id),'Broken TOC: '+id);
}
assert(chapter('a[href="/wiki/networks/01-introduction/"]').length,'Previous chapter missing');
assert(chapter('a[href="/wiki/networks/03-data-link-layer/"]').length,'Next chapter missing');
assert(fs.existsSync(path.join(output,'wiki/computer-organization/10-microprogram-design/index.html')),'Nested computer-organization notes missing');
assert.equal(fs.readdirSync(path.join(root,'source/wiki/networks')).filter(file=>file.endsWith('.md')).length,8,'Network note count changed');
assert.equal(fs.readdirSync(path.join(root,'source/wiki/computer-organization')).filter(file=>file.endsWith('.md')).length,21,'Computer-organization note count changed');
assert(fs.readFileSync(path.join(output,'search.json'),'utf8').includes('物理层'),'Chapters absent from search');
const moments=cheerio.load(fs.readFileSync(path.join(output,'moments/index.html'),'utf8'));
for(const id of ['moment-2026-09-16','moment-2026-09-13','moment-2026-09-09']) assert.equal(moments('#'+id).length,1,'Missing moment anchor: '+id);
assert.equal(moments('[data-like-id]').length,3,'Moment like buttons missing');
assert.equal(moments('#comments #giscus[data-repo="RayhanLynn/stellar-blog"][data-repo-id="R_kgDOUearhA"][data-category-id="DIC_kwDOUearhM4DFynb"]').length,1,'Giscus configuration missing');
assert(!moments.text().includes('公开评论将在部署时绑定'),'Static comment placeholder remains');
const about=cheerio.load(fs.readFileSync(path.join(output,'about/index.html'),'utf8'));
assert(about('.article.banner[style*="snow-mountain-lake"] .bg').length,'About banner image missing');
fs.mkdirSync(path.join(root,'.checks'),{recursive:true});
const fixture=fs.mkdtempSync(path.join(root,'.checks','import-'));
fs.mkdirSync(path.join(fixture,'tools'),{recursive:true});
fs.mkdirSync(path.join(fixture,'source/_data/wiki'),{recursive:true});
fs.copyFileSync(path.join(root,'tools/import-note.cjs'),path.join(fixture,'tools/import-note.cjs'));
fs.writeFileSync(path.join(fixture,'source/_data/wiki/networks.yml'),'name: 网络\ntree: {}\n');
const body='# 中文标题\n\n公式 $t_1 = \\frac{L}{R}$。\n\n$$\nA = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}\n$$\n';
fs.writeFileSync(path.join(fixture,'note.md'),body);
const args=[path.join(fixture,'tools/import-note.cjs'),path.join(fixture,'note.md'),'--series','networks','--chapter','第四章','--slug','chapter-four'];
assert.equal(spawnSync(process.execPath,args).status,0,'Import failed');
const imported=fs.readFileSync(path.join(fixture,'source/wiki/networks/chapter-four.md'),'utf8');
assert(imported.endsWith(body),'Importer changed Markdown/TeX');
assert(fs.readFileSync(path.join(fixture,'source/_data/wiki/networks.yml'),'utf8').includes('chapter-four'),'Missing directory entry');
assert.equal(spawnSync(process.execPath,args).status,1,'Importer should reject overwrite');
assert.equal(spawnSync(process.execPath,[...args.slice(0,-1),'../../escape']).status,1,'Importer should reject path traversal');
console.log(`PASS: ${pages} pages, local links, 27 imported study notes, 85 local note images, linked thoughts, page banners, footer, visitor counters, local LXGW WenKai, math rendering, TOC, chapter navigation, search index, importer and overwrite protection.`);
