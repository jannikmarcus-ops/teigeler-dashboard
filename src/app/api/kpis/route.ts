import { NextResponse } from 'next/server';
import { fetchMaklerFromNotion } from '@/lib/notion';

// Immer zur Laufzeit rechnen: Beim Bauen des Containers gibt es keinen Notion-Zugang, ein vorberechneter
// Stand wären die Beispieldaten aus mock-data.ts. Notion wird höchstens alle 30 Sekunden gefragt.
export const dynamic = 'force-dynamic';
const CACHE_MS = 30_000;
let cache: { zeit: number; antwort: unknown } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.zeit < CACHE_MS) {
    return NextResponse.json(cache.antwort);
  }
  try {
    const { makler, isMockData } = await fetchMaklerFromNotion();

    if (isMockData) {
      console.warn('KPI API: Liefert Mock-Daten (Notion nicht erreichbar)');
    }

    const antwort = { makler, lastUpdate: new Date().toISOString(), isMockData };
    if (!isMockData) {
      cache = { zeit: Date.now(), antwort };
    }
    return NextResponse.json(antwort);
  } catch (error) {
    console.error('KPI API Error:', error);
    return NextResponse.json(
      { error: 'Daten konnten nicht geladen werden' },
      { status: 500 }
    );
  }
}
