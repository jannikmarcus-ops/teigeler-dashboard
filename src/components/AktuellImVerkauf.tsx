'use client';

import { MaklerRecord } from '@/lib/types';

interface AktuellImVerkaufProps {
  makler: MaklerRecord[];
}

export default function AktuellImVerkauf({ makler }: AktuellImVerkaufProps) {
  // Alle Makler anzeigen, sortiert nach Anzahl absteigend
  const sorted = [...makler].sort(
    (a, b) => b.aktuell_im_verkauf - a.aktuell_im_verkauf
  );

  const total = sorted.reduce((sum, m) => sum + m.aktuell_im_verkauf, 0);

  return (
    <div className="bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg px-4 sm:px-6 py-5 sm:py-6">
      <h2 className="text-base sm:text-lg font-bold text-tp-forest mb-3 uppercase tracking-wider">
        Aktuell im Verkauf
      </h2>
      <div className="space-y-2">
        {sorted.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 bg-tp-paper border border-tp-line"
          >
            <span className="text-base sm:text-lg text-tp-ink font-medium">
              {m.name}
            </span>
            <span className="text-lg sm:text-xl font-bold text-tp-sage tabular-nums">
              {m.aktuell_im_verkauf}
            </span>
          </div>
        ))}
        {/* Gesamt */}
        <div className="flex items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 bg-tp-sage-soft border border-tp-sage/30 mt-1">
          <span className="text-base sm:text-lg text-tp-forest font-bold">
            Gesamt
          </span>
          <span className="text-lg sm:text-xl font-bold text-tp-forest tabular-nums">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
