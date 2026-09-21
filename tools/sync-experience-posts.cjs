'use strict';

// 将“经验分享”目录中的公开文章复制到博客。不会修改原始笔记。
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const sourceRoot = 'D:\\LRH study\\LRH learning\\06 经验分享';
const attachmentRoot = 'D:\\LRH study\\LRH learning\\image';
const advancedMlNote = 'D:\\LRH study\\LRH learning\\02 research\\03 专业课学习\\高级机器学习\\01 一些往年题的汇总.md';
const postsRoot = path.join(root, 'source', '_posts');
const pdfRoot = path.join(root, 'source', 'assets', 'pdfs');
const notesRoot = path.join(root, 'source', 'assets', 'notes');

const articles = [
  {
    source: 'SDU-Software 大二经验分享.md',
    slug: 'sdu-software-sophomore-guide',
    title: 'SDU Software 大二课程学习经验分享',
    date: '2026-09-17 17:31:00',
    description: '结合个人经历，整理山东大学软件学院大二阶段的课程学习、实验准备与期末复习建议。',
    tags: ['sdu', '软件学院', '课程学习', '经验分享'],
    categories: ['经验分享'],
  },
];

const pdfs = [
  ['机器学习基础笔记.pdf', 'machine-learning-notes.pdf'],
  ['人工智能综合实践实验一报告 李瑞菡.pdf', 'ai-practice-report.pdf'],
  ['算法笔记.pdf', 'algorithm-notes.pdf'],
  ['高级机器学习笔记.pdf', 'advanced-machine-learning-notes.pdf'],
  ['科技英语题库整理.pdf', 'technical-english-question-bank.pdf'],
  ['练习题_大题整理版.pdf', 'marxism-long-answer-practice.pdf'],
];

// 这份手写笔记原件约 380 MB。仓库保存经过清晰度检查的压缩版，
// 同步文章时不要再用原件覆盖，否则会超过 GitHub 100 MB 的单文件限制。
const keepCompressedPdfs = new Set(['algorithm-notes.pdf']);

function stripFrontMatter(markdown) {
  const clean = markdown.replace(/^\uFEFF/, '');
  const front = clean.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  return front ? clean.slice(front[0].length) : clean;
}

function normalize(markdown) {
  let body = stripFrontMatter(markdown).trim();
  // 目录要求正文从一级标题开始；课程标题的序号交给主题目录统一生成。
  body = body.replace(/^一些小tips：\s*/u, '# 写在前面\n\n');
  body = body.replace(/^##\s+\d+[.．、]\s*/gmu, '## ');
  body = body.replace(/^(学分：[^\r\n]+)$/gmu, '**$1**');
  body = body.replace(/^(考试|网课|刷题|推荐网课|重点)：\s*([^\r\n]*)$/gmu, '**$1：** $2');
  body = body.replace(/!\[([^\]|]+)\|(\d+)\]\((https?:\/\/[^)]+)\)/g,
    (_, alt, width, url) => `<img src="${url}" alt="${alt}" style="max-width:${width}px;width:100%;height:auto;">`);
  body = body.replace('[[机器学习基础笔记.pdf]]', '[下载机器学习基础笔记 PDF](/assets/pdfs/machine-learning-notes.pdf)');
  body = body.replace('[[人工智能综合实践实验一报告 李瑞菡.pdf]]', '[查看人工智能综合实践实验报告 PDF](/assets/pdfs/ai-practice-report.pdf)');
  body = body.replace('[[算法笔记.pdf]]', '[下载算法设计与分析笔记 PDF](/assets/pdfs/algorithm-notes.pdf)');
  body = body.replace('[[高级机器学习笔记.pdf]]', '[下载高级机器学习笔记 PDF](/assets/pdfs/advanced-machine-learning-notes.pdf)');
  body = body.replace('[[科技英语题库整理.pdf]]', '[下载科技英语题库整理 PDF](/assets/pdfs/technical-english-question-bank.pdf)');
  body = body.replace('[[练习题_大题整理版.pdf]]', '[下载马克思主义基本原理大题整理 PDF](/assets/pdfs/marxism-long-answer-practice.pdf)');
  body = body.replace('[[01 一些往年题的汇总]]', '[下载高级机器学习往年题汇总](/assets/notes/advanced-machine-learning-past-exams.txt)');
  body = body.replace(/\*\*<u>([^\n]*?)<\/u>(?!\*\*)/gu, '<strong><u>$1</u></strong>');
  body = body.replace(/^> \[!NOTE\] 说在最后！$/mu, '> **写在最后**');
  // Obsidian 原稿以单换行区分段落，标准 Markdown 会把它们合并成一段。
  // 保留连续列表和引用，其余非空行之间补一个空行。
  const lines = body.split(/\r?\n/);
  const output = [];
  const isList = line => /^\s*(?:[-+*]|\d+[.、])\s+/u.test(line);
  const isQuote = line => /^\s*>/u.test(line);
  for (const line of lines) {
    const previous = output.at(-1) ?? '';
    if (line.trim() && previous.trim() && !((isList(line) && isList(previous)) || (isQuote(line) && isQuote(previous)))) {
      output.push('');
    }
    output.push(line);
  }
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

fs.mkdirSync(postsRoot, { recursive: true });
fs.mkdirSync(pdfRoot, { recursive: true });
fs.mkdirSync(notesRoot, { recursive: true });

for (const [sourceName, destinationName] of pdfs) {
  const source = path.join(attachmentRoot, sourceName);
  if (!fs.existsSync(source)) throw new Error(`缺少文章附件：${source}`);
  const destination = path.join(pdfRoot, destinationName);
  if (keepCompressedPdfs.has(destinationName)) {
    if (!fs.existsSync(destination)) throw new Error(`缺少压缩后的博客附件：${destination}`);
    continue;
  }
  fs.copyFileSync(source, destination);
}

if (!fs.existsSync(advancedMlNote)) throw new Error(`缺少高级机器学习往年题：${advancedMlNote}`);
fs.copyFileSync(advancedMlNote, path.join(notesRoot, 'advanced-machine-learning-past-exams.txt'));

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

console.log(`已同步 ${articles.length} 篇经验分享文章、${pdfs.length} 份 PDF 和 1 份补充笔记，原始文件保持不变。`);
