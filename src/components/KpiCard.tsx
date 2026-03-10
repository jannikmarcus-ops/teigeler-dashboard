'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/lib/format';

interface KpiCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
}

export default function KpiCard({ label, value, isCurrency = false }: KpiCardProps) {
  const animatedValue = useCountUp(value);

  const displayValue = isCurrency
    ? formatCurrency(Math.round(animatedValue))
    : Math.round(animatedValue).toString();

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl px-7 py-5 flex flex-col items-center justify-center transition-all duration-500">
      <div className="text-base font-medium text-dashboard-muted uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-5xl font-black text-dashboard-text tabular-nums transition-all duration-500">
        {displayValue}
      </div>
    </div>
  );
}
