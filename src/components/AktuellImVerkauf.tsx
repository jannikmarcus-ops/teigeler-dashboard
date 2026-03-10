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
    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl px-7 py-6">
      <h2 className="text-xl font-bold text-dashboard-text mb-3 uppercase tracking-wider">
        Aktuell im Verkauf
      </h2>
      <div className="space-y-2">
        {sorted.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-xl px-5 py-2.5 bg-slate-700/30"
          >
            <span className="text-lg text-dashboard-text font-medium">
              {m.name}
            </span>
            <span className="text-xl font-bold text-dashboard-accent tabular-nums">
              {m.aktuell_im_verkauf}
            </span>
          </div>
        ))}
        {/* Gesamt */}
        <div className="flex items-center justify-between rounded-xl px-5 py-2.5 bg-dashboard-accent/10 border border-dashboard-accent/30 mt-1">
          <span className="text-lg text-dashboard-text font-bold">
            Gesamt
          </span>
          <span className="text-xl font-bold text-dashboard-accent tabular-nums">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
