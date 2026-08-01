#!/usr/bin/env bash
#
# Workstation-side deploy: build OFF the box, package, ship, and run the
# server-side release. The 1GB instance cannot run `next build` (it spikes to
# 1-2GB and would OOM), so the build always happens here and only the output
# is shipped.
#
# Usage:
#   deploy/build-and-deploy.sh <ssh-target> <path-to-key>
# e.g.
#   deploy/build-and-deploy.sh ubuntu@56.68.120.152 ~/.ssh/lightsail.pem
#
# On Windows without OpenSSH, the same steps work with PuTTY's plink/pscp —
# see deploy/README.md.
set -euo pipefail

TARGET="${1:?usage: build-and-deploy.sh <ssh-target> <path-to-key>}"
KEY="${2:?usage: build-and-deploy.sh <ssh-target> <path-to-key>}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== build (local) =="
npm run build

echo "== package artifact =="
ARTIFACT="$(mktemp -t lokaly-release.XXXXXX.tar.gz)"
# Ship only what production needs: the build output, static assets, and the
# manifests to `npm ci --omit=dev` against. node_modules is rebuilt on the box.
tar --exclude='.next/cache' -czf "$ARTIFACT" \
  .next public package.json package-lock.json next.config.mjs

echo "== ship + release =="
scp -i "$KEY" "$ARTIFACT" "$TARGET:/tmp/release.tar.gz"
scp -i "$KEY" deploy/release.sh "$TARGET:/tmp/release.sh"
ssh -i "$KEY" "$TARGET" 'bash /tmp/release.sh'

rm -f "$ARTIFACT"
echo "== deployed =="
