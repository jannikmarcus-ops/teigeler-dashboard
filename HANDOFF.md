# HANDOFF: teigeler-dashboard
_Stand: 29.06.2026 08:14_

## Ziel
TV-/Web-KPI-Dashboard für das Makler-Team von Teigeler & Partner. Zieht Live-Daten aus Notion und zeigt Team-Kennzahlen (Umsatz, Transaktionsvolumen, Objekte, Einwertungen), Leaderboard, Teamziel-Fortschritt und Jahresziele pro Makler. Soll responsive auf **Desktop (primär)** und **Handy** laufen, TV-Wallboard nur noch zweitrangig. Look = **T&P Corporate Design** (Vorlage: Projekt `~/Projects/tp-einwertungsdossier`).

## Aktueller Stand
**Fertig und live deployed.** Beide Hauptaufgaben dieser Session abgeschlossen:
1. Dashboard ist komplett responsive (war vorher reines TV-Wallboard, auf Handy zerschossen).
2. Komplettes Re-Design auf T&P Corporate Design (Light/Beige + Forest Green + DM Sans).
3. Team-Gesamtumsatz als prominente dunkelgrüne Leitkennzahl oben ergänzt.

- **Branch:** `main`, sauber, in Sync mit `origin`. Letzter Commit `a2f2007`.
- **Live:** https://teigeler-dashboard.vercel.app — Production liefert 200, Deploy verifiziert.
- **Build:** `npm run build` grün. Visuell verifiziert (Playwright) in 390px / 768px / 1440px.

### Tech-/Projektfakten (für schnellen Wiedereinstieg)
- **Stack:** Next.js 14.2.21 (App Router), TypeScript, Tailwind, deployed auf **Vercel via Git-Integration** → `git push origin main` löst automatisch Production-Deploy aus (kein CLI, kein `.vercel`-Ordner lokal).
- **Dev-Server:** `npm run dev` läuft auf **Port 3004** (`next dev -p 3004`).
- **Login/Auth:** `src/middleware.ts` schützt alles außer `/login` und `/api/auth`. Passwort in `DASHBOARD_PASSWORD` (`.env.local`, git-ignored). Ist die Variable leer/ungesetzt → **kein Schutz**. → Für lokales Testen ohne Login: `DASHBOARD_PASSWORD= npm run dev`.
- **Daten:** Notion API. Ohne Notion-Token Fallback auf **Demo-/Mock-Daten** (`data.isMockData=true`, StatusBar zeigt gelben Hinweis). Notion-Anbindung wurde in dieser Session NICHT angefasst.
- **Datenmodell `MaklerRecord`** (src/lib/types.ts): u.a. `umsatz_jahr`, `transaktionsvolumen_jahr`, `verkaufte_objekte`, `neue_objekte`, `einwertungstermine`, `aktuell_im_verkauf`, `cr_jahr`, `jahresziel`, `fortschritt`, `team_jahresziel`, `name`. **Jannik (Vertriebsleiter)** wird im Leaderboard und YearProgress rausgefiltert (`name` enthält "jannik") und im TeamZiel-Block separat angezeigt.
- **Format-Helper:** `src/lib/format.ts` (deutsche Zahlen: `formatCurrency`, `formatCurrencyShort`, `formatTime`, `formatMonthYear`).

### Corporate-Design-System (jetzt in `tailwind.config.js` unter `colors.tp`)
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
- **Logo:** `public/logo.png` ist jetzt das offizielle dunkelgrüne T&P-Logo (aus `tp-einwertungsdossier/assets-global/logo.png` kopiert). KEIN `brightness-0 invert` mehr (war für Dark-Mode).

## Aktueller Fokus
Aufgaben sind abgeschlossen und live. Kein offener Arbeitsstrang. Nächster Schritt nur, falls Jannik weiter optimieren will (siehe To-dos).

## Letzte Änderungen
**2 Commits in dieser Session (beide gepusht + deployed):**

- **`b609ba2` — Dashboard responsive + T&P Corporate Design** (15 Dateien):
  - `tailwind.config.js`: alte `dashboard`-Palette (Dark-Mode) **komplett entfernt**, neue `tp`-Palette + DM Sans als `font-sans`.
  - `src/app/layout.tsx`: Inter → **DM Sans**, **`export const viewport`** ergänzt (war die Hauptursache fürs kaputte Mobile-Rendering), Body auf `bg-tp-paper text-tp-ink`.
  - `src/app/globals.css`: globales `overflow:hidden` (TV-Zwang) + Scrollbar-Hide **entfernt**. TV-Vollbildmodus jetzt opt-in via `<html class="tv-mode">`.
  - `src/components/Dashboard.tsx`: `h-screen`→`min-h-screen`, responsive Padding (`px-4 sm:px-6 lg:px-8`), Main-Grid `grid-cols-1 lg:grid-cols-2`, Logo-Invert raus.
  - `KpiCard` / `TeamSummary`: KPI-Grid `grid-cols-2 lg:grid-cols-4`, weiße Karten mit grüner Top-Border, fluide Schriftgrößen.
  - `Leaderboard`: 5-Spalten-Werte-Reihe (lief auf Mobile über) → auf Mobile gestapeltes `grid-cols-3`, ab `lg` wieder Flex-Reihe. Medaillen-Styles auf Light-Mode (amber/slate/orange-50).
  - `ProgressBar`: feste `w-44`/`w-60` **raus** → Name+% gestapelt auf Mobile (`sm:contents`-Trick), Reihe auf Desktop.
  - `TeamZiel`, `YearProgress`, `AktuellImVerkauf`, `Clock`, `StatusBar`: Corporate-Farben + responsive.
  - `src/app/login/page.tsx`: mitgezogen; kaputten Verweis auf `/logo-white.png` (existierte nicht im public/) auf `/logo.png` gefixt; Button `bg-tp-forest`.
  - `public/logo.png`: durch dunkelgrünes Corporate-Logo ersetzt.

- **`a2f2007` — Team-Umsatz als prominente Leitkennzahl oben** (2 Dateien):
  - `src/components/KpiCard.tsx`: neue Prop **`variant?: 'default' | 'hero'`**. `hero` = dunkelgrüne (`bg-tp-forest`) Vollbreit-Karte im Dossier-Hero-Stil, Label links (sage-soft), große weiße Zahl rechts. Kein duplizierter Code, `useCountUp` läuft vor dem Branch.
  - `src/components/TeamSummary.tsx`: `totals` um **`umsatz`** (Summe `umsatz_jahr`) erweitert; rendert Hero-Karte `Team-Umsatz {Jahr}` über dem 4er-KPI-Grid.

## Versucht & gescheitert
- **Look-Richtung war erst unklar.** Erste Frage (hell vs. dunkelgrün) wurde von Jannik geklärt: "TV-optimiert nicht mehr aktuell, läuft auf Desktop, responsive mit Handy, TV zweitrangig." → Entscheidung **Hell/Beige 1:1** (Dossier-Body-Look). Dunkelgrün wäre nur bei TV-Priorität sinnvoll gewesen.
- **Umsatz-Präsenz:** Jannik hatte zwei Wege genannt (Label im Teamziel ODER prominente Karte oben). Gewählt: **eigene Umsatz-Karte oben** (NICHT Label im Teamziel, NICHT Transaktionsvolumen ersetzen). TeamZiel-Block zeigt weiterhin dieselbe Zahl als *Zielfortschritt* — das ist bewusst so (Leitkennzahl oben, Fortschritt im Teamziel).
- **Login live nicht screenshotbar:** Die Hauptseite (mit Hero-Karte) liegt hinter dem Passwort, Demo-Test lief lokal mit leerer `DASHBOARD_PASSWORD`. Live-Verifikation nur über `/login` (öffentlich) möglich.

## Offene Fragen / To-dos
- **Sichtprüfung am Handy:** Jannik soll nach Login auf teigeler-dashboard.vercel.app gegenchecken (Hero-Umsatz-Karte ist nur eingeloggt sichtbar).
- **Echte Notion-Daten:** Tests liefen mit Demo-Daten (0-Werte → Progress-Bars wirken leer). Mit echten Werten füllen sich die Balken grün. Notion-Anbindung unverändert, ggf. mal mit echten Daten gegenchecken.
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
Screenshots/visuelle QA: webapp-testing-Skill (Playwright) + `~/.claude/skills/webapp-testing/scripts/with_server.py`. Design-Vorlage: `~/Projects/tp-einwertungsdossier/template.html`.
