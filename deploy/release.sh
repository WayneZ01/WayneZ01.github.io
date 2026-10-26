#!/usr/bin/env bash
set -euo pipefail
site=/var/www/wayne-portfolio
stamp=$(date -u +%Y%m%d-%H%M%S)
release="$site/releases/$stamp"
mkdir -p "$release"
tar -xzf /home/deploy/wayne-portfolio-staging/site.tar.gz -C "$release"
test -f "$release/index.html"
if [ -d "$site/current/_next/static" ]; then
  cp -an "$site/current/_next/static/." "$release/_next/static/"
fi
if [ -L "$site/current" ]; then
  readlink "$site/current" > "$site/previous-release"
fi
chmod -R u=rwX,go=rX "$release"
ln -sfn "$release" "$site/current.next"
mv -Tf "$site/current.next" "$site/current"
node "$site/update-github.mjs" "$site/current/data/repos.json" || printf 'Keeping bundled GitHub snapshot\n'
curl -fsSI https://www.dyw2.xyz/
printf 'Published release: %s\n' "$release"
