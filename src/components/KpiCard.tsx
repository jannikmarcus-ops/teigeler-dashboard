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
    <div className="bg-white border border-tp-line border-t-[3px] border-t-tp-forest rounded-lg px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center justify-center text-center transition-all duration-500">
      <div className="text-[0.65rem] sm:text-xs font-semibold text-tp-sage uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-tp-forest tabular-nums leading-none transition-all duration-500">
        {displayValue}
      </div>
    </div>
  );
}
