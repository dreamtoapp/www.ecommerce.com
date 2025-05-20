// app/dashboard/orders-management/status/delivered/page.tsx
import { Metadata } from 'next';

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
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
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
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل الطلبات
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}