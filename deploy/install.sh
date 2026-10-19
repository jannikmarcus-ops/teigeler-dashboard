#!/bin/sh
# Erstinstallation bzw. Update auf dem VPS. Aufruf vom Mac: deploy/install.sh
# Deployt genau den committeten Stand (HEAD), nie den Arbeitsbaum.
# Fasst nur /root/tp-dashboard und /root/traefik-config/dashboard.yml an.
set -e
VPS=root@72.61.22.47
cd "$(dirname "$0")/.."
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Abbruch: uncommittete Änderungen. Erst committen, dann deployen." >&2; exit 1
fi
VERSION="$(git rev-parse --short HEAD)"
ssh $VPS 'mkdir -p /root/tp-dashboard && rm -rf /root/tp-dashboard/repo.neu && mkdir /root/tp-dashboard/repo.neu'
git archive HEAD | ssh $VPS 'tar -x -C /root/tp-dashboard/repo.neu && rm -rf /root/tp-dashboard/repo && mv /root/tp-dashboard/repo.neu /root/tp-dashboard/repo'
scp -q deploy/compose.yml $VPS:/root/tp-dashboard/compose.yml
# Notion-Zugang ist derselbe wie im Portal (Integration „Leaderboard Claude Code“, nur lesend genutzt).
ssh $VPS "cd /root/tp-dashboard && touch .env && chmod 600 .env \
  && (grep -q '^DASHBOARD_PROXY_GEHEIMNIS=' .env || printf 'DASHBOARD_PROXY_GEHEIMNIS=%s\n' \"\$(openssl rand -hex 32)\" >> .env) \
  && (grep -q '^NOTION_API_KEY=' .env || sed -n 's/^PORTAL_NOTION_KEY=/NOTION_API_KEY=/p' /root/tp-portal/.env >> .env) \
  && (grep -q '^NOTION_MAKLER_DB_ID=' .env || sed -n 's/^PORTAL_NOTION_TEAM_DB=/NOTION_MAKLER_DB_ID=/p' /root/tp-portal/.env >> .env) \
  && sed -i '/^DASHBOARD_VERSION=/d' .env && echo 'DASHBOARD_VERSION=$VERSION' >> .env \
  && docker compose -p tp-dashboard up -d --build"
scp -q deploy/traefik-dashboard.yml $VPS:/root/traefik-config/dashboard.yml.neu
ssh $VPS 'S=$(grep ^DASHBOARD_PROXY_GEHEIMNIS= /root/tp-dashboard/.env | cut -d= -f2); umask 077; \
  sed "s/__PROXY_GEHEIMNIS__/$S/" /root/traefik-config/dashboard.yml.neu > /root/traefik-config/dashboard.yml; rm /root/traefik-config/dashboard.yml.neu; \
  docker ps --filter name=tp-dashboard --format "{{.Names}} {{.Status}}"'
echo "Deployt: $VERSION"
