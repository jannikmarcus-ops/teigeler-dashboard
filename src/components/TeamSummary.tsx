'use client';

import { MaklerRecord } from '@/lib/types';
import KpiCard from './KpiCard';

interface TeamSummaryProps {
  makler: MaklerRecord[];
}

export default function TeamSummary({ makler }: TeamSummaryProps) {
  const totals = makler.reduce(
    (acc, m) => ({
      transaktionsvolumen: acc.transaktionsvolumen + m.transaktionsvolumen_jahr,
      verkauft: acc.verkauft + m.verkaufte_objekte,
      neue: acc.neue + m.neue_objekte,
      einwertungen: acc.einwertungen + m.einwertungstermine,
    }),
    { transaktionsvolumen: 0, verkauft: 0, neue: 0, einwertungen: 0 }
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <KpiCard label="Transaktionsvolumen" value={totals.transaktionsvolumen} isCurrency />
      <KpiCard label="Verkaufte Objekte" value={totals.verkauft} />
      <KpiCard label="Neue Objekte" value={totals.neue} />
      <KpiCard label="Einwertungstermine" value={totals.einwertungen} />
    </div>
  );
}
