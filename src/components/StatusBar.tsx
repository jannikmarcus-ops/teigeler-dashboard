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
    <div className="flex items-center justify-between text-base text-dashboard-muted mt-4">
      <div className="flex items-center gap-2">
        {error ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400">
              Daten von {formatTime(lastUpdate)} Uhr — {error}
            </span>
          </>
        ) : isMockData ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-400">
              Demo-Daten — Notion nicht verbunden
            </span>
          </>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-dashboard-success" />
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
