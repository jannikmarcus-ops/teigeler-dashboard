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
    <div className="text-right shrink-0">
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-tp-forest tabular-nums leading-tight">
        {formatTime(now)} Uhr
      </div>
      <div className="text-sm sm:text-base lg:text-xl text-tp-stone capitalize">
        {formatMonthYear(now)}
      </div>
    </div>
  );
}
