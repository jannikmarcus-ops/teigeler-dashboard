'use client';

import { formatTime } from '@/lib/format';

interface StatusBarProps {
  lastUpdate: Date;
  secondsUntilRefresh: number;
  error: string | null;
  isMockData?: boolean;
}

export default function StatusBar({
  lastUpdate,
  secondsUntilRefresh,
  error,
  isMockData,
}: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm sm:text-base text-tp-stone">
      <div className="flex items-center gap-2">
        {error ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span className="text-orange-700">
              Daten von {formatTime(lastUpdate)} Uhr — {error}
            </span>
          </>
        ) : isMockData ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="text-amber-700">
              Demo-Daten — Notion nicht verbunden
            </span>
          </>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-tp-sage shrink-0" />
            <span>Letztes Update: {formatTime(lastUpdate)} Uhr</span>
          </>
        )}
      </div>
      <div className="tabular-nums">
        Auto-Refresh: {secondsUntilRefresh}s
      </div>
    </div>
  );
}
