'use client';

import { Button } from '@/components/ui/button';

interface PeriodSelectorProps {
  selected: '7d' | '30d' | '90d';
  onSelect: (period: '7d' | '30d' | '90d') => void;
}

export function PeriodSelector({ selected, onSelect }: PeriodSelectorProps) {
  const periods = [
    { value: '7d' as const, label: '7 Days' },
    { value: '30d' as const, label: '30 Days' },
    { value: '90d' as const, label: '90 Days' },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selected === period.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(period.value)}
          className="transition-all"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}