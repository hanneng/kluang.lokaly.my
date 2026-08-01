#!/usr/bin/env bash
#
# Server-side release step. Unpacks a build artifact into a fresh timestamped
# release directory, installs production dependencies, atomically flips the
# `current` symlink, restarts the service, and prunes old releases.
#
# Expects the artifact already at /tmp/release.tar.gz (see build-and-package.sh,
# which builds OFF the box — never build on a 1GB instance).
#
# Run on the server as a sudo-capable user:
#   ssh -i key.pem ubuntu@<ip> 'bash /tmp/release.sh'
set -euo pipefail

APP_USER=lokaly
APP_HOME=/opt/lokaly
ARTIFACT=/tmp/release.tar.gz
KEEP=5   # how many old releases to retain for rollback

[ -f "$ARTIFACT" ] || { echo "ERROR: $ARTIFACT not found"; exit 1; }

RELEASE_ID=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$APP_HOME/releases/$RELEASE_ID"

echo "== unpack -> $RELEASE_DIR =="
sudo -u "$APP_USER" mkdir -p "$RELEASE_DIR"
sudo tar -xzf "$ARTIFACT" -C "$RELEASE_DIR"
sudo chown -R "$APP_USER:$APP_USER" "$RELEASE_DIR"

echo "== npm ci (production deps only) =="
sudo -u "$APP_USER" bash -c "cd '$RELEASE_DIR' && npm ci --omit=dev --no-audit --no-fund"

echo "== link shared env file =="
# The env file (with secrets) lives once, outside any release, and is symlinked
# into each — so a release tarball never has to carry credentials.
sudo -u "$APP_USER" ln -sf "$APP_HOME/app/.env.production" "$RELEASE_DIR/.env.production"

echo "== flip 'current' symlink (atomic) =="
sudo -u "$APP_USER" ln -sfn "$RELEASE_DIR" "$APP_HOME/app/current"

echo "== restart service =="
if systemctl list-unit-files lokaly.service >/dev/null 2>&1; then
  sudo systemctl restart lokaly
  sleep 2
  sudo systemctl is-active lokaly
else
  echo "  lokaly.service not installed yet — start it manually after first release"
fi

echo "== prune old releases (keeping $KEEP) =="
# The releases live under the lokaly user's 750 home, which the invoking user
# (e.g. ubuntu) can't even traverse — so the whole prune, including the glob,
# must run AS lokaly, not just the rm. `bash -s ... args` passes the values as
# positional params, sidestepping sudo's env reset and nested-quoting hazards.
# Never deletes the release `current` points at, regardless of count.
CURRENT=$(basename "$(sudo readlink -f "$APP_HOME/app/current")")
sudo -u "$APP_USER" bash -s "$APP_HOME" "$KEEP" "$CURRENT" <<'PRUNE'
home="$1"; keep="$2"; current="$3"
cd "$home/releases" || exit 0
ls -1dt */ 2>/dev/null | sed 's:/$::' | tail -n +$((keep + 1)) | while read -r old; do
  [ "$old" = "$current" ] && continue
  echo "  removing $old"
  rm -rf "$home/releases/$old"
done
PRUNE

rm -f "$ARTIFACT"
echo "RELEASE_ID=$RELEASE_ID"
echo "DONE"
