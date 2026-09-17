# Luckylotus · 森林玻璃博客

基于官方 Hexo 8 + Stellar 1.44.0，配有山林背景、透明卡片和绿色边框。

## 已完成

- 博客、标签、归档、知识库和章节树。
- 计算机网络与操作系统示例，章节前后导航、文章目录及站内搜索。
- Markdown + KaTeX 构建时公式渲染，本站托管公式字体。
- 本地 Markdown 导入工具，自动加入章节目录，不覆盖已有文件。
- 阅读进度和本浏览器继续阅读、手机适配。
- Vercel 构建配置。

## 启动

安装包含 npm 的 Node.js 22 或 24 后，执行 `npm install`、`npm run build`、`npm run dev`，打开 http://localhost:4322。也可双击 start.cmd。

详细操作见 [写作与部署.md](写作与部署.md)。

## 目录

- `source/_posts`：独立文章。
- `source/wiki`：课程章节。
- `source/_data/wiki`：课程配置及章节顺序。
- `source/assets/forest.css`：独立的透明样式。
- `scripts/markdown.js`：公式渲染和标题锚点。
- `tools/import-note.cjs`：Markdown 导入。
- `_config.yml`：名称、作者、正式域名。

## 验证

构建后运行 `npm run check`：检查本地链接、公式、目录锚点、前后章、搜索收录和导入工具。浏览器检查覆盖桌面和 390px 手机视口。

当前内容为示例。还没有连接 GitHub、部署到 Vercel或切换域名。初稿中的名称 Luckylotus 和域名 www.luckylotus.top 已保留，正式上线前请核对。

背景照片来自 Unsplash（photo-1464822759023-fed622ff2c3b）。主题 https://github.com/xaoxuu/hexo-theme-stellar 。公式库 KaTeX 与图片加载库 vanilla-lazyload 的许可证随其上游项目提供。
