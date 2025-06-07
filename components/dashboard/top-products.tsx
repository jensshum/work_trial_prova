'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopProductsData } from '@/lib/api';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';

interface TopProductsProps {
  data: TopProductsData | null;
  isLoading: boolean;
}

export function TopProducts({ data, isLoading }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Clothing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Home': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Books': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Sports': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          Top Products
        </CardTitle>
        <CardDescription>
          Best performing products by revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          data?.products.map((product, index) => (
            <div key={product.id} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                  </div>
                  <Badge variant="secondary" className={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(product.total_revenue)}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(product.units_sold)} units</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {product.growth_rate >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    product.growth_rate >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {product.growth_rate >= 0 ? '+' : ''}{product.growth_rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}