# HANDOFF: teigeler-dashboard
_Stand: 27.08.2026 12:07_

## Ziel
TV-/Web-KPI-Dashboard für das Makler-Team von Teigeler & Partner. Zieht Live-Daten aus Notion und zeigt Team-Kennzahlen (Umsatz, Transaktionsvolumen, Objekte, Einwertungen), Leaderboard, Teamziel-Fortschritt und Jahresziele pro Makler. Responsive auf **Desktop (primär)** und **Handy**, TV-Wallboard zweitrangig. Look = **T&P Corporate Design** (Vorlage: Projekt `~/Projects/tp-einwertungsdossier`).

## Aktueller Stand
**Fertig und live deployed, keine bekannten Bugs.**
- **Branch:** `main`, sauber, in Sync mit `origin`. Letzter Commit `68475cc`.
- **Live:** https://teigeler-dashboard.vercel.app — Deploy nach dem Push verifiziert (Login + `/api/kpis` liefert die gefilterten 4 Datensätze).
- **Build:** `npm run build` grün, `npx tsc --noEmit` sauber.
- **Login-Passwort (Prod):** liegt in `DASHBOARD_PASSWORD`, sowohl in der Vercel-Env als auch lokal in `.env.local`. Passwort selbst NICHT hier notieren (Credentials nie im Klartext, siehe globale CLAUDE.md).
- **Korrektur zum alten Handoff-Stand:** `.env.local` existiert lokal sehr wohl (mit `NOTION_API_KEY`, `NOTION_MAKLER_DB_ID`, `NOTION_REVENUE_DB_ID`, `DASHBOARD_PASSWORD`). Der Handoff vom 15.07. behauptete das Gegenteil. Damit lässt sich lokal direkt gegen echte Notion-Daten testen.
- Die früher erwähnte offene `.gitignore`-Änderung ist inzwischen als `18bc654` committet. Arbeitsverzeichnis ist sauber.

### Tech-/Projektfakten (für schnellen Wiedereinstieg)
- **Stack:** Next.js 14.2.21 (App Router), TypeScript, Tailwind, deployed auf **Vercel via Git-Integration** → `git push origin main` löst automatisch Production-Deploy aus (kein CLI, kein `.vercel`-Ordner lokal). Deploy braucht rund 30 bis 45 Sekunden, bis `/api/kpis` die neuen Daten liefert.
- **Dev-Server:** `npm run dev` läuft auf **Port 3004** (`next dev -p 3004`).
- **Login/Auth:** `src/middleware.ts` schützt alles außer `/login` und `/api/auth`. Passwort in `DASHBOARD_PASSWORD`. Ist die Variable leer/ungesetzt → **kein Schutz**. → Für lokales Testen ohne Login: `DASHBOARD_PASSWORD= npm run dev` (Shell-Env sticht `.env.local`).
- **Daten:** Notion API. Ohne Notion-Token Fallback auf **Demo-/Mock-Daten** (`data.isMockData=true`, StatusBar zeigt gelben Hinweis).
- **Aktualität:** Route-Handler `/api/kpis` mit `revalidate = 30` (ISR), Client-Hook `useAutoRefresh` holt alle 60 s neu. Die angezeigten Zahlen sind also nie älter als etwa eine Minute. Beim ersten Aufruf nach längerer Pause liefert Vercel einmal `x-vercel-cache: STALE` und regeneriert im Hintergrund.
- **Datenmodell `MaklerRecord`** (src/lib/types.ts): u.a. `umsatz_jahr`, `transaktionsvolumen_jahr`, `verkaufte_objekte`, `neue_objekte`, `einwertungstermine`, `aktuell_im_verkauf`, `cr_jahr`, `jahresziel`, `fortschritt`, `team_jahresziel`, `name`. **Jannik (Vertriebsleiter)** wird im Leaderboard und YearProgress rausgefiltert (`name` enthält "jannik") und im TeamZiel-Block separat angezeigt.
- **Wer wird geladen (neu seit 27.08.2026):** Die Notion-Query in `src/lib/notion.ts` filtert auf `Aktiv = true` UND `Rolle` in der Konstante `TRACKED_ROLLEN = ['Makler', 'Geschäftsführung']`. Bewusst eine **Allowlist**, keine Blockliste: eine künftig neu angelegte Rolle landet damit nicht versehentlich im Leaderboard. Jannik bleibt als "Geschäftsführung" geladen, weil der TeamZiel-Block seinen Umsatz braucht.
- **Wichtig — berechnete statt Notion-gelesene Felder:** `cr_jahr` (verkaufte_objekte/einwertungen*100) und `fortschritt` (umsatz_jahr/jahresziel*100) werden **in `src/lib/notion.ts` selbst berechnet**, nicht aus Notion-Formelfeldern gelesen — die zugehörigen Notion-Felder ("CR Jahr", "Fortschritt Ziel") sind unzuverlässig/nicht gepflegt. Bei neuen KPI-Anzeigen mit %-Werten dieses Muster übernehmen, nicht blind ein Notion-Feld auslesen.
- **Format-Helper:** `src/lib/format.ts` (deutsche Zahlen: `formatCurrency`, `formatCurrencyShort`, `formatTime`, `formatMonthYear`).

### Notion-Seite (Workspace "Teigeler & Partner Immobilien")
- **Team-DB** (`NOTION_MAKLER_DB_ID`, Titel "Team", liegt unter der Seite "Leaderboard"), Data-Source `collection://25acb408-ff2b-80e3-b333-000b14c8c1f2`.
- **Rollen-Optionen im Feld `Rolle`:** Makler (blue), Backoffice (orange), Geschäftsführung (purple), Buchhaltung (green), Prokuristin (pink), Marketing (yellow). Die letzten drei wurden am 27.08.2026 neu angelegt.
- **Rollenzuordnung aktuell:** Sandro Wirth / Stefan Wortk / Relana Heick = Makler, Jannik Marcus = Geschäftsführung, Rafael Warnke = Marketing, Hannah Marcus = Buchhaltung, Gabriele Teigeler = Prokuristin.
- **Der Dashboard-Notion-Key ist READ-ONLY.** Die Integration heißt "Leaderboard Claude Code". Queries laufen, `PATCH /v1/databases/{id}` gibt 403 `restricted_resource`. Schema-Änderungen und Property-Updates deshalb über den **`notion-teigeler` MCP** fahren (OAuth mit Janniks Rechten). `GET /v1/users/me` verrät die fehlenden Rechte NICHT, das fällt erst beim Schreibversuch auf.
- **Woher die Zahlen wirklich kommen:** Alle KPI-Felder der Team-DB sind Notion-**Formeln** über die Relationen `Listings` (`collection://593caf7b-...`) und `CRM` (`collection://540b1a4c-...`), keine gepflegten Werte. Zentrale Filterbedingungen:
  - `Umsatz d. Jahr` = Summe `Umsatz (netto)` über Listings mit `Verkauft? = ✅` und `Verkaufsjahr = aktuelles Jahr`.
  - `Sold this year` und `Transaktionsvolumen dieses Jahr` hängen an **`Geldeingang*`**, nicht am Notartermin.
  - `New Listings ty` = Listings mit `Vermarktungsstart*` im laufenden Jahr und `Art* = Verkauf`.
  - `Einwertungen Jahr` = CRM-Einträge mit `Einwertungstermin*` im laufenden Jahr und `Einwertung erl.* = true`.
- **Konsequenz daraus (wichtig für "das Dashboard ist nicht aktuell"-Rückfragen):** Umsatz und Transaktionsvolumen erscheinen erst mit dem **Geldeingang**, also typischerweise 6 bis 10 Wochen nach der Beurkundung. Ein beurkundeter, aber noch nicht bezahlter Deal ist im Dashboard unsichtbar. Das ist kein Bug, sondern die Formel-Logik in Notion.

### Corporate-Design-System (in `tailwind.config.js` unter `colors.tp`)
| Token | Hex | Verwendung |
|---|---|---|
| `tp-forest` | `#052E26` | Primärgrün: Headlines, Zahlen, Card-Top-Border (3px), Hero-Karte BG |
| `tp-forest-deep` | `#03211B` | Dunkelgrün (Button-Hover, ganz dunkle Akzente) |
| `tp-sage` | `#56826F` | Akzent (Eyebrows, sekundäre Zahlen, Progress 50-75%) |
| `tp-sage-soft` | `#E9EFEA` | Helle Hervorhebung (Gesamt-Zeile, Jannik-Box, Hero-Label) |
| `tp-stone` | `#6D6E72` | Meta/Labels/Subtext |
| `tp-paper` | `#F5F2F0` | Body-Hintergrund (warmes Beige) |
| `tp-ink` | `#333333` | Haupttext |
| `tp-line` | `#E6E1DC` | Borders, Divider, Progress-Track |

- **Font:** DM Sans (next/font/google, CSS-Var `--font-dm-sans`, weights 400/500/600/700) in `layout.tsx`.
- **Card-Muster überall:** `bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg`.
- **Progress-Farben-Logik** (TeamZiel + ProgressBar): `>=75` → `tp-forest`, `>=50` → `tp-sage`, `>=25` → `amber-500`, sonst `orange-500`. Track = `tp-line`.
- **Logo:** `public/logo.png` ist das offizielle dunkelgrüne T&P-Logo. KEIN `brightness-0 invert` (war für Dark-Mode).

## Aktueller Fokus
Kein offener Arbeitsstrang. Der Rollen-Filter ist umgesetzt, gepusht und live verifiziert.

## Letzte Änderungen
**Session vom 27.08.2026, 1 Commit (gepusht + deployed):**

- **`68475cc` — Nur Makler und Geschäftsführung ins Dashboard laden** (`src/lib/notion.ts`):
  - Anlass: Rafael Warnke, Hannah Marcus und Gabriele Teigeler standen mit lauter Nullen auf den Leaderboard-Plätzen 4 bis 6, obwohl sie gar nicht als Makler arbeiten.
  - Lösung: Notion-Query bekommt einen Filter `Aktiv = true` UND `Rolle` in `TRACKED_ROLLEN`. Aus 7 geladenen Datensätzen werden 4.
  - Notion-seitig ergänzt (über den `notion-teigeler` MCP, weil der Dashboard-Key nur lesen darf): Rollen-Optionen **Buchhaltung**, **Prokuristin**, **Marketing**; Rafael = Marketing, Hannah = Buchhaltung, Gabriele = Prokuristin.
  - Verifiziert: lokal per Playwright-Screenshot gegen echte Notion-Daten (Leaderboard nur noch Sandro/Stefan/Relana, Jannik separat im Teamziel, Totals unverändert bei 23.461 € Umsatz, 435.000 € Volumen, 3 Verkäufen, 16 neuen Objekten, 31 Einwertungen), danach live gegen `/api/kpis` in Production.

**Diagnose zu Session-Beginn ("Dashboard ist nicht aktuell"):** Technisch war nichts veraltet. Notion, `/api/kpis` und die Anzeige stimmten exakt überein, Verzögerung maximal eine Minute. Der Eindruck kam von der Geldeingang-Logik der Notion-Formeln (siehe Notion-Abschnitt oben) und von den drei Null-Zeilen im Leaderboard.

## Versucht & gescheitert
- **Schema-Änderung per Dashboard-API-Key:** `PATCH /v1/databases/{id}` mit dem `NOTION_API_KEY` aus `.env.local` schlägt mit 403 `restricted_resource` fehl. Nicht weiter am Key debuggen, direkt den `notion-teigeler` MCP nehmen.
- **`ALTER COLUMN "Rolle" SET SELECT(...)` im MCP mit falschen Farben:** bricht mit "Cannot update color of select with name: Makler" ab. Die bestehenden Optionen müssen mit ihren **exakten aktuellen Farben** mitgeschickt werden (Makler blue, Backoffice orange, Geschäftsführung purple), sonst geht es nicht durch.
- **Filter-Varianten, die verworfen wurden:** "Jahresziel nicht leer" und "Rolle ≠ Backoffice" waren im Angebot. Jannik hat sich für saubere Rollenpflege in Notion plus Allowlist im Code entschieden. Ein reiner `Rolle = Makler`-Filter scheidet aus, weil Jannik selbst auf "Geschäftsführung" steht und für den TeamZiel-Block geladen bleiben muss.
- **Look-Richtung war erst unklar (Vorsession).** Geklärt: "TV-optimiert nicht mehr aktuell, läuft auf Desktop, responsive mit Handy, TV zweitrangig." → Entscheidung **Hell/Beige 1:1** (Dossier-Body-Look).
- **Umsatz-Präsenz (Vorsession):** Gewählt: eigene Umsatz-Karte oben (NICHT Label im Teamziel, NICHT Transaktionsvolumen ersetzen). TeamZiel-Block zeigt weiterhin dieselbe Zahl als Zielfortschritt — bewusst so.

## Offene Fragen / To-dos
- **Sichtprüfung am Handy:** Steht weiterhin aus. Jannik soll bei Gelegenheit gegenchecken, ob Hero-Umsatz-Karte, Fortschritts-Werte und das jetzt kürzere Leaderboard sauber responsive aussehen.
- **Neue Teammitglieder:** Wer künftig im Dashboard auftauchen soll, braucht in der Notion-Team-DB `Aktiv = true` und die Rolle "Makler" (oder "Geschäftsführung"). Ohne Rolle erscheint niemand mehr. Bei einer neuen Rolle, die getrackt werden soll, `TRACKED_ROLLEN` in `src/lib/notion.ts` erweitern.
- **Möglicher Feinschliff (angeboten, nicht beauftragt):** Akzentfarbe für "Ziel erreicht", Kartenreihenfolge, evtl. eigene Sektion für CR/Conversion.
- **Kein** offener Bug bekannt.

## Wiedereinstieg-Cheatsheet
```bash
# Projekt
cd ~/Projects/teigeler-dashboard

# lokal ohne Login starten, mit ECHTEN Notion-Daten (Port 3004)
DASHBOARD_PASSWORD= npm run dev

# Build prüfen
npm run build && npx tsc --noEmit

# Deploy = einfach pushen (Vercel Auto-Deploy, ~30-45s)
git push origin main

# Live-API prüfen (Passwort aus .env.local)
set -a && . ./.env.local && set +a
JAR=$(mktemp)
curl -s -o /dev/null -c "$JAR" -X POST https://teigeler-dashboard.vercel.app/api/auth \
  -H "Content-Type: application/json" -d "{\"password\":\"${DASHBOARD_PASSWORD}\"}"
curl -s -b "$JAR" https://teigeler-dashboard.vercel.app/api/kpis
```
Notion-Rohdaten gegenprüfen: `POST https://api.notion.com/v1/databases/${NOTION_MAKLER_DB_ID}/query` mit `Authorization: Bearer ${NOTION_API_KEY}` und `Notion-Version: 2022-06-28` (nur lesen, siehe oben). Screenshots/visuelle QA: Playwright über Python (`playwright.sync_api`) ist auf dem Rechner verfügbar und hat hier funktioniert. Design-Vorlage: `~/Projects/tp-einwertungsdossier/template.html`.
