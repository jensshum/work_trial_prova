'use client';

import { useState, useEffect } from 'react';
import { DataTable, Column } from './data-table';
import { api, Product, ProductsData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';

export function ProductsTable() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  }>({ key: 'total_revenue', direction: 'desc' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sort_by: String(sortConfig.key),
        sort_order: sortConfig.direction,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setProductsData(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Mock data for demo
      setProductsData({
        products: [
          {
            id: 1,
            name: 'Wireless Headphones Pro',
            category: 'Electronics',
            price: 149.99,
            stock: 45,
            total_revenue: 15000.00,
            units_sold: 100,
            growth_rate: 15.5,
            status: 'active',
            created_date: '2024-12-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Smart Fitness Watch',
            category: 'Electronics',
            price: 199.99,
            stock: 23,
            total_revenue: 12000.00,
            units_sold: 60,
            growth_rate: 8.2,
            status: 'active',
            created_date: '2024-11-15T00:00:00Z'
          },
          {
            id: 3,
            name: 'Premium Coffee Beans',
            category: 'Food & Beverage',
            price: 29.99,
            stock: 0,
            total_revenue: 8500.00,
            units_sold: 284,
            growth_rate: -5.3,
            status: 'out_of_stock',
            created_date: '2024-10-20T00:00:00Z'
          },
          {
            id: 4,
            name: 'Yoga Mat Deluxe',
            category: 'Sports',
            price: 79.99,
            stock: 67,
            total_revenue: 6400.00,
            units_sold: 80,
            growth_rate: 22.1,
            status: 'active',
            created_date: '2024-11-30T00:00:00Z'
          },
          {
            id: 5,
            name: 'Bluetooth Speaker',
            category: 'Electronics',
            price: 149.99,
            stock: 12,
            total_revenue: 4500.00,
            units_sold: 30,
            growth_rate: -12.4,
            status: 'inactive',
            created_date: '2024-09-10T00:00:00Z'
          }
        ],
        total: 87,
        page: currentPage,
        limit: 10
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, sortConfig, categoryFilter, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      out_of_stock: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Food & Beverage': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Clothing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Home': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };

    return (
      <Badge variant="secondary" className={colors[category] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const getGrowthIndicator = (growthRate: number) => {
    const isPositive = growthRate >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{growthRate.toFixed(1)}%
        </span>
      </div>
    );
  };

  const columns: Column<Product>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`,
      className: 'font-mono text-sm w-16'
    },
    {
      key: 'name',
      label: 'Product Name',
      className: 'font-medium max-w-[200px] truncate'
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => getCategoryBadge(value)
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value),
      className: 'font-semibold'
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, item) => (
        <span className={`font-medium ${
          value === 0 ? 'text-red-600' : 
          value < 20 ? 'text-yellow-600' : 
          'text-emerald-600'
        }`}>
          {formatNumber(value)}
        </span>
      ),
      className: 'text-center'
    },
    {
      key: 'units_sold',
      label: 'Sold',
      render: (value) => formatNumber(value),
      className: 'text-center'
    },
    {
      key: 'total_revenue',
      label: 'Revenue',
      render: (value) => formatCurrency(value),
      className: 'font-semibold'
    },
    {
      key: 'growth_rate',
      label: 'Growth',
      render: (value) => getGrowthIndicator(value),
      className: 'text-center'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const handleSort = (key: keyof Product, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (key: keyof Product, value: string) => {
    if (key === 'category') {
      setCategoryFilter(value);
      setCurrentPage(1);
    } else if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DataTable
      data={productsData?.products || []}
      columns={columns}
      title="Product Inventory"
      description="Manage your product catalog and track performance"
      searchPlaceholder="Search products by name or ID..."
      searchKeys={['name', 'id']}
      filterOptions={[
        {
          key: 'category',
          label: 'Category',
          options: [
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Food & Beverage', label: 'Food & Beverage' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Clothing', label: 'Clothing' },
            { value: 'Home', label: 'Home' }
          ]
        },
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'out_of_stock', label: 'Out of Stock' }
          ]
        }
      ]}
      isLoading={isLoading}
      pagination={productsData ? {
        page: productsData.page,
        limit: productsData.limit,
        total: productsData.total,
        onPageChange: handlePageChange
      } : undefined}
      onSort={handleSort}
      onSearch={handleSearch}
      onFilter={handleFilter}
    />
  );
}