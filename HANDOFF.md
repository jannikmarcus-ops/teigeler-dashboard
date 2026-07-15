# HANDOFF: teigeler-dashboard
_Stand: 15.07.2026 17:10_

## Ziel
TV-/Web-KPI-Dashboard für das Makler-Team von Teigeler & Partner. Zieht Live-Daten aus Notion und zeigt Team-Kennzahlen (Umsatz, Transaktionsvolumen, Objekte, Einwertungen), Leaderboard, Teamziel-Fortschritt und Jahresziele pro Makler. Responsive auf **Desktop (primär)** und **Handy**, TV-Wallboard zweitrangig. Look = **T&P Corporate Design** (Vorlage: Projekt `~/Projects/tp-einwertungsdossier`).

## Aktueller Stand
**Fertig und live deployed, keine bekannten Bugs.**
- **Branch:** `main`, sauber, in Sync mit `origin`. Letzter Commit `d134ebc`.
- **Live:** https://teigeler-dashboard.vercel.app — Production liefert 200, Deploy verifiziert (Login-Test mit echten Notion-Daten, siehe unten).
- **Build:** `npm run build` grün.
- **Login-Passwort (Prod):** liegt in `DASHBOARD_PASSWORD` (Vercel-Env), nicht lokal in `.env.local` — die existiert hier nicht. Passwort selbst NICHT hier notieren (Credentials nie im Klartext, siehe globale CLAUDE.md).
- Es liegt eine **unabhängige, nicht committete Änderung an `.gitignore`** im Arbeitsverzeichnis (fügt `.gstack/` hinzu). Stammt nicht aus dieser Session, bewusst unangetastet gelassen.

### Tech-/Projektfakten (für schnellen Wiedereinstieg)
- **Stack:** Next.js 14.2.21 (App Router), TypeScript, Tailwind, deployed auf **Vercel via Git-Integration** → `git push origin main` löst automatisch Production-Deploy aus (kein CLI, kein `.vercel`-Ordner lokal).
- **Dev-Server:** `npm run dev` läuft auf **Port 3004** (`next dev -p 3004`).
- **Login/Auth:** `src/middleware.ts` schützt alles außer `/login` und `/api/auth`. Passwort in `DASHBOARD_PASSWORD` (`.env.local`, git-ignored, existiert lokal nicht). Ist die Variable leer/ungesetzt → **kein Schutz**. → Für lokales Testen ohne Login: `DASHBOARD_PASSWORD= npm run dev`.
- **Daten:** Notion API. Ohne Notion-Token Fallback auf **Demo-/Mock-Daten** (`data.isMockData=true`, StatusBar zeigt gelben Hinweis).
- **Datenmodell `MaklerRecord`** (src/lib/types.ts): u.a. `umsatz_jahr`, `transaktionsvolumen_jahr`, `verkaufte_objekte`, `neue_objekte`, `einwertungstermine`, `aktuell_im_verkauf`, `cr_jahr`, `jahresziel`, `fortschritt`, `team_jahresziel`, `name`. **Jannik (Vertriebsleiter)** wird im Leaderboard und YearProgress rausgefiltert (`name` enthält "jannik") und im TeamZiel-Block separat angezeigt.
- **Wichtig — berechnete statt Notion-gelesene Felder:** `cr_jahr` (verkaufte_objekte/einwertungen*100) und jetzt auch `fortschritt` (umsatz_jahr/jahresziel*100) werden **in `src/lib/notion.ts` selbst berechnet**, nicht aus Notion-Formelfeldern gelesen — die zugehörigen Notion-Felder ("CR Jahr", "Fortschritt Ziel") sind unzuverlässig/nicht gepflegt. Bei neuen KPI-Anzeigen mit %-Werten dieses Muster übernehmen, nicht blind ein Notion-Feld auslesen.
- **Format-Helper:** `src/lib/format.ts` (deutsche Zahlen: `formatCurrency`, `formatCurrencyShort`, `formatTime`, `formatMonthYear`).

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
Aufgaben abgeschlossen und live. Kein offener Arbeitsstrang.

## Letzte Änderungen
**1 Commit in dieser Session (gepusht + deployed):**

- **`d134ebc` — Fix: Fortschritt-Ziel selbst berechnen statt aus Notion-Feld lesen** (`src/lib/notion.ts`):
  - Bug: Jahresziel-Fortschritt-Balken (Sektion unten rechts) zeigten bei allen Maklern 0,0%, obwohl im Leaderboard bereits echter Umsatz getrackt war (Sandro Wirth 10.020 €).
  - Root Cause: `fortschritt` wurde aus Notion-Feld `Fortschritt Ziel` gelesen statt berechnet — dieses Feld war nicht zuverlässig gepflegt (analog zum älteren `cr_jahr`-Bug, Commit `990ac01`).
  - Fix: `fortschritt: jahresziel > 0 ? (umsatzJahr / jahresziel) * 100 : 0`, `jahresziel` wird jetzt vorher in einer eigenen Variable extrahiert.
  - Live verifiziert (Login mit Prod-Passwort + Screenshot): Sandro Wirth zeigt jetzt korrekt **3,3% von 300k €** (10.020/300.000), Stefan Wortk und Relana Heick zu Recht 0,0% (die haben aktuell tatsächlich 0 € Umsatz).

## Versucht & gescheitert
- **Look-Richtung war erst unklar (Vorsession).** Erste Frage (hell vs. dunkelgrün) wurde von Jannik geklärt: "TV-optimiert nicht mehr aktuell, läuft auf Desktop, responsive mit Handy, TV zweitrangig." → Entscheidung **Hell/Beige 1:1** (Dossier-Body-Look).
- **Umsatz-Präsenz (Vorsession):** Gewählt: eigene Umsatz-Karte oben (NICHT Label im Teamziel, NICHT Transaktionsvolumen ersetzen). TeamZiel-Block zeigt weiterhin dieselbe Zahl als Zielfortschritt — bewusst so.

## Offene Fragen / To-dos
- **Echte Notion-Daten:** In dieser Session gegen echte Live-Daten verifiziert (Login + Screenshot) — Fortschritt-Fix bestätigt korrekt. Erledigt.
- **Sichtprüfung am Handy:** Steht noch aus — Jannik soll bei Gelegenheit auf dem Handy gegenchecken, ob Hero-Umsatz-Karte + neue Fortschritt-Werte sauber responsive aussehen.
- **Möglicher Feinschliff (angeboten, nicht beauftragt):** Akzentfarbe für "Ziel erreicht", Kartenreihenfolge, evtl. eigene Sektion für CR/Conversion. Bei Bedarf umsetzen.
- **Kein** offener Bug bekannt.

## Wiedereinstieg-Cheatsheet
```bash
# Projekt
cd ~/Projects/teigeler-dashboard

# lokal ohne Login starten (Demo-Daten, Port 3004)
DASHBOARD_PASSWORD= npm run dev

# Build prüfen
npm run build

# Deploy = einfach pushen (Vercel Auto-Deploy)
git push origin main
```
Live-Login-Passwort: siehe Vercel-Env `DASHBOARD_PASSWORD` oder Jannik fragen. Screenshots/visuelle QA: `/browse`-Skill (gstack) oder webapp-testing-Skill (Playwright). Design-Vorlage: `~/Projects/tp-einwertungsdossier/template.html`.
