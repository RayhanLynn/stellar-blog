'use strict';

// 将“经验分享”目录中的公开文章复制到博客。不会修改原始笔记。
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const sourceRoot = 'D:\\LRH study\\LRH learning\\06 经验分享';
const attachmentRoot = 'D:\\LRH study\\LRH learning\\image';
const postsRoot = path.join(root, 'source', '_posts');
const pdfRoot = path.join(root, 'source', 'assets', 'pdfs');

const articles = [
  {
    source: 'SDU-Soft 大二经验分享.md',
    slug: 'sdu-software-sophomore-guide',
    title: 'SDU Soft 大二课程学习经验分享',
    date: '2026-09-17 17:31:00',
    description: '结合个人经历，整理山东大学软件学院大二阶段的课程学习、实验准备与期末复习建议。',
    tags: ['山东大学', '软件学院', '课程学习', '经验分享'],
    categories: ['经验分享'],
  },
];

const pdfs = [
  ['机器学习基础笔记.pdf', 'machine-learning-notes.pdf'],
  ['人工智能综合实践实验一报告 李瑞菡.pdf', 'ai-practice-report.pdf'],
];

function stripFrontMatter(markdown) {
  const clean = markdown.replace(/^\uFEFF/, '');
  const front = clean.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  return front ? clean.slice(front[0].length) : clean;
}

function normalize(markdown) {
  let body = stripFrontMatter(markdown).trim();
  body = body.replace(/^一些小tips：\s*/u, '## 写在前面\n\n');
  body = body.replace(/!\[([^\]|]+)\|(\d+)\]\((https?:\/\/[^)]+)\)/g,
    (_, alt, width, url) => `<img src="${url}" alt="${alt}" style="max-width:${width}px;width:100%;height:auto;">`);
  body = body.replace('[[机器学习基础笔记.pdf]]', '[下载机器学习基础笔记 PDF](/assets/pdfs/machine-learning-notes.pdf)');
  body = body.replace('[[人工智能综合实践实验一报告 李瑞菡.pdf]]', '[查看人工智能综合实践实验报告 PDF](/assets/pdfs/ai-practice-report.pdf)');
  body = body.replace(/^> \[!NOTE\] 说在最后！$/mu, '> **写在最后**');
  return body.trimEnd() + '\n';
}

fs.mkdirSync(postsRoot, { recursive: true });
fs.mkdirSync(pdfRoot, { recursive: true });

for (const [sourceName, destinationName] of pdfs) {
  const source = path.join(attachmentRoot, sourceName);
  if (!fs.existsSync(source)) throw new Error(`缺少文章附件：${source}`);
  fs.copyFileSync(source, path.join(pdfRoot, destinationName));
}

for (const article of articles) {
  const source = path.join(sourceRoot, article.source);
  if (!fs.existsSync(source)) throw new Error(`缺少经验分享文章：${source}`);
  const metadata = {
    title: article.title,
    date: article.date,
    layout: 'post',
    categories: article.categories,
    tags: article.tags,
    description: article.description,
    cover: '/assets/wiki-network-cover.jpg',
    banner: '/assets/snow-mountain-lake.jpg',
  };
  const output = `---\n${yaml.dump(metadata, { lineWidth: -1 })}---\n\n${normalize(fs.readFileSync(source, 'utf8'))}`;
  fs.writeFileSync(path.join(postsRoot, `${article.slug}.md`), output, 'utf8');
}

console.log(`已同步 ${articles.length} 篇经验分享文章和 ${pdfs.length} 份 PDF，原始文件保持不变。`);
