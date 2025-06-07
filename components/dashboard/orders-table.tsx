'use client';

import { useState, useEffect } from 'react';
import { DataTable, Column } from './data-table';
import { api, Order, OrdersData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export function OrdersTable() {
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'asc' | 'desc';
  }>({ key: 'order_date', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sort_by: String(sortConfig.key),
        sort_order: sortConfig.direction,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrdersData(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for demo
      setOrdersData({
        orders: [
          {
            id: 1001,
            customer_name: 'John Smith',
            product_name: 'Wireless Headphones Pro',
            quantity: 2,
            total_amount: 299.98,
            status: 'completed',
            order_date: '2025-01-15T10:30:00Z',
            category: 'Electronics'
          },
          {
            id: 1002,
            customer_name: 'Sarah Johnson',
            product_name: 'Smart Fitness Watch',
            quantity: 1,
            total_amount: 199.99,
            status: 'pending',
            order_date: '2025-01-15T09:15:00Z',
            category: 'Electronics'
          },
          {
            id: 1003,
            customer_name: 'Mike Davis',
            product_name: 'Premium Coffee Beans',
            quantity: 3,
            total_amount: 89.97,
            status: 'completed',
            order_date: '2025-01-14T16:45:00Z',
            category: 'Food & Beverage'
          },
          {
            id: 1004,
            customer_name: 'Emily Chen',
            product_name: 'Yoga Mat Deluxe',
            quantity: 1,
            total_amount: 79.99,
            status: 'cancelled',
            order_date: '2025-01-14T14:20:00Z',
            category: 'Sports'
          },
          {
            id: 1005,
            customer_name: 'Robert Wilson',
            product_name: 'Bluetooth Speaker',
            quantity: 1,
            total_amount: 149.99,
            status: 'refunded',
            order_date: '2025-01-13T11:30:00Z',
            category: 'Electronics'
          }
        ],
        total: 125,
        page: currentPage,
        limit: 10
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, sortConfig, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      refunded: 'outline',
    };
    
    const colors: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value) => `#${value}`,
      className: 'font-mono text-sm'
    },
    {
      key: 'customer_name',
      label: 'Customer',
      className: 'font-medium'
    },
    {
      key: 'product_name',
      label: 'Product',
      className: 'max-w-[200px] truncate'
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <Badge variant="outline\" className="text-xs">
          {value}
        </Badge>
      )
    },
    {
      key: 'quantity',
      label: 'Qty',
      className: 'text-center'
    },
    {
      key: 'total_amount',
      label: 'Total',
      render: (value) => formatCurrency(value),
      className: 'font-semibold'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'order_date',
      label: 'Date',
      render: (value) => formatDate(value),
      className: 'text-sm text-muted-foreground'
    }
  ];

  const handleSort = (key: keyof Order, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (key: keyof Order, value: string) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DataTable
      data={ordersData?.orders || []}
      columns={columns}
      title="Recent Orders"
      description="Manage and track all customer orders"
      searchPlaceholder="Search orders, customers, or products..."
      searchKeys={['customer_name', 'product_name', 'id']}
      filterOptions={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'refunded', label: 'Refunded' }
          ]
        }
      ]}
      isLoading={isLoading}
      pagination={ordersData ? {
        page: ordersData.page,
        limit: ordersData.limit,
        total: ordersData.total,
        onPageChange: handlePageChange
      } : undefined}
      onSort={handleSort}
      onSearch={handleSearch}
      onFilter={handleFilter}
    />
  );
}