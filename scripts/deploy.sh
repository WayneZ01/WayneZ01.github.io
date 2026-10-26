#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
pnpm build
mkdir -p outputs
COPYFILE_DISABLE=1 tar --no-xattrs -czf outputs/site.tar.gz -C out .
ssh -o BatchMode=yes web-server-01 'mkdir -p /home/deploy/wayne-portfolio-staging'
scp outputs/site.tar.gz deploy/release.sh web-server-01:/home/deploy/wayne-portfolio-staging/
ssh -o BatchMode=yes web-server-01 'bash /home/deploy/wayne-portfolio-staging/release.sh'
