'use client';

import { MaklerRecord } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface LeaderboardProps {
  makler: MaklerRecord[];
}

const MEDAL_STYLES: Record<string, { emoji: string; color: string; bg: string }> = {
  gold:   { emoji: '\u{1F947}', color: 'text-dashboard-gold',   bg: 'bg-yellow-500/10 border-yellow-500/30' },
  silver: { emoji: '\u{1F948}', color: 'text-dashboard-silver', bg: 'bg-slate-400/10 border-slate-400/30' },
  bronze: { emoji: '\u{1F949}', color: 'text-dashboard-bronze', bg: 'bg-amber-600/10 border-amber-600/30' },
};

/** Medaillen-Logik abhaengig von Teamgroesse:
 *  1-3 Personen → nur Gold (Platz 1)
 *  4   Personen → Gold + Silber
 *  5+  Personen → Gold + Silber + Bronze
 */
function getMedalForRank(rank: number, teamSize: number) {
  if (rank === 1) return MEDAL_STYLES.gold;
  if (rank === 2 && teamSize >= 4) return MEDAL_STYLES.silver;
  if (rank === 3 && teamSize >= 5) return MEDAL_STYLES.bronze;
  return null;
}

export default function Leaderboard({ makler }: LeaderboardProps) {
  // Jannik (Vertriebsleiter) herausfiltern und Raenge neu vergeben
  const filteredMakler = makler
    .filter((m) => !m.name.toLowerCase().includes('jannik'))
    .map((m, i) => ({ ...m, rank: i + 1 }));

  const teamSize = filteredMakler.length;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl px-7 py-6">
      <h2 className="text-xl font-bold text-dashboard-text mb-3 uppercase tracking-wider">
        Leaderboard — Dieses Jahr
      </h2>
      <div className="space-y-2">
        {filteredMakler.map((m) => {
          const style = getMedalForRank(m.rank, teamSize);
          const hasMedal = style !== null;

          return (
            <div
              key={m.name}
              className={`flex items-center justify-between rounded-xl px-5 py-3 border transition-all duration-500 ${
                hasMedal
                  ? style.bg
                  : 'bg-slate-700/30 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl w-11 text-center">
                  {style?.emoji ?? `${m.rank}.`}
                </span>
                <span
                  className={`text-xl font-bold ${
                    hasMedal ? style.color : 'text-dashboard-text'
                  }`}
                >
                  {m.name}
                </span>
              </div>
              <div className="flex items-center gap-6 text-lg">
                <div className="text-dashboard-muted">
                  <span className="font-bold text-dashboard-text tabular-nums">
                    {formatCurrency(m.umsatz)}
                  </span>
                </div>
                <div className="text-dashboard-muted">
                  <span className="font-bold text-dashboard-text tabular-nums">
                    {m.verkaufte_objekte}
                  </span>{' '}
                  Verk.
                </div>
                <div className="text-dashboard-muted">
                  <span className="font-bold text-dashboard-text tabular-nums">
                    {m.neue_objekte}
                  </span>{' '}
                  Neue
                </div>
                <div className="text-dashboard-muted">
                  <span className="font-bold text-dashboard-text tabular-nums">
                    {m.einwertungstermine}
                  </span>{' '}
                  Einw.
                </div>
                <div className="text-dashboard-muted">
                  <span className="font-bold text-dashboard-text tabular-nums">
                    {m.cr_jahr.toFixed(1).replace('.', ',')}%
                  </span>{' '}
                  CR
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
