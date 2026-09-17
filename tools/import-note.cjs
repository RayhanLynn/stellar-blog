'use strict';
// npm run import -- "D:\Notes\chapter.md" --series networks --chapter "第四章 · 网络层"
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const argv = process.argv.slice(2);
const input = argv.shift();
const options = {};
for (let i = 0; i < argv.length; i += 2) {
  if (!['--series', '--chapter', '--slug', '--title'].includes(argv[i]) || !argv[i + 1]) {
    console.error('参数应为 --series、--chapter、--slug 或 --title，后接对应内容。'); process.exit(1);
  }
  options[argv[i].slice(2)] = argv[i + 1];
}
try {
  if (!input || !/\.md$/i.test(input)) throw new Error('请指定 Markdown 文件：npm run import -- "文件.md" [--series networks --chapter "第四章"]');
  const root = path.resolve(__dirname, '..');
  const slug = options.slug || path.basename(input, path.extname(input)).normalize('NFC').replace(/[^\p{L}\p{N}_-]+/gu, '-');
  if (!/^[\p{L}\p{N}_-]+$/u.test(slug)) throw new Error('文件名无效，请用 --slug 指定英文、中文、数字或连字符。');
  let body = fs.readFileSync(path.resolve(input), 'utf8').replace(/^\uFEFF/, '');
  let meta = {};
  const front = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (front) { meta = yaml.load(front[1]) || {}; body = body.slice(front[0].length); }
  if (typeof meta !== 'object' || Array.isArray(meta)) throw new Error('Markdown 头部必须是 YAML 对象。');
  meta.title = options.title || meta.title || path.basename(input, path.extname(input));
  meta.date ||= new Date().toISOString();
  let destination = path.join(root, 'source', '_posts', slug + '.md');
  let collectionPath, collection;
  if (options.series) {
    if (!/^[a-z0-9-]+$/.test(options.series)) throw new Error('专栏名称必须是英文小写字母、数字或连字符。');
    collectionPath = path.join(root, 'source', '_data', 'wiki', options.series + '.yml');
    if (!fs.existsSync(collectionPath)) throw new Error('专栏不存在，请先在 source/_data/wiki 创建该专栏配置。');
    collection = yaml.load(fs.readFileSync(collectionPath, 'utf8'));
    collection.tree ||= {};
    const chapter = options.chapter || '补充笔记';
    if (!Object.hasOwn(collection.tree, chapter)) Object.defineProperty(collection.tree, chapter, { value: [], enumerable: true, writable: true });
    if (!Array.isArray(collection.tree[chapter])) throw new Error('该章节目录不是列表，请检查专栏配置。');
    if (Object.values(collection.tree).some(items => Array.isArray(items) && items.includes(slug))) throw new Error('专栏已收录同名文件，请使用不同 --slug。');
    collection.tree[chapter].push(slug);
    Object.assign(meta, { layout: 'page', wiki: options.series, menu_id: 'wiki' });
    destination = path.join(root, 'source', 'wiki', options.series, slug + '.md');
  } else { meta.layout = 'post'; delete meta.wiki; delete meta.menu_id; }
  if (fs.existsSync(destination)) throw new Error('目标文件已存在，为保护内容不会覆盖：' + destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, '---\n' + yaml.dump(meta, { lineWidth: -1 }) + '---\n\n' + body, { encoding: 'utf8', flag: 'wx' });
  if (collectionPath) fs.writeFileSync(collectionPath, yaml.dump(collection, { lineWidth: -1 }), 'utf8');
  console.log('已导入：' + destination + '\n下一步：npm run build，预览后提交到 GitHub。');
  if (/!\[.*?\]\((?!https?:|\/|data:)/.test(body) || /!\[\[/.test(body)) console.warn('注意：检测到相对路径图片或 Obsidian 嵌入。请把附件复制到 source/assets/notes，并改用 /assets/notes/文件名。');
} catch (error) { console.error(error.message); process.exit(1); }
