'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/lib/format';

interface KpiCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  variant?: 'default' | 'hero';
}

export default function KpiCard({ label, value, isCurrency = false, variant = 'default' }: KpiCardProps) {
  const animatedValue = useCountUp(value);

  const displayValue = isCurrency
    ? formatCurrency(Math.round(animatedValue))
    : Math.round(animatedValue).toString();

  // Hero-Variante: prominente, dunkelgruene Leitkennzahl (Dossier-Hero-Stil)
  if (variant === 'hero') {
    return (
      <div className="bg-tp-forest rounded-lg px-5 py-5 sm:px-8 sm:py-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 transition-all duration-500">
        <div className="text-xs sm:text-sm font-semibold text-tp-sage-soft uppercase tracking-[0.14em]">
          {label}
        </div>
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tabular-nums leading-none transition-all duration-500">
          {displayValue}
        </div>
      </div>
    );
  }

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
