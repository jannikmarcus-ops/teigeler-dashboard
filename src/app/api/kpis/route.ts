import { NextResponse } from 'next/server';
import { fetchMaklerFromNotion } from '@/lib/notion';

export const revalidate = 30; // Cache fuer 30 Sekunden

export async function GET() {
  try {
    const { makler, isMockData } = await fetchMaklerFromNotion();

    if (isMockData) {
      console.warn('KPI API: Liefert Mock-Daten (Notion nicht erreichbar)');
    }

    return NextResponse.json({
      makler,
      lastUpdate: new Date().toISOString(),
      isMockData,
    });
  } catch (error) {
    console.error('KPI API Error:', error);
    return NextResponse.json(
      { error: 'Daten konnten nicht geladen werden' },
      { status: 500 }
    );
  }
}
