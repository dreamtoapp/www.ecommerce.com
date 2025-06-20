'use client';
// app/dashboard/orders-management/status/canceled/components/CanceledOrdersView.tsx
import React, { useState } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { restoreOrder } from '../actions/restore-order';
import { Order } from '@/types/databaseTypes';

interface CanceledOrdersViewProps {
  orders: Order[];
  canceledCount: number;
  currentPage: number;
  pageSize: number;
  reasonFilter?: string;
}

export default function CanceledOrdersView({
  orders,
  canceledCount,
  currentPage,
  pageSize,
  reasonFilter
}: CanceledOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState(reasonFilter || 'all');

  // Calculate total pages
  const totalPages = Math.ceil(canceledCount / pageSize) || 1;

  // Update URL with new page number and filters
  const updateFilters = (page: number, newReason?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    if (newReason && newReason !== 'all') {
      params.set('reason', newReason);
    } else {
      params.delete('reason');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle reason filter change
  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    updateFilters(1, value);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: ar });
    } catch (error) {
      return 'تاريخ غير صالح';
    }
  };

  // Get cancellation reason display with appropriate styling
  const getCancellationReasonDisplay = (reason?: string) => {
    if (!reason) return 'غير محدد';

    const reasonMap: Record<string, { label: string, color: string }> = {
      'customer_request': {
        label: 'طلب العميل',
        color: 'bg-blue-100 text-blue-800'
      },
      'out_of_stock': {
        label: 'نفاد المخزون',
        color: 'bg-amber-100 text-amber-800'
      },
      'delivery_issue': {
        label: 'مشكلة في التوصيل',
        color: 'bg-purple-100 text-purple-800'
      },
      'payment_failed': {
        label: 'فشل الدفع',
        color: 'bg-red-100 text-red-800'
      },
      'other': {
        label: 'سبب آخر',
        color: 'bg-gray-100 text-gray-800'
      },
    };

    const reasonInfo = reasonMap[reason] || { label: reason, color: 'bg-gray-100 text-gray-800' };

    return (
      <Badge variant="outline" className={cn(reasonInfo.color)}>
        {reasonInfo.label}
      </Badge>
    );
  };

  // Handle order recovery (restore canceled order)
  const handleRecoverOrder = async (orderId: string) => {
    setLoading(true);
    await restoreOrder(orderId);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <XCircle className="h-6 w-6 text-red-600 icon-enhanced" />
            الطلبات الملغاة
          </h2>
          <p className="text-muted-foreground">
            تحليل وإدارة الطلبات التي تم إلغاؤها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <span className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700 font-semibold text-sm shadow-sm">
            ملغاة: <span className="font-bold">{canceledCount}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
          <Input
            type="search"
            placeholder="بحث عن طلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4 ml-2 rtl:mr-2" />
            بحث
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">سبب الإلغاء:</span>
          <Select value={selectedReason} onValueChange={handleReasonChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="جميع الأسباب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأسباب</SelectItem>
              <SelectItem value="customer_request">طلب العميل</SelectItem>
              <SelectItem value="out_of_stock">نفاد المخزون</SelectItem>
              <SelectItem value="delivery_issue">مشكلة في التوصيل</SelectItem>
              <SelectItem value="payment_failed">فشل الدفع</SelectItem>
              <SelectItem value="other">أسباب أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">تاريخ الإلغاء</TableHead>
                  <TableHead className="text-right">سبب الإلغاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary">
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer?.name || 'غير معروف'}</TableCell>
                    <TableCell className="font-semibold">{order.amount} ر.س</TableCell>
                    <TableCell>
                      {formatDate(String(order.updatedAt))}
                    </TableCell>
                    <TableCell>
                      {getCancellationReasonDisplay(order.resonOfcancel || 'other')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRecoverOrder(order.id)}
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-100 hover:text-green-700"
                          title="استعادة الطلب"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/dashboard/show-invoice/${order.id}`}
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors",
                            "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          title="عرض التفاصيل"
                        >
                          <Search className="h-4 w-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center p-4">
            {renderPagination()}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <XCircle className="h-16 w-16 text-red-600" />
            <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد طلبات ملغاة</h3>
            <p className="text-sm text-muted-foreground">
              {reasonFilter
                ? 'لا توجد طلبات ملغاة بهذا السبب'
                : 'لا توجد طلبات ملغاة حالياً'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}