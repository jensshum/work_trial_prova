'use client';

import { useState, useEffect } from 'react';
import { api, OverviewMetrics, SalesTrendData, TopProductsData } from '@/lib/api';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { TopProducts } from '@/components/dashboard/top-products';
import { PeriodSelector } from '@/components/dashboard/period-selector';
import { OrderSimulator } from '@/components/dashboard/order-simulator';
import { OrdersTable } from '@/components/dashboard/orders-table';
import { ProductsTable } from '@/components/dashboard/products-table';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, BarChart3, ShoppingCart, Package } from 'lucide-react';

export default function DashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [overviewData, setOverviewData] = useState<OverviewMetrics | null>(null);
  const [salesData, setSalesData] = useState<SalesTrendData | null>(null);
  const [productsData, setProductsData] = useState<TopProductsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [overview, sales, products] = await Promise.all([
        api.getOverview(period),
        api.getSalesTrends(period),
        api.getTopProducts(10, period),
      ]);

      setOverviewData(overview);
      setSalesData(sales);
      setProductsData(products);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                TrendMart Analytics
              </h1>
              <p className="text-muted-foreground">
                Monitor your store performance and insights
              </p>
            </div>
          </div>
          <PeriodSelector selected={period} onSelect={setPeriod} />
        </div>

        {/* Overview Cards */}
        <OverviewCards data={overviewData} isLoading={isLoading} />

        {/* Charts and Top Products */}
        <div className="grid gap-6 lg:grid-cols-3">
          <SalesChart data={salesData} isLoading={isLoading} />
          <TopProducts data={productsData} isLoading={isLoading} />
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersTable />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <ProductsTable />
          </TabsContent>
        </Tabs>

        {/* Order Simulator */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Testing Tools</h2>
          </div>
          <OrderSimulator />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>TrendMart Merchant Analytics Dashboard</p>
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}