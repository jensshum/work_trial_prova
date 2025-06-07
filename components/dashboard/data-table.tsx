'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filterOptions?: {
    key: keyof T;
    label: string;
    options: { value: string; label: string }[];
  }[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  onFilter?: (key: keyof T, value: string) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filterOptions = [],
  isLoading = false,
  pagination,
  onSort,
  onSearch,
  onFilter,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter and search data locally if no external handlers provided
  const filteredData = useMemo(() => {
    if (onSearch || onFilter) return data; // External handling

    let filtered = [...data];

    // Apply search
    if (searchQuery && searchKeys.length > 0) {
      filtered = filtered.filter(item =>
        searchKeys.some(key =>
          String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => String(item[key]) === value);
      }
    });

    return filtered;
  }, [data, searchQuery, filters, searchKeys, onSearch, onFilter]);

  // Sort data locally if no external handler provided
  const sortedData = useMemo(() => {
    if (onSort) return filteredData; // External handling

    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, onSort]);

  const handleSort = (key: keyof T) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilter = (key: keyof T, value: string) => {
    setFilters(prev => ({ ...prev, [key as string]: value }));
    onFilter?.(key, value);
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      refunded: 'outline',
      active: 'default',
      inactive: 'secondary',
      out_of_stock: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const renderCardView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedData.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {columns.map((column) => (
              <div key={String(column.key)} className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {column.label}:
                </span>
                <span className="text-sm">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`text-left p-4 font-medium text-muted-foreground ${column.className || ''}`}
              >
                {column.sortable !== false ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </Button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b">
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            sortedData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                {columns.map((column) => (
                  <td key={String(column.key)} className={`p-4 ${column.className || ''}`}>
                    {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="hidden sm:flex"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="sm:hidden"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filterOptions.map((filter) => (
            <Select
              key={String(filter.key)}
              value={filters[String(filter.key)] || 'all'}
              onValueChange={(value) => handleFilter(filter.key, value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'cards' ? renderCardView() : renderTableView()}
        
        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}