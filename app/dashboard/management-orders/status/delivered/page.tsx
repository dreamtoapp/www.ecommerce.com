// app/dashboard/orders-management/status/delivered/page.tsx
import { CheckCircle } from 'lucide-react';
import { Metadata } from 'next';

import BackButton from '@/components/BackButton';
import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-delevired-order';
import DeliveredOrdersView from './components/DeliveredOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات المسلمة | لوحة التحكم',
  description: 'إدارة الطلبات التي تم تسليمها بنجاح',
};

interface PageProps {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    dateRange?: string;
  }>;
}

export default async function DeliveredOrdersPage({
  params,
  searchParams
}: PageProps) {
  // Resolve promises in parallel
  const [_, resolvedSearchParams] = await Promise.all([
    params, // Resolve even if unused
    searchParams
  ]);

  // Destructure and validate parameters
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1)
  const pageSize = Math.max(10, Number(resolvedSearchParams.pageSize) || 10)
  const dateRange = (
    resolvedSearchParams.dateRange || 'all'
  ) as 'all' | 'today' | 'week' | 'month' | 'year';

  try {
    // Parallel data fetching
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.DELIVERED,
        page: currentPage,
        pageSize,
        dateRange,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-4 p-4" dir="rtl">
        <BackButton variant="default" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <CheckCircle className="h-6 w-6 text-green-600 icon-enhanced" />
              الطلبات المسلمة
            </h2>
            <p className="text-muted-foreground">إدارة الطلبات التي تم تسليمها بنجاح</p>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-green-700 font-semibold text-sm shadow-sm">
              تم التسليم: <span className="font-bold">{analytics}</span>
            </span>
          </div>
        </div>

        <DeliveredOrdersView
          orders={orders.orders}
          deliveredCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          dateRange={dateRange}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading delivered orders:', error);
    return (
      <div className="font-cairo relative flex flex-col space-y-4 p-4" dir="rtl">
        <BackButton variant="default" />

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">
            حدث خطأ أثناء تحميل الطلبات
          </h3>
          <p className="text-destructive/80">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}