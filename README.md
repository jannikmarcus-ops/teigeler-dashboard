# Teigeler & Partner — Makler-Dashboard

TV-optimiertes KPI-Dashboard fuer das Makler-Team. Zeigt Live-Daten aus Notion.

## Quick Start

### 1. Node.js installieren

```bash
# macOS mit Homebrew
brew install node

# Oder von https://nodejs.org herunterladen (LTS Version)
```

### 2. Dependencies installieren

```bash
cd teigeler-dashboard
npm install
```

### 3. Notion Integration einrichten

1. Gehe zu https://www.notion.so/my-integrations
2. Erstelle eine neue Integration ("Internal Integration")
3. Kopiere den **Internal Integration Token** (beginnt mit `secret_...`)
4. Oeffne deine Makler-Datenbank in Notion
5. Klicke auf **Share** → **Invite** → waehle deine Integration aus
6. Kopiere die **Database ID** aus der URL:
   `https://www.notion.so/workspace/DATABASE_ID?v=...`

### 4. Environment Variables setzen

```bash
cp .env.example .env.local
```

Trage die Werte ein:

```
NOTION_API_KEY=secret_xxxxx
NOTION_MAKLER_DB_ID=xxxxx
```

### 5. Property-Mapping pruefen

```bash
npm run dev
```

Oeffne http://localhost:3000/api/setup — hier siehst du die echten Property-Namen deiner Notion-DB. Falls diese von den Standardnamen abweichen, passe das Mapping in `src/lib/notion.ts` an.

### 6. Dashboard starten

```bash
npm run dev
# Oeffne http://localhost:3000
```

## Deployment auf Vercel

```bash
npx vercel
```

Environment Variables im Vercel Dashboard unter **Settings → Environment Variables** eintragen.

## TV-Modus

1. Dashboard-URL im Chrome Browser oeffnen
2. **F11** fuer Vollbild
3. Laeuft endlos mit Auto-Refresh (alle 60 Sekunden)

### Kiosk-Modus (Raspberry Pi / Fire TV)

```bash
chromium-browser --kiosk --disable-restore-session-state https://dashboard.teigeler.de
```

## Architektur

- **Next.js 14** (App Router) + **TypeScript**
- **Notion API** fuer Live-Daten
- **Recharts** fuer Balkendiagramme
- **Tailwind CSS** fuer Dark-Theme Styling
- Server-Cache: 30s / Client-Refresh: 60s

## Dateien

| Datei | Beschreibung |
|---|---|
| `src/lib/notion.ts` | Notion API Client + Property-Mapping |
| `src/lib/types.ts` | TypeScript Interfaces |
| `src/lib/mock-data.ts` | Testdaten fuer Entwicklung |
| `src/app/api/kpis/route.ts` | API: Makler-KPIs |
| `src/app/api/revenue/route.ts` | API: Revenue-Chart-Daten |
| `src/app/api/setup/route.ts` | Debug: Notion Property-Namen |
| `src/components/Dashboard.tsx` | Hauptcontainer mit Auto-Refresh |
| `src/components/Leaderboard.tsx` | Makler-Rangliste |
| `src/components/RevenueChart.tsx` | Balkendiagramm |
