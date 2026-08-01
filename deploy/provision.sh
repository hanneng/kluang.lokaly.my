#!/usr/bin/env bash
#
# One-time server bootstrap for a fresh Ubuntu 22.04/24.04 Lightsail instance
# dedicated to the Lokaly app. Idempotent — safe to re-run.
#
# Usage (from your workstation):
#   scp -i key.pem deploy/provision.sh ubuntu@<ip>:/tmp/
#   scp -i key.pem deploy/systemd/lokaly.service ubuntu@<ip>:/tmp/
#   scp -i key.pem deploy/apache/kluang.conf ubuntu@<ip>:/tmp/
#   ssh -i key.pem ubuntu@<ip> 'sudo bash /tmp/provision.sh'
#
# Assumes the three files above are in /tmp. After this runs, follow the
# remaining manual steps in deploy/README.md (env file, first release, certbot).
set -euo pipefail

APP_USER=lokaly
APP_HOME=/opt/lokaly

echo "== swap (OOM safety net; Lightsail ships without any) =="
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  # Prefer RAM; use swap only under real pressure.
  sysctl -w vm.swappiness=10
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
else
  echo "  swapfile already present, skipping"
fi

echo "== apt update =="
apt-get update -y -qq

echo "== Node.js 20 LTS =="
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
echo "  node $(node -v), npm $(npm -v)"

echo "== Apache + proxy modules + certbot =="
apt-get install -y -qq apache2 certbot python3-certbot-apache
a2enmod proxy proxy_http headers rewrite ssl >/dev/null
systemctl enable apache2 >/dev/null

echo "== app user + release directories =="
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  useradd --system --create-home --home-dir "$APP_HOME" --shell /usr/sbin/nologin "$APP_USER"
fi
mkdir -p "$APP_HOME/app" "$APP_HOME/releases"
chown -R "$APP_USER:$APP_USER" "$APP_HOME"

echo "== firewall (OS-level; the Lightsail networking firewall is separate) =="
apt-get install -y -qq ufw
ufw allow OpenSSH >/dev/null
ufw allow 'Apache Full' >/dev/null
yes | ufw enable >/dev/null 2>&1 || true

echo "== systemd unit =="
if [ -f /tmp/lokaly.service ]; then
  install -m 644 /tmp/lokaly.service /etc/systemd/system/lokaly.service
  systemctl daemon-reload
  systemctl enable lokaly >/dev/null
  echo "  installed (will start after the first release + env file exist)"
else
  echo "  /tmp/lokaly.service not found — copy deploy/systemd/lokaly.service and re-run"
fi

echo "== apache vhost =="
if [ -f /tmp/kluang.conf ]; then
  install -m 644 /tmp/kluang.conf /etc/apache2/sites-available/kluang.conf
  a2ensite kluang.conf >/dev/null
  # Never blind-restart a box that may host other sites — test first.
  apache2ctl configtest
  systemctl reload apache2
  echo "  enabled"
else
  echo "  /tmp/kluang.conf not found — copy deploy/apache/kluang.conf and re-run"
fi

cat <<'NEXT'

== provisioning done ==

Remaining manual steps (see deploy/README.md):
  1. Write /opt/lokaly/app/.env.production (owned by lokaly, chmod 600).
  2. Push the first release:  deploy/release.sh
  3. Start the app:           sudo systemctl start lokaly
  4. Issue TLS:               sudo certbot --apache -d kluang.lokaly.my \
                                --non-interactive --agree-tos -m you@example.com --redirect
  5. In the Lightsail console, open ports 80 and 443 on the instance firewall.
NEXT
