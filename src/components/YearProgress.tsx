'use client';

import { MaklerRecord } from '@/lib/types';
import ProgressBar from './ProgressBar';

interface YearProgressProps {
  makler: MaklerRecord[];
}

export default function YearProgress({ makler }: YearProgressProps) {
  // Jannik herausfiltern + nur Makler mit Jahresziel anzeigen
  const withGoals = makler.filter(
    (m) => m.jahresziel > 0 && !m.name.toLowerCase().includes('jannik')
  );

  if (withGoals.length === 0) return null;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl px-7 py-6">
      <h2 className="text-xl font-bold text-dashboard-text mb-3 uppercase tracking-wider">
        Jahresziel-Fortschritt
      </h2>
      <div className="space-y-3">
        {withGoals.map((m) => (
          <ProgressBar
            key={m.name}
            name={m.name}
            progress={m.fortschritt}
            jahresziel={m.jahresziel}
            umsatz_jahr={m.umsatz_jahr}
          />
        ))}
      </div>
    </div>
  );
}
