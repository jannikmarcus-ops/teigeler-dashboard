'use client';

import { MaklerRecord } from '@/lib/types';
import { formatCurrency, formatCurrencyShort } from '@/lib/format';
import { useCountUp } from '@/hooks/useCountUp';

interface TeamZielProps {
  makler: MaklerRecord[];
}

const FALLBACK_JAHRESZIEL = 1_000_000; // Fallback falls Notion-Wert fehlt

export default function TeamZiel({ makler }: TeamZielProps) {
  // Jannik-Daten fuer die Anzeige als Vertriebsleiter
  const jannik = makler.find((m) => m.name.toLowerCase().includes('jannik'));

  // Team-Jahresziel dynamisch aus Janniks Notion-Profil lesen
  const teamJahresziel = jannik?.team_jahresziel && jannik.team_jahresziel > 0
    ? jannik.team_jahresziel
    : FALLBACK_JAHRESZIEL;

  // Team-Umsatz = Summe aller Makler (inkl. Jannik)
  const teamUmsatz = makler.reduce((sum, m) => sum + m.umsatz_jahr, 0);
  const teamProgress = Math.min((teamUmsatz / teamJahresziel) * 100, 100);

  const animatedProgress = useCountUp(teamProgress, 1500);

  const progressColor =
    teamProgress >= 75
      ? 'bg-tp-forest'
      : teamProgress >= 50
        ? 'bg-tp-sage'
        : teamProgress >= 25
          ? 'bg-amber-500'
          : 'bg-orange-500';

  return (
    <div className="bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg px-4 sm:px-6 py-5 sm:py-6">
      <h2 className="text-base sm:text-lg font-bold text-tp-forest mb-3 uppercase tracking-wider">
        Teamziel {new Date().getFullYear()}
      </h2>

      {/* Grosser Fortschrittsbalken */}
      <div className="mb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-2">
          <span className="text-tp-stone">
            <span className="text-xl sm:text-2xl font-bold text-tp-forest tabular-nums">
              {formatCurrency(teamUmsatz)}
            </span>{' '}
            <span className="text-base sm:text-lg">von</span>{' '}
            <span className="text-lg sm:text-xl font-bold text-tp-ink tabular-nums">
              {formatCurrencyShort(teamJahresziel)}
            </span>
          </span>
          <span className="text-xl sm:text-2xl font-bold text-tp-forest tabular-nums">
            {animatedProgress.toFixed(1).replace('.', ',')}%
          </span>
        </div>
        <div className="h-6 sm:h-8 bg-tp-line rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Jannik als Vertriebsleiter */}
      {jannik && (
        <div className="flex items-center gap-3 rounded-lg px-3 sm:px-4 py-3 bg-tp-sage-soft border border-tp-sage/30">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-tp-sage/40 flex items-center justify-center text-lg sm:text-xl shrink-0">
            {'\u{1F3AF}'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-bold text-tp-forest truncate">
              {jannik.name}
            </div>
            <div className="text-[0.65rem] sm:text-xs text-tp-sage uppercase tracking-wider">
              Vertriebsleitung
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-base sm:text-lg font-bold text-tp-forest tabular-nums">
              {formatCurrency(jannik.umsatz_jahr)}
            </div>
            <div className="text-[0.65rem] sm:text-xs text-tp-stone">
              eigener Umsatz
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
