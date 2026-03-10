'use client';

import { useState, useEffect } from 'react';
import { formatTime, formatMonthYear } from '@/lib/format';

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right">
      <div className="text-3xl font-bold text-dashboard-text tabular-nums">
        {formatTime(now)} Uhr
      </div>
      <div className="text-xl text-dashboard-muted capitalize">
        {formatMonthYear(now)}
      </div>
    </div>
  );
}
