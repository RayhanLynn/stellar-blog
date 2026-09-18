'use strict';

// 将个人笔记库复制为 Stellar 知识库。只读取 D:\LRH study，不修改源文件。
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const wikiRoot = path.join(root, 'source', 'wiki');
const dataRoot = path.join(root, 'source', '_data', 'wiki');
const assetRoot = path.join(root, 'source', 'assets', 'wiki-images');
const noteRoot = 'D:\\LRH study\\LRH learning\\02 research\\03 专业课学习';
const imageRoot = 'D:\\LRH study\\LRH learning\\image';
const banner = '/assets/snow-mountain-lake.jpg';

const collections = [
  {
    id: 'networks',
    title: '计算机网络',
    description: '从引言、物理层到应用层，按课程章节整理计算机网络知识。',
    cover: '/assets/wiki-network-cover.jpg',
    source: path.join(noteRoot, '计算机网络'),
    groups: [
      ['第一章 · 引言', [['01 引言.md', '01-introduction', '第一章 · 引言']]],
      ['第二章 · 物理层', [['02 物理层.md', '02-physical-layer', '第二章 · 物理层']]],
      ['第三章 · 数据链路层', [['03 数据链路层.md', '03-data-link-layer', '第三章 · 数据链路层']]],
      ['第四章 · 介质访问控制子层', [['04 介质访问控制子层.md', '04-mac-sublayer', '第四章 · 介质访问控制子层']]],
      ['第五章 · 网络层', [['05 网络层.md', '05-network-layer', '第五章 · 网络层']]],
      ['第六章 · 传输层', [['06 传输层.md', '06-transport-layer', '第六章 · 传输层']]],
      ['第七章 · 应用层', [['07 应用层.md', '07-application-layer', '第七章 · 应用层']]],
    ],
  },
  {
    id: 'computer-organization',
    title: '计算机组成与结构',
    description: '按课程目录整理计算机系统、存储器、运算方法、CPU 与控制单元。',
    cover: '/assets/wiki-computer-organization-cover.jpg',
    source: path.join(noteRoot, '计算机组成与结构'),
    groups: [
      ['复习资料', [['复习大纲.md', 'review-outline', '复习大纲']]],
      ['第一章 · 计算机系统概述', [['01 计算机系统概述/计算机系统概述.md', '01-system-overview', '计算机系统概述']]],
      ['第四章 · 存储器', [
        ['04 存储器/存储器概述知识.md', '04-memory-overview', '存储器概述'],
        ['04 存储器/高速缓冲存储器Cache.md', '04-cache', '高速缓冲存储器 Cache'],
        ['04 存储器/主存储器.md', '04-main-memory', '主存储器'],
      ]],
      ['第五章 · 输入输出系统', [['05 输入输出系统/输入输出系统.md', '05-io-system', '输入输出系统']]],
      ['第六章 · 计算机的运算方法', [
        ['06 计算机的运算方法/数值性数据的表示方法.md', '06-numeric-data-representation', '数值性数据的表示方法'],
        ['06 计算机的运算方法/定点运算.md', '06-fixed-point-arithmetic', '定点运算'],
        ['06 计算机的运算方法/算术逻辑单元（不太考）.md', '06-alu', '算术逻辑单元（不太考）'],
      ]],
      ['第七章 · 指令系统', [['07 指令系统/指令系统.md', '07-instruction-set', '指令系统']]],
      ['第八章 · CPU 的结构和功能', [
        ['08 CPU的结构和功能/CPU的结构和功能.md', '08-cpu-structure-function', 'CPU 的结构和功能'],
        ['08 CPU的结构和功能/指令周期和指令流水.md', '08-instruction-cycle-pipeline', '指令周期和指令流水'],
        ['08 CPU的结构和功能/中断系统.md', '08-interrupt-system', '中断系统'],
      ]],
      ['第九章 · 控制单元的功能', [
        ['09 控制单元的功能/控制单元的功能.md', '09-control-unit-function', '控制单元的功能'],
        ['09 控制单元的功能/微操作命令的分析.md', '09-micro-operation-analysis', '微操作命令的分析'],
      ]],
      ['第十章 · 控制单元的设计', [
        ['10 控制单元的设计/组合逻辑设计.md', '10-combinational-control-design', '组合逻辑设计'],
        ['10 控制单元的设计/微程序设计.md', '10-microprogram-design', '微程序设计'],
      ]],
      ['补充内容', [
        ['补充内容/比特、字节、字.md', 'extra-bit-byte-word', '比特、字节与字'],
        ['补充内容/组合逻辑电路.md', 'extra-combinational-logic', '组合逻辑电路'],
        ['补充内容/时序逻辑电路.md', 'extra-sequential-logic', '时序逻辑电路'],
      ]],
    ],
  },
];

function assertInside(target, parent) {
  const relative = path.relative(parent, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`拒绝操作工作区外路径：${target}`);
  }
}

function stripFrontMatter(markdown) {
  const clean = markdown.replace(/^\uFEFF/, '');
  const front = clean.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  return front ? clean.slice(front[0].length) : clean;
}

const copiedImages = new Map();
const missingImages = new Set();
function importImage(originalName) {
  const cleanName = originalName.split('|')[0].trim();
  const source = path.join(imageRoot, cleanName);
  if (!fs.existsSync(source)) {
    missingImages.add(cleanName);
    return null;
  }
  if (copiedImages.has(cleanName)) return copiedImages.get(cleanName);
  const extension = path.extname(cleanName).toLowerCase() || '.bin';
  const hash = crypto.createHash('sha1').update(cleanName).digest('hex').slice(0, 14);
  const destinationName = `${hash}${extension}`;
  fs.copyFileSync(source, path.join(assetRoot, destinationName));
  copiedImages.set(cleanName, destinationName);
  return destinationName;
}

function normalizeMarkdown(markdown) {
  let body = stripFrontMatter(markdown).trimStart();
  body = body.replace(/!\[\[([^\]]+)\]\]/g, (_, imageSpec) => {
    const originalName = imageSpec.split('|')[0].trim();
    const imported = importImage(imageSpec);
    return imported
      ? `![${originalName}](/assets/wiki-images/${imported})`
      : `> 原笔记图片未找到：\`${originalName}\``;
  });
  body = body.replace(/!\[([^\]|]+)\|(\d+)\]\((https?:\/\/[^)]+)\)/g,
    (_, alt, width, url) => `<img src="${url}" alt="${alt}" style="max-width:${width}px;width:100%;height:auto;">`);
  return body.trimEnd() + '\n';
}

for (const collection of collections) {
  if (!fs.existsSync(collection.source)) throw new Error(`找不到笔记目录：${collection.source}`);
}

fs.mkdirSync(wikiRoot, { recursive: true });
fs.mkdirSync(dataRoot, { recursive: true });
fs.mkdirSync(assetRoot, { recursive: true });

// 只重建本脚本管理的课程，保留独立导入的其他知识库。
for (const collection of collections) {
  const wikiTarget = path.join(wikiRoot, collection.id);
  const dataTarget = path.join(dataRoot, `${collection.id}.yml`);
  assertInside(wikiTarget, wikiRoot);
  assertInside(dataTarget, dataRoot);
  fs.rmSync(wikiTarget, { recursive: true, force: true });
  fs.rmSync(dataTarget, { force: true });
}
for (const entry of fs.readdirSync(assetRoot)) {
  const target = path.join(assetRoot, entry);
  assertInside(target, assetRoot);
  fs.rmSync(target, { recursive: true, force: true });
}

fs.writeFileSync(
  path.join(wikiRoot, 'index.md'),
  '---\ntitle: 知识库\nlayout: index_wiki\nmenu_id: wiki\nbanner: /assets/snow-mountain-lake.jpg\n---\n',
  'utf8',
);
fs.writeFileSync(
  path.join(root, 'source', '_data', 'wiki.yml'),
  [...collections.map(collection => collection.id), 'xi-thought-question-bank'].map(id => `- ${id}`).join('\n') + '\n',
  'utf8',
);

let articleCount = 0;
for (const collection of collections) {
  const destinationDir = path.join(wikiRoot, collection.id);
  fs.mkdirSync(destinationDir, { recursive: true });

  const tree = { 开始: ['index'] };
  const indexLinks = [];
  for (const [groupTitle, articles] of collection.groups) {
    tree[groupTitle] = [];
    for (const [relativeSource, slug, title] of articles) {
      const source = path.join(collection.source, relativeSource);
      if (!fs.existsSync(source)) throw new Error(`缺少源笔记：${source}`);
      const body = normalizeMarkdown(fs.readFileSync(source, 'utf8'));
      const frontMatter = {
        title,
        layout: 'page',
        wiki: collection.id,
        menu_id: 'wiki',
        banner,
      };
      fs.writeFileSync(
        path.join(destinationDir, `${slug}.md`),
        `---\n${yaml.dump(frontMatter, { lineWidth: -1 })}---\n\n${body}`,
        'utf8',
      );
      tree[groupTitle].push(slug);
      indexLinks.push(`- [${groupTitle} · ${title}](/wiki/${collection.id}/${slug}/)`);
      articleCount++;
    }
  }

  const indexMeta = {
    title: collection.title,
    layout: 'page',
    wiki: collection.id,
    menu_id: 'wiki',
    banner,
  };
  const indexBody = `# 章节目录\n\n${collection.description}\n\n${indexLinks.join('\n')}\n`;
  fs.writeFileSync(
    path.join(destinationDir, 'index.md'),
    `---\n${yaml.dump(indexMeta, { lineWidth: -1 })}---\n\n${indexBody}`,
    'utf8',
  );

  const data = {
    name: collection.title,
    title: collection.title,
    description: collection.description,
    cover: collection.cover,
    tags: ['计算机基础'],
    path: `/wiki/${collection.id}/`,
    base_dir: `wiki/${collection.id}/`,
    icon: '/assets/avatar.jpg',
    toc: true,
    tree,
  };
  fs.writeFileSync(path.join(dataRoot, `${collection.id}.yml`), yaml.dump(data, { lineWidth: -1 }), 'utf8');
}

console.log(`已同步 ${collections.length} 个知识库、${articleCount} 篇笔记、${copiedImages.size} 张本地图片。`);
if (missingImages.size) {
  console.warn(`有 ${missingImages.size} 张图片未在 ${imageRoot} 找到：`);
  for (const image of missingImages) console.warn(`- ${image}`);
}
