'use client';

import { MaklerRecord } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface LeaderboardProps {
  makler: MaklerRecord[];
}

const MEDAL_STYLES: Record<string, { emoji: string; color: string; bg: string }> = {
  gold:   { emoji: '\u{1F947}', color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
  silver: { emoji: '\u{1F948}', color: 'text-slate-500',  bg: 'bg-slate-50 border-slate-200' },
  bronze: { emoji: '\u{1F949}', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
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
    <div className="bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg px-4 sm:px-6 py-5 sm:py-6">
      <h2 className="text-base sm:text-lg font-bold text-tp-forest mb-3 uppercase tracking-wider">
        Leaderboard — Dieses Jahr
      </h2>
      <div className="space-y-2">
        {filteredMakler.map((m) => {
          const style = getMedalForRank(m.rank, teamSize);
          const hasMedal = style !== null;

          return (
            <div
              key={m.name}
              className={`flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border transition-all duration-500 ${
                hasMedal ? style.bg : 'bg-tp-paper border-tp-line'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl w-8 text-center shrink-0">
                  {style?.emoji ?? `${m.rank}.`}
                </span>
                <span
                  className={`text-base sm:text-lg lg:text-xl font-bold ${
                    hasMedal ? style.color : 'text-tp-ink'
                  }`}
                >
                  {m.name}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:flex lg:items-center gap-x-3 gap-y-1.5 lg:gap-5 text-sm lg:text-base pl-11 lg:pl-0">
                <div className="text-tp-stone">
                  <span className="font-bold text-tp-ink tabular-nums">
                    {formatCurrency(m.umsatz)}
                  </span>
                </div>
                <div className="text-tp-stone">
                  <span className="font-bold text-tp-ink tabular-nums">
                    {m.verkaufte_objekte}
                  </span>{' '}
                  Verk.
                </div>
                <div className="text-tp-stone">
                  <span className="font-bold text-tp-ink tabular-nums">
                    {m.neue_objekte}
                  </span>{' '}
                  Neue
                </div>
                <div className="text-tp-stone">
                  <span className="font-bold text-tp-ink tabular-nums">
                    {m.einwertungstermine}
                  </span>{' '}
                  Einw.
                </div>
                <div className="text-tp-stone">
                  <span className="font-bold text-tp-ink tabular-nums">
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
