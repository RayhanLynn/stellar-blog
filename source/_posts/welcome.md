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

这个博客用于整理课程笔记、技术文章与阶段性的学习记录。

## 技术架构

网站以 [Hexo](https://hexo.io/) 作为静态站点生成器，使用 [Stellar](https://github.com/xaoxuu/hexo-theme-stellar) 作为主题基础。Hexo 负责读取 Markdown、页面配置和知识库目录，Stellar 提供文章列表、侧边栏、章节树、目录导航与响应式页面结构。

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

视觉层在 Stellar 原有布局上增加了湖蓝色玻璃质感、半透明侧栏、课程封面和自适应移动端样式以搭建更加符合自己审美的blog。

文章页面提供阅读进度、目录锚点、站内搜索和 PDF 阅读框。近期心得支持单条链接、浏览器本地点赞和分享；公开评论使用 Giscus，将评论保存为 GitHub Discussions，避免单独维护评论服务器。

## GitHub 与 Vercel 部署

源码保存在 GitHub。每次执行 `git push` 后，Vercel 会自动拉取最新提交、安装依赖并运行构建命令：


