---
title: 我用这些技术，搭起了自己的博客
date: 2026-09-16 09:00:00
updated: 2026-09-17 18:30:00
sticky: 1
cover: /assets/mountains.jpg
banner: /assets/snow-mountain-lake.jpg
description: 本站从内容组织、Markdown 渲染到 GitHub 与 Vercel 自动部署的完整技术架构。
tags: [Hexo, Stellar, Markdown, Vercel]
categories: [建站技术]
---

这个博客用于整理课程笔记、技术文章与阶段性的学习记录。为了让写作方式尽量简单，同时兼顾章节导航、数学公式、全文搜索和部署效率，本站采用静态站点架构：内容以 Markdown 文件保存，构建后发布为纯静态页面。

## 技术架构

网站以 [Hexo](https://hexo.io/) 作为静态站点生成器，使用 [Stellar](https://github.com/xaoxuu/hexo-theme-stellar) 作为主题基础。Hexo 负责读取 Markdown、页面配置和知识库目录，Stellar 提供文章列表、侧边栏、章节树、目录导航与响应式页面结构。

站点没有传统数据库。文章、知识库和页面配置都保存在 Git 仓库中，主要目录如下：

```text
source/_posts/       普通文章
source/wiki/         分章节知识库
source/_data/wiki/   知识库目录与排序
source/moments/      近期心得
source/assets/       图片、字体、脚本与 PDF
```

这种结构便于备份和迁移，也能清楚地追踪每次内容修改。

## Markdown 与数学公式

日常写作使用标准 Markdown，支持标题、列表、引用、表格、代码块和图片。数学公式由 Markdown-it、markdown-it-texmath 与 KaTeX 在构建阶段完成渲染，因此公式不依赖浏览器临时请求第三方服务。

例如，行内公式可以写成 `$t = \frac{L}{R}$`，独立公式可以写成：

$$
C = B \log_2\left(1 + \frac{S}{N}\right)
$$

霞鹜文楷字体与 KaTeX 字体均随网站一同发布，可以减少外部字体服务不可用造成的排版变化。

## 知识库与内容同步

课程笔记使用 Stellar 的 Wiki 结构组织。每个知识库都有独立配置文件，章节顺序由目录树明确指定。计算机网络与计算机组成笔记从本地学习资料目录复制生成，原始笔记始终保留在个人资料库中。

同步程序会读取原始 Markdown、清理与网页无关的旧元数据、转换 Obsidian 图片引用、复制本地图片，并生成知识库页面和章节导航。这样可以继续在熟悉的笔记工具中维护内容，再将适合公开的版本同步到博客。

## 页面样式与交互

视觉层在 Stellar 原有布局上增加了湖蓝色玻璃质感、半透明侧栏、课程封面和自适应移动端样式。样式集中保存在 `source/assets/forest.css`，不会直接修改主题依赖，升级主题时更容易排查差异。

文章页面提供阅读进度、目录锚点、站内搜索和 PDF 阅读框。近期心得支持单条链接、浏览器本地点赞和分享；公开评论使用 Giscus，将评论保存为 GitHub Discussions，避免单独维护评论服务器。

## GitHub 与 Vercel 部署

源码保存在 GitHub。每次执行 `git push` 后，Vercel 会自动拉取最新提交、安装依赖并运行构建命令：

```powershell
pnpm run build
```

构建结果输出到 `public` 目录，由 Vercel 发布到正式域名。域名解析与 HTTPS 证书也由 Vercel 和 DNS 服务商协同处理，整个流程不需要手动上传生成后的网页文件。

正式发布前会运行：

```powershell
pnpm run build
pnpm run check
```

检查内容包括站内链接、知识库章节、数学公式、图片资源、移动端宽度、评论配置和关键交互。通过自动构建与检查，博客可以在保留 Markdown 写作体验的同时，获得稳定且可重复的发布流程。
