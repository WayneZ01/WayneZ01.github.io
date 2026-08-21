# WAYNE. — Personal Blog

Wayne 的个人博客与数字作品集：Android × iOS × AI × Web。默认英文，支持手动切换中文。

- 线上地址：<https://waynez01.github.io/>
- GitHub：<https://github.com/WayneZ01>
- 文章：<https://blog.csdn.net/zhanwei0102>
- 维护手册：[BLOG_GUIDE.md](./BLOG_GUIDE.md)

## 本地运行

需要 Node.js 22+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000/>。

## 构建

```bash
pnpm build
```

静态文件会生成到 `out/`。推送到 `main` 分支后，GitHub Actions 会自动发布到 GitHub Pages。
