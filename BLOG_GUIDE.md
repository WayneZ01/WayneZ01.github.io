# Wayne 个人博客：部署、配置与长期维护手册

这份文档解释站点如何工作、GitHub Pages 如何配置，以及以后怎样安全地更新内容和样式。

## 1. 站点概览

| 项目 | 内容 |
|---|---|
| 正式网址 | `https://waynez01.github.io/` |
| GitHub 仓库 | `WayneZ01/WayneZ01.github.io` |
| 默认分支 | `main` |
| 技术栈 | Next.js 16 + React 19 + TypeScript + CSS |
| 语言 | 默认英文，可在右上角手动切换中文 |
| 发布方式 | GitHub Actions 自动部署 GitHub Pages |
| GitHub 数据 | 浏览器端调用 GitHub Public API，自动读取公开仓库 |

仓库名必须精确等于 `WayneZ01.github.io`。GitHub 会把这种“用户名同名 Pages 仓库”映射到根域名 `https://waynez01.github.io/`，因此访问地址不需要额外的项目路径。

## 2. 第一次启用 GitHub Pages

代码第一次推送后，请在 GitHub 中检查一次配置：

1. 打开仓库 `WayneZ01/WayneZ01.github.io`。
2. 点击 **Settings**。
3. 左侧点击 **Pages**。
4. 在 **Build and deployment** → **Source** 中选择 **GitHub Actions**。
5. 打开仓库的 **Actions** 页面，找到 `Deploy blog to GitHub Pages`。
6. 等待 Build 与 Deploy 两个任务都显示绿色勾号。
7. 访问 `https://waynez01.github.io/`。

如果 Source 已经显示 GitHub Actions，则不用重复修改。

首次发布通常需要几十秒到几分钟。之后每次向 `main` 分支推送，都会自动重新构建并覆盖线上版本。

## 3. 自动部署的工作原理

自动部署配置位于：

```text
.github/workflows/deploy-pages.yml
```

流程如下：

```text
修改代码 → 推送 main → GitHub Actions 安装依赖 → pnpm build
         → 生成 out/ 静态文件 → 发布 GitHub Pages → 网站更新
```

通常不要手动编辑 `out/`，也不要把 `out/` 提交到仓库；它由自动化流程生成。

## 4. 本地修改与预览

### 环境要求

- Node.js 22 或更高版本
- pnpm 11
- Git

### 下载与启动

```bash
git clone https://github.com/WayneZ01/WayneZ01.github.io.git
cd WayneZ01.github.io
pnpm install
pnpm dev
```

浏览器打开：

```text
http://localhost:3000/
```

修改文件后页面会自动刷新。

### 发布修改

```bash
git add .
git commit -m "更新博客内容"
git push origin main
```

然后到仓库的 **Actions** 页面观察部署状态。绿色表示成功；红色表示失败，点进去可查看具体步骤和错误信息。

## 5. 最常改的文件

### 修改首页文字、链接和板块

编辑：

```text
app/page.tsx
```

常见修改位置：

- 首屏标题：搜索 `构建。`、`探索。`、`重塑可能。`
- 个人简介：搜索 `我是 Wayne`
- 技术领域：修改 `focusAreas`（当前为 Android、iOS、AI、Web）
- 中英文界面：修改 `copy.en` 与 `copy.zh`；英文是默认语言
- 社交链接：搜索 `github.com/WayneZ01`、`blog.csdn.net`
- 关于文字：搜索 `2016 年加入 GitHub`

### 修改颜色、动画和排版

编辑：

```text
app/globals.css
```

顶部 `:root` 中是核心色值：

```css
--night: #080914;  /* 背景 */
--violet: #8b5cf6; /* 紫色 */
--cyan: #31e7ff;   /* 青色 */
--lime: #c5ff4a;   /* 酸性绿 */
```

移动端样式位于文件底部的 `@media` 规则中。站点已支持 `prefers-reduced-motion`，不建议删除这部分，否则对不适合强动画的访客不友好。

### 修改网页标题和分享信息

编辑：

```text
app/layout.tsx
```

这里控制：

- 浏览器标签标题
- 搜索结果描述
- Open Graph 信息
- X / Twitter 分享卡片

分享封面文件是：

```text
public/og.jpg
```

替换时建议保持 `1200 × 630` JPEG，并保持文件名不变。

## 6. GitHub 项目墙怎样自动更新

首页会请求以下公开接口：

```text
https://api.github.com/users/WayneZ01/repos
```

它会读取最多三页、共 300 个公开仓库，并自动过滤已归档仓库。因此：

- 新建公开仓库后，无需修改博客代码；刷新页面即可出现。
- 修改仓库的 Description、Language、Homepage 后，博客会自动显示新内容。
- 私有仓库不会出现，也不会被读取。
- 项目卡片支持“全部 / 原创 / 收藏（Fork）”筛选和关键词搜索。
- GitHub 未响应或达到公开 API 限额时，会显示内置的精选项目，不会出现空白页。

建议在每个重点 GitHub 仓库中维护好：

- **About → Description**：一句话说明项目做什么。
- **About → Website**：有线上演示时填写网址。
- **Topics**：填写 android、kotlin、ai 等关键词。
- README：说明安装、截图、用法与许可证。

## 7. 新增真正的博客文章

当前首页把 CSDN 作为主要文章出口。如果之后希望文章直接托管在本站，推荐按以下方式升级：

1. 新建 `content/posts/` 文件夹，用 Markdown 或 MDX 保存文章。
2. 新增 `/blog` 文章列表页。
3. 新增 `/blog/[slug]` 文章详情页。
4. 构建时生成静态页面和每篇文章的独立分享元数据。
5. 如需评论，可使用 GitHub Discussions + Giscus。

文章文件建议使用这样的头部信息：

```md
---
title: 一篇文章的标题
description: 一句话摘要
date: 2026-08-21
tags: [Android, AI]
---
```

这个升级不会影响现有 GitHub 项目墙和首页设计。

## 8. 绑定自定义域名（可选）

例如以后购买 `wayne.dev`：

1. 在仓库 **Settings → Pages → Custom domain** 输入域名。
2. 在域名服务商添加 GitHub Pages 要求的 DNS 记录。
3. 等 DNS 生效后勾选 **Enforce HTTPS**。
4. 把 `app/layout.tsx`、`app/sitemap.ts`、`app/robots.ts` 中的 `https://waynez01.github.io` 改为新域名。

绑定之前不要添加 `CNAME` 文件，以免线上访问异常。

## 9. 常见问题排查

### Actions 构建失败

先本地执行：

```bash
pnpm install
pnpm build
```

本地能复现时，优先修复终端显示的第一个错误。常见原因是 TypeScript 类型错误、JSX 标签未闭合或依赖锁文件没有同步。

### 页面显示 404

检查：

- 仓库名是否精确为 `WayneZ01.github.io`。
- 默认分支是否为 `main`。
- Settings → Pages → Source 是否为 GitHub Actions。
- Actions 中最近一次 Deploy 是否成功。

### 网站已部署但内容没更新

1. 确认修改已推送到 `main`。
2. 确认最新 Actions 已完成。
3. 强制刷新浏览器：macOS 用 `Command + Shift + R`。
4. 等待 GitHub Pages 缓存刷新，通常只需几分钟。

### 项目墙只显示精选项目

这通常表示 GitHub Public API 暂时不可用或达到未登录访问限额。站点会自动降级，不影响主页面。稍后刷新即可。

## 10. 发布前检查清单

- [ ] `pnpm build` 成功。
- [ ] 桌面端和手机端首屏文字没有遮挡。
- [ ] GitHub、CSDN 与项目链接可访问。
- [ ] 新增图片已压缩，且没有隐私信息。
- [ ] `public/og.jpg` 中的文字正确。
- [ ] 没有把 `.env`、Token、密钥或个人隐私文件提交到仓库。
- [ ] 推送后 GitHub Actions 变绿。

## 11. 安全说明

这个站点只读取公开 GitHub 数据，不需要 GitHub Token。不要把个人访问令牌、API Key 或密码写进前端代码；静态网站中的内容都可能被访客看到。

如果未来加入需要密钥的服务，应通过受支持的服务端 API 或后端代理处理，不能直接把密钥放进 `app/page.tsx`、环境变量构建产物或 GitHub Pages。
