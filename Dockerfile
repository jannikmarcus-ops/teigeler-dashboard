# Team-Dashboard als Container auf dem VPS (Next.js standalone), hinter dem Teigeler & Partner Portal.
FROM node:20-alpine AS bau
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=bau --chown=node:node /app/.next/standalone ./
COPY --from=bau --chown=node:node /app/.next/static ./.next/static
COPY --from=bau /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=60s --timeout=5s CMD wget -qO- --header "X-Tp-Proxy: $DASHBOARD_PROXY_GEHEIMNIS" http://127.0.0.1:3000/dashboard/api/kpis >/dev/null || exit 1
CMD ["node", "server.js"]
