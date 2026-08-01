# Deployment (AWS Lightsail)

Infrastructure-as-code for running this app on a dedicated AWS Lightsail
instance behind Apache, backed by a Lightsail managed Postgres database.

This directory is the source of truth for how the live server is configured.
If you change something on the box, change it here too.

## Topology

```
                 Cloudflare (DNS + proxy, TLS to visitor)
                          │  https
                          ▼
        ┌──────────────────────────────────────────┐
        │  Lightsail instance (Ubuntu, 1GB/2vCPU)   │
        │                                            │
        │   Apache :80/:443  ──reverse proxy──►  Node (Next.js) :3000
        │   (TLS via certbot)                    (systemd: lokaly.service,
        │                                         user: lokaly)
        └──────────────────────────────────────────┘
                          │  TLS (sslmode=require)
                          ▼
              Lightsail managed Postgres :5432
```

- **One Node process serves every town.** The app resolves the town from the
  `Host` header (`ProxyPreserveHost On`), so extra domains are just
  `ServerAlias` lines — no per-town process or config.
- **Releases are atomic symlink swaps.** Each deploy unpacks to
  `/opt/lokaly/releases/<timestamp>/` and flips `/opt/lokaly/app/current`.
  Rollback = point the symlink back and restart.
- **Secrets live once**, at `/opt/lokaly/app/.env.production`, symlinked into
  each release. Release tarballs never contain credentials.

## Files here

| File | Runs on | Purpose |
|------|---------|---------|
| `provision.sh` | server (once) | Bootstraps a bare instance |
| `systemd/lokaly.service` | server | The app service unit |
| `apache/kluang.conf` | server | HTTP vhost (certbot derives the HTTPS one) |
| `env.production.example` | — | Template for the server env file (no secrets) |
| `build-and-deploy.sh` | workstation | Build off-box, ship, release |
| `release.sh` | server | Unpack, install, flip symlink, restart, prune |

## First-time setup

Prereqs: a Lightsail instance (note its **static IP** and SSH key) and a
Lightsail managed Postgres instance.

1. **Open the instance firewall.** Lightsail's per-instance networking firewall
   is *separate* from the OS `ufw`. In the console → instance → Networking, add
   inbound **HTTP (80)** and **HTTPS (443)**. (SSH/22 is open by default.)

2. **Provision the box.**
   ```bash
   scp -i key.pem deploy/provision.sh deploy/systemd/lokaly.service \
       deploy/apache/kluang.conf ubuntu@<ip>:/tmp/
   ssh -i key.pem ubuntu@<ip> 'sudo bash /tmp/provision.sh'
   ```
   Installs swap, Node 20, Apache (+proxy/ssl/certbot), the `lokaly` user, the
   systemd unit, and the vhost.

3. **Prepare the database.** Make the Lightsail DB reachable from the instance
   (enable "public mode", or keep it private and allowlist the instance).
   Then, with `DB_*` exported in your shell, from the repo root:
   ```bash
   node scripts/migrate.mjs         # create the schema
   npx tsx scripts/import-seed.mjs  # load bundled seed content
   ```
   Both connect over the network, so you can run them from your workstation if
   the DB is in public mode, or from the instance otherwise.

4. **Write the server env file.** Copy `env.production.example`, fill in the
   real `DB_*` values, and place it on the server (see the header of that file
   for the exact commands). **Owned by `lokaly`, `chmod 600`, no UTF-8 BOM.**

5. **First release + start.**
   ```bash
   deploy/build-and-deploy.sh ubuntu@<ip> key.pem
   ssh -i key.pem ubuntu@<ip> 'sudo systemctl start lokaly'
   ```

6. **Issue TLS.** Point DNS at the instance IP first, then:
   ```bash
   ssh -i key.pem ubuntu@<ip> \
     'sudo certbot --apache -d kluang.lokaly.my \
        --non-interactive --agree-tos -m you@example.com --redirect'
   ```
   This generates `kluang-le-ssl.conf` (:443) and appends the HTTP→HTTPS
   redirect to `kluang.conf`. Renewal is automatic (certbot systemd timer).
   If Cloudflare fronts the domain, set its SSL mode to **Full (Strict)** now
   that the origin has a real cert.

## Routine deploys

From the repo root, after committing your changes:

```bash
deploy/build-and-deploy.sh ubuntu@<ip> key.pem
```

Builds locally, ships the artifact, and runs `release.sh` (which restarts the
service and prunes old releases, keeping the last 5).

### Windows / PuTTY

If you only have PuTTY (`.ppk` key) and no OpenSSH, the scripts' logic still
applies — run the equivalent with `pscp`/`plink`:

```powershell
npm run build
tar --exclude='.next/cache' -czf release.tar.gz .next public package.json package-lock.json next.config.mjs
& "C:\Program Files\PuTTY\pscp.exe" -i key.ppk release.tar.gz  ubuntu@<ip>:/tmp/release.tar.gz
& "C:\Program Files\PuTTY\pscp.exe" -i key.ppk deploy\release.sh ubuntu@<ip>:/tmp/release.sh
& "C:\Program Files\PuTTY\plink.exe" -i key.ppk ubuntu@<ip> "bash /tmp/release.sh"
```

## Operations

```bash
# logs
ssh ubuntu@<ip> 'sudo journalctl -u lokaly -f'
# status / memory
ssh ubuntu@<ip> 'systemctl status lokaly; free -h'
# restart
ssh ubuntu@<ip> 'sudo systemctl restart lokaly'
```

### Rollback

```bash
ssh ubuntu@<ip>
ls -1 /opt/lokaly/releases            # pick the previous timestamp
sudo -u lokaly ln -sfn /opt/lokaly/releases/<ts> /opt/lokaly/app/current
sudo systemctl restart lokaly
```

## Migrations

`db/migrations/*.sql` are applied by `scripts/migrate.mjs`, which tracks
applied files in a `_migrations` table and runs each new one in a transaction.
Run it (with `DB_*` in the environment) after deploying code that needs a
schema change — before or after the app release depending on compatibility.

## Notes / gotchas learned the hard way

- **1GB RAM: never build on the box.** `next build` alone can need 1–2GB.
  `build-and-deploy.sh` builds on your workstation for this reason.
- **`next.config` must be `.mjs`, not `.ts`.** Next loads the config at server
  boot; a `.ts` config needs `typescript` at runtime, which `npm ci --omit=dev`
  intentionally omits.
- **Two separate firewalls.** Opening a port in `ufw` does nothing until the
  Lightsail *instance* firewall also allows it (and the *database* has its own
  networking permissions again).
- **Env file BOM.** Write `.env.production` as UTF-8 without a BOM, or the shell
  mis-reads the first variable.
