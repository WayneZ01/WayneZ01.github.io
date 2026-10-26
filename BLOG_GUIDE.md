# Wayne 个人网站：腾讯云部署与维护手册

## 1. 正式站点

| 项目 | 配置 |
|---|---|
| 主站 | https://www.dyw2.xyz |
| 根域名 | https://dyw2.xyz，301 跳转主站 |
| 腾讯云服务器 | 43.128.35.110，香港，Ubuntu |
| SSH 配置名称 | web-server-01 |
| 部署用户 | deploy |
| 页面目录 | /var/www/wayne-portfolio/current |
| 历史版本 | /var/www/wayne-portfolio/releases/ |
| Nginx 配置 | /etc/nginx/sites-available/wayne-portfolio |
| HTTPS 证书 | /etc/letsencrypt/live/www.dyw2.xyz/ |

个人站使用独立虚拟主机，`admin.dyw2.xyz` 的管理后台及其 API 配置保持独立。

## 2. 网站内容怎样修改

- `app/page.tsx`：所有页面板块、个人介绍、双语文案、技术方向和社交链接。
- `app/globals.css`：配色、玻璃效果、字体、卡片、手机布局和动效。
- `public/avatar.png`：保持原色的 GitHub 头像，可直接用自己的图片替换。
- `app/layout.tsx`：网页标题、简介、分享信息与规范网址。
- `app/repos.json`：构建时的 GitHub 仓库兜底快照。
- `public/data/repos.json`：服务器定时更新、访客优先读取的公开仓库数据。
- `public/og.jpg`：社交分享封面。

双语文案在 `copy.en` 和 `copy.zh`，兴趣方向在 `focuses`，个人公开历程在 `journey`。没有编造教育、雇佣经历、奖项或联系方式；需要添加时填写真实信息即可。

默认英文。访客手动选择的语言和主题保存在浏览器本地，之后访问会恢复偏好。Fork 项目明确显示 Fork 标签，避免误认为原创作品。

## 3. 本地预览与构建

建议安装 Node.js 22+ 和 pnpm。首次下载源码后：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

浏览器打开终端打印的网址。正式构建：

```bash
pnpm lint
pnpm build
```

静态产物在 `out/`，不需要在服务器上长期运行 Node.js 网站进程，也不占用管理后台的 3000 端口。

## 4. 一条命令更新正式站

在这个项目的根目录运行：

```bash
bash scripts/deploy.sh
```

脚本会先构建网站，再通过已配置的 SSH 密钥上传压缩包，创建带时间戳的新版本，验证首页文件存在后切换 `current` 链接。更新网站内容通常无需 sudo，也无需重启 Nginx。历史版本会保留。

Mac 的 SSH 配置保存在 `~/.ssh/config`，使用名称 `web-server-01` 连接。私钥和服务器密码都不应提交到 GitHub。

## 5. 回滚到上个版本

```bash
ssh web-server-01
cat /var/www/wayne-portfolio/previous-release
ls -l /var/www/wayne-portfolio/releases
```

确认上一个版本的完整目录后，手动将下面的 `YYYYMMDD-HHMMSS` 替换为真实版本：

```bash
ln -sfn /var/www/wayne-portfolio/releases/YYYYMMDD-HHMMSS /var/www/wayne-portfolio/current.next
mv -Tf /var/www/wayne-portfolio/current.next /var/www/wayne-portfolio/current
curl -I https://www.dyw2.xyz
```

不要删除当前版本，也不要执行针对整个 `/var/www` 的清理命令。

## 6. GitHub 数据自动更新

服务器的 `wayne-github-sync.timer` 每天北京时间约 11:15–11:30 自动执行一次更新。同步仅访问 GitHub 的公开仓库接口，不使用令牌，不读取私有仓库。

流程是 GitHub Public API → 服务器 JSON 快照 → 浏览器读取本站数据。这样访客无需等待跨境 GitHub API。网络请求失败时保留旧数据；页面还内置一份构建时快照。

查看定时任务：

```bash
ssh web-server-01
systemctl list-timers wayne-github-sync.timer
systemctl status wayne-github-sync.service
sudo journalctl -u wayne-github-sync.service -n 30
```

手动刷新：

```bash
node /var/www/wayne-portfolio/update-github.mjs /var/www/wayne-portfolio/current/data/repos.json
```

修改 GitHub 仓库的 Description、Homepage 后，下一次同步会更新项目卡片。新增公开仓库也会自动出现。项目支持原创 / Fork 筛选、搜索与分批加载。

## 7. 域名和 HTTPS

腾讯云 DNS 中 `@` 和 `www` 的 A 记录应指向 `43.128.35.110`。主站规范网址为 `https://www.dyw2.xyz`，HTTP 和根域名统一跳转到它。

证书使用服务器现有 Certbot 账户申请，覆盖 `www.dyw2.xyz` 与 `dyw2.xyz`。原有 Certbot 定时任务负责续期。排查时运行：

```bash
sudo certbot certificates
systemctl list-timers certbot.timer
sudo nginx -t
```

修改 Nginx 后先运行配置检查，再 reload；只有检查通过才重载：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 8. 初次安装与已有站点保护

`deploy/install.sh` 是本次服务器首次安装脚本，常规更新使用 `scripts/deploy.sh`，不要反复执行首次安装。

安装时新增独立的 `wayne-portfolio` 虚拟主机、版本目录和 GitHub 数据刷新任务。之前若有相同名称的 Nginx 配置，会备份到 `/var/backups/wayne-portfolio/`。管理后台的虚拟主机未被覆盖。

本次网站没有启用访客身份追踪或额外分析 SDK。
