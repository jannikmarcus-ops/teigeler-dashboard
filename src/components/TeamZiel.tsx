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
      ? 'bg-dashboard-success'
      : teamProgress >= 50
        ? 'bg-dashboard-accent'
        : teamProgress >= 25
          ? 'bg-yellow-500'
          : 'bg-orange-500';

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl px-7 py-6">
      <h2 className="text-xl font-bold text-dashboard-text mb-3 uppercase tracking-wider">
        Teamziel {new Date().getFullYear()}
      </h2>

      {/* Grosser Fortschrittsbalken */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-dashboard-muted">
            <span className="text-2xl font-extrabold text-dashboard-text tabular-nums">
              {formatCurrency(teamUmsatz)}
            </span>{' '}
            <span className="text-lg">von</span>{' '}
            <span className="text-xl font-bold text-dashboard-text tabular-nums">
              {formatCurrencyShort(teamJahresziel)}
            </span>
          </span>
          <span className="text-2xl font-extrabold text-dashboard-text tabular-nums">
            {animatedProgress.toFixed(1).replace('.', ',')}%
          </span>
        </div>
        <div className="h-8 bg-slate-600/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Jannik als Vertriebsleiter */}
      {jannik && (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-dashboard-accent/10 border border-dashboard-accent/30">
          <div className="w-11 h-11 rounded-full bg-dashboard-accent/20 flex items-center justify-center text-xl">
            {'\u{1F3AF}'}
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-dashboard-text">
              {jannik.name}
            </div>
            <div className="text-xs text-dashboard-muted uppercase tracking-wider">
              Vertriebsleitung
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-dashboard-accent tabular-nums">
              {formatCurrency(jannik.umsatz_jahr)}
            </div>
            <div className="text-xs text-dashboard-muted">
              eigener Umsatz
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
