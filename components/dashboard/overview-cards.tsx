'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { OverviewMetrics } from '@/lib/api';

interface OverviewCardsProps {
  data: OverviewMetrics | null;
  isLoading: boolean;
}

export function OverviewCards({ data, isLoading }: OverviewCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: data ? formatCurrency(data.total_revenue) : '$0',
      icon: DollarSign,
      bgGradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Orders',
      value: data ? formatNumber(data.total_orders) : '0',
      icon: ShoppingCart,
      bgGradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Average Order Value',
      value: data ? formatCurrency(data.average_order_value) : '$0',
      icon: TrendingUp,
      bgGradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden transition-all hover:shadow-lg">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-5`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`${card.iconBg} p-2 rounded-full`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data ? `Last ${data.period}` : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}