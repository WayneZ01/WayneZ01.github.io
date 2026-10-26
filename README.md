# Wayne — personal portfolio

Wayne 的个人网站。参考 Alejandro Buján 个人站的深色玻璃视觉，采用原创布局、彩色 GitHub 头像、悬浮导航和星点动效。

- 正式地址：<https://www.dyw2.xyz>
- 根域名：<https://dyw2.xyz>，自动跳转到 www
- 默认英文，可切换中文；支持深色与浅色主题
- 内容：关于、Android / iOS / AI / Web、公开历程、GitHub 项目、CSDN 文章入口与联系链接
- GitHub：248 个公开仓库快照（2026-10-26），服务器每天自动刷新
- 部署：腾讯云香港 Ubuntu + Nginx + Let's Encrypt HTTPS；纯静态页面
- 操作手册：[BLOG_GUIDE.md](BLOG_GUIDE.md)

## 本地运行

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## 构建与发布

```bash
pnpm build
bash scripts/deploy.sh
```

发布脚本使用 Mac 上已有的 `web-server-01` SSH 配置。源码内没有服务器密码、私钥或 API Key。
