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
    <div className="bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg px-4 sm:px-6 py-5 sm:py-6">
      <h2 className="text-base sm:text-lg font-bold text-tp-forest mb-3 uppercase tracking-wider">
        Jahresziel-Fortschritt
      </h2>
      <div className="space-y-3 sm:space-y-4">
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
