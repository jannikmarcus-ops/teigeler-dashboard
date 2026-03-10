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
      ? 'bg-dashboard-success'
      : progress >= 50
        ? 'bg-dashboard-accent'
        : progress >= 25
          ? 'bg-yellow-500'
          : 'bg-orange-500';

  return (
    <div className="flex items-center gap-5">
      <div className="w-44 text-lg font-semibold text-dashboard-text truncate">
        {name}
      </div>
      <div className="flex-1 h-7 bg-slate-600/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
      <div className="w-60 text-right text-lg text-dashboard-muted tabular-nums">
        <span className="font-bold text-dashboard-text">
          {animatedProgress.toFixed(1).replace('.', ',')}%
        </span>{' '}
        von {formatCurrencyShort(jahresziel)}
      </div>
    </div>
  );
}
