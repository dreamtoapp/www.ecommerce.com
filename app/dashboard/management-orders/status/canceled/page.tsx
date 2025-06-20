// app/dashboard/orders-management/status/canceled/page.tsx

import { XCircle } from 'lucide-react';
import { Metadata } from 'next';

import BackButton from '@/components/BackButton';
import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-canceld-order';
import CanceledOrdersView from './components/CanceledOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات الملغية | لوحة التحكم',
  description: 'إدارة الطلبات التي تم إلغاؤها',
};

export default async function CanceledOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; reason?: string }>;
}) {
  // Get current page and page size from URL or use defaults
  const searchParamsData = await searchParams;
  const pageValue = searchParamsData.page;
  const pageSizeValue = searchParamsData.pageSize;
  const pageSize = pageSizeValue ? Number(pageSizeValue) : 10;
  const reasonValue = searchParamsData.reason;

  const currentPage: number = Number(pageValue ?? "1") || 1;
  const pageSizeVal: number = Number(pageSizeValue ?? "10") || 10;
  const reasonFilter = reasonValue || "";

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.CANCELED,
        page: currentPage,
        pageSize: pageSizeVal,
        reason: reasonFilter,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-4 p-4" dir="rtl">
        <BackButton variant="default" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <XCircle className="h-6 w-6 text-red-600 icon-enhanced" />
              الطلبات الملغية
            </h2>
            <p className="text-muted-foreground">إدارة الطلبات التي تم إلغاؤها</p>
          </div>

          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700 font-semibold text-sm shadow-sm">
              ملغية: <span className="font-bold">{analytics}</span>
            </span>
          </div>
        </div>

        <CanceledOrdersView
          orders={orders.orders}
          canceledCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          reasonFilter={reasonFilter}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading canceled orders:', error);

    return (
      <div className="font-cairo relative flex flex-col space-y-4 p-4" dir="rtl">
        <BackButton variant="default" />

        {/* Error Message */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">حدث خطأ أثناء تحميل الطلبات</h3>
          <p className="text-destructive/80">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
        </div>
      </div>
    );
  }
}
