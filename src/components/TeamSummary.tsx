'use client';

import { MaklerRecord } from '@/lib/types';
import KpiCard from './KpiCard';

interface TeamSummaryProps {
  makler: MaklerRecord[];
}

export default function TeamSummary({ makler }: TeamSummaryProps) {
  const totals = makler.reduce(
    (acc, m) => ({
      umsatz: acc.umsatz + m.umsatz_jahr,
      transaktionsvolumen: acc.transaktionsvolumen + m.transaktionsvolumen_jahr,
      verkauft: acc.verkauft + m.verkaufte_objekte,
      neue: acc.neue + m.neue_objekte,
      einwertungen: acc.einwertungen + m.einwertungstermine,
    }),
    { umsatz: 0, transaktionsvolumen: 0, verkauft: 0, neue: 0, einwertungen: 0 }
  );

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Leitkennzahl: Team-Gesamtumsatz */}
      <KpiCard
        label={`Team-Umsatz ${new Date().getFullYear()}`}
        value={totals.umsatz}
        isCurrency
        variant="hero"
      />
      {/* Weitere Team-KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Transaktionsvolumen" value={totals.transaktionsvolumen} isCurrency />
        <KpiCard label="Verkaufte Objekte" value={totals.verkauft} />
        <KpiCard label="Neue Objekte" value={totals.neue} />
        <KpiCard label="Einwertungstermine" value={totals.einwertungen} />
      </div>
    </div>
  );
}
