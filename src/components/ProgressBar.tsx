'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrencyShort } from '@/lib/format';

interface ProgressBarProps {
  name: string;
  progress: number;
  jahresziel: number;
  umsatz_jahr: number;
}

export default function ProgressBar({
  name,
  progress,
  jahresziel,
  umsatz_jahr,
}: ProgressBarProps) {
  const animatedProgress = useCountUp(Math.min(progress, 100), 1500);

  const progressColor =
    progress >= 75
      ? 'bg-tp-forest'
      : progress >= 50
        ? 'bg-tp-sage'
        : progress >= 25
          ? 'bg-amber-500'
          : 'bg-orange-500';

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      {/* Mobile: Name + Prozent in einer Zeile; Desktop: Name als eigene Spalte */}
      <div className="flex items-center justify-between sm:contents">
        <div className="sm:w-40 text-sm sm:text-base font-semibold text-tp-ink truncate">
          {name}
        </div>
        <span className="sm:hidden text-sm font-bold text-tp-ink tabular-nums shrink-0">
          {animatedProgress.toFixed(1).replace('.', ',')}%
        </span>
      </div>
      <div className="flex-1 h-5 sm:h-6 bg-tp-line rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
      <div className="hidden sm:block sm:w-48 text-right text-base text-tp-stone tabular-nums">
        <span className="font-bold text-tp-ink">
          {animatedProgress.toFixed(1).replace('.', ',')}%
        </span>{' '}
        von {formatCurrencyShort(jahresziel)}
      </div>
    </div>
  );
}
