import { Client } from '@notionhq/client';
import { MaklerRecord } from './types';
import { MOCK_MAKLER } from './mock-data';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Notion Property Extractors
function extractTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? 'Unbekannt';
}

function extractNumber(prop: any): number {
  if (!prop) return 0;
  if (prop.type === 'number') return prop.number ?? 0;
  if (prop.type === 'rollup') return prop.rollup?.number ?? 0;
  if (prop.type === 'formula') {
    if (prop.formula?.type === 'number') return prop.formula.number ?? 0;
    if (prop.formula?.type === 'string') {
      // Deutsche Zahlenformate behandeln (z.B. "100.000,00 €" → 100000)
      const raw = (prop.formula.string ?? '0')
        .replace(/[^0-9.,\-]/g, '') // Waehrungszeichen etc. entfernen
        .replace(/\./g, '')          // Tausenderpunkte entfernen
        .replace(',', '.');          // Dezimalkomma → Dezimalpunkt
      const parsed = parseFloat(raw);
      return isNaN(parsed) ? 0 : parsed;
    }
  }
  return 0;
}

// Mehrstufige Ranking-Logik:
// 1. Umsatz d. Jahr (hoechste Prioritaet)
// 2. New Listings ty
// 3. Einwertungen Jahr
export function rankMakler(rawMakler: Omit<MaklerRecord, 'score' | 'rank'>[]): MaklerRecord[] {
  const withRank = rawMakler.map((m) => ({
    ...m,
    score: m.umsatz, // Score = Umsatz (primaeres Ranking-Kriterium)
    rank: 0,
  }));

  withRank.sort((a, b) => {
    // 1. Umsatz absteigend
    if (a.umsatz !== b.umsatz) return b.umsatz - a.umsatz;
    // 2. Neue Objekte absteigend (Tiebreaker)
    if (a.neue_objekte !== b.neue_objekte) return b.neue_objekte - a.neue_objekte;
    // 3. Einwertungstermine absteigend (zweiter Tiebreaker)
    return b.einwertungstermine - a.einwertungstermine;
  });

  withRank.forEach((m, i) => {
    m.rank = i + 1;
  });

  return withRank;
}

// Rueckgabe-Typ mit Mock-Data-Indikator
export interface FetchResult {
  makler: MaklerRecord[];
  isMockData: boolean;
}

// Makler-Daten aus Notion holen
export async function fetchMaklerFromNotion(): Promise<FetchResult> {
  const dbId = process.env.NOTION_MAKLER_DB_ID;

  if (!dbId || !process.env.NOTION_API_KEY) {
    console.warn('Notion credentials missing — using mock data');
    return { makler: rankMakler(MOCK_MAKLER), isMockData: true };
  }

  try {
    const response = await notion.databases.query({
      database_id: dbId,
    });

    const rawMakler = response.results.map((page: any) => {
      const props = page.properties;
      // Umsatz-Feld wird einmal gelesen und fuer beide Felder verwendet
      const umsatzJahr = extractNumber(props['Umsatz d. Jahr']);
      return {
        // WICHTIG: Diese Property-Namen muessen mit der Notion-DB uebereinstimmen!
        // Nutze /api/explore um die echten Namen zu pruefen
        name: extractTitle(props['Name']),
        // 4 Kern-KPIs: Jahresdaten
        umsatz: umsatzJahr,
        verkaufte_objekte: extractNumber(props['Sold this year']),
        neue_objekte: extractNumber(props['New Listings ty']),
        einwertungstermine: extractNumber(props['Einwertungen Jahr']),
        // Zusaetzliche Felder
        cr_jahr: extractNumber(props['CR Jahr']),
        aktuell_im_verkauf: extractNumber(props['Aktuell im Verkauf']),
        // Jahresdaten fuer Fortschrittsanzeige (identisch mit umsatz)
        umsatz_jahr: umsatzJahr,
        jahresziel: extractNumber(props['Jahresziel']),
        fortschritt: extractNumber(props['Fortschritt Ziel']),
        // Transaktionsvolumen (Gesamtvolumen aller Deals)
        transaktionsvolumen_jahr: extractNumber(props['Transaktionsvolumen dieses Jahr']),
        // Team-Jahresziel (nur bei Jannik gepflegt)
        team_jahresziel: extractNumber(props['Team Jahresziel']),
      };
    });

    return { makler: rankMakler(rawMakler), isMockData: false };
  } catch (error) {
    console.error('Notion API Error:', error);
    return { makler: rankMakler(MOCK_MAKLER), isMockData: true };
  }
}
