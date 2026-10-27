#!/usr/bin/env bash
set -euo pipefail
stage=/home/deploy/wayne-portfolio-staging
site=/var/www/wayne-portfolio
stamp=$(date -u +%Y%m%d-%H%M%S)
release="$site/releases/$stamp"
backup="/var/backups/wayne-portfolio/$stamp"
sudo install -d -o deploy -g deploy "$site" "$site/releases" "$release"
sudo install -d "$backup"
if [ -e /etc/nginx/sites-available/wayne-portfolio ]; then
  sudo cp -a /etc/nginx/sites-available/wayne-portfolio "$backup/nginx.conf"
fi
if [ -L "$site/current" ]; then readlink "$site/current" | sudo tee "$backup/previous-release" >/dev/null; fi
tar -xzf "$stage/site.tar.gz" -C "$release"
test -f "$release/index.html"
chmod -R u=rwX,go=rX "$release"
ln -sfn "$release" "$site/current.next"
mv -Tf "$site/current.next" "$site/current"
sudo install -m 644 "$stage/nginx-http.conf" /etc/nginx/sites-available/wayne-portfolio
sudo ln -sfn /etc/nginx/sites-available/wayne-portfolio /etc/nginx/sites-enabled/wayne-portfolio
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certonly --webroot -w "$site/current" --cert-name www.dyw2.xyz -d www.dyw2.xyz -d dyw2.xyz --non-interactive --keep-until-expiring
sudo install -m 644 "$stage/nginx-https.conf" /etc/nginx/sites-available/wayne-portfolio
sudo nginx -t
sudo systemctl reload nginx
install -m 644 "$stage/update-github.mjs" "$site/update-github.mjs"
sudo install -m 644 "$stage/wayne-github-sync.service" /etc/systemd/system/wayne-github-sync.service
sudo install -m 644 "$stage/wayne-github-sync.timer" /etc/systemd/system/wayne-github-sync.timer
sudo systemctl daemon-reload
sudo systemctl enable --now wayne-github-sync.timer
sudo systemctl start wayne-github-sync.service
curl -fsSI https://www.dyw2.xyz/
curl -fsSI https://dyw2.xyz/
printf 'Release: %s\nBackup: %s\n' "$release" "$backup"
