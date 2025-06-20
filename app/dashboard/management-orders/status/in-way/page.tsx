// app/dashboard/orders-management/status/in-way/page.tsx

import { Truck } from 'lucide-react';
import { Metadata } from 'next';

import BackButton from '@/components/BackButton';
import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-inWay-order';
import InWayOrdersView from './components/InWayOrdersView';
import SyncOrderInWayButton from './components/SyncOrderInWayButton';

export const metadata: Metadata = {
  title: 'الطلبات في الطريق | لوحة التحكم',
  description: 'إدارة الطلبات التي في طريقها للتسليم',
};

export default async function InWayOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; driverId?: string }>;
}) {
  // Get current page and page size from URL or use defaults
  const awaitedSearchParams = await searchParams;
  const currentPage = Number(awaitedSearchParams.page) || 1;
  const pageSize = Number(awaitedSearchParams.pageSize) || 10;
  const driverId = awaitedSearchParams.driverId || 'all';

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.IN_TRANSIT,
        driverId: driverId !== 'all' ? driverId : undefined,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-4 p-4 bg-background min-h-screen" dir="rtl">
        <BackButton variant="default" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <Truck className="h-6 w-6 text-feature-commerce icon-enhanced" />
              الطلبات في الطريق
            </h2>
            <p className="text-muted-foreground">إدارة الطلبات التي في طريقها للتسليم</p>
          </div>

          <div className="flex items-center gap-3">
            <SyncOrderInWayButton />
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-feature-commerce" />
              <span className="rounded-lg bg-feature-commerce-soft border border-feature-commerce px-4 py-2 text-feature-commerce font-semibold text-sm shadow-sm">
                في الطريق: <span className="font-bold">{analytics}</span>
              </span>
            </div>
          </div>
        </div>

        <InWayOrdersView
          orders={orders.orders}
          inWayCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          selectedDriverId={driverId}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading in-way orders:', error);

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
