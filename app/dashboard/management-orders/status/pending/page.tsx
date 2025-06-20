// app/dashboard/orders-management/status/pending/page.tsx

import { Clock, MousePointerBan } from 'lucide-react';
import { PageProps } from '@/types/commonTypes';
import { ORDER_STATUS } from '@/constant/order-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-pendeing-order';
import PendingOrdersView from './components/PendingOrdersView';

export default async function PendingOrdersPage({
  searchParams,
}: PageProps<Record<string, never>, { page?: string; pageSize?: string; search?: string; sortBy?: string; sortOrder?: string }>) {
  const resolvedSearchParams = await searchParams;

  // Get current page and page size from URL or use defaults
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchTerm = resolvedSearchParams?.search || '';
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;

  // Ensure sortBy is a valid value for the backend type
  const allowedSortFields = ['createdAt', 'orderNumber', 'amount'] as const;
  const sortByParam = resolvedSearchParams?.sortBy;
  const sortBy = allowedSortFields.includes(sortByParam as any)
    ? (sortByParam as typeof allowedSortFields[number])
    : 'createdAt';
  const sortOrder = resolvedSearchParams?.sortOrder === 'asc' ? 'asc' : 'desc';

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.PENDING,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        search: searchTerm,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton variant="minimal" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MousePointerBan className="h-6 w-6 text-yellow-500 icon-enhanced" />
                الطلبات قيد الانتظار
              </h1>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-2">
            <Clock className="h-4 w-4" />
            قيد الانتظار: {analytics}
          </Badge>
        </div>

        {/* Status Overview Card */}
        <Card className="shadow-lg border-l-4 border-l-yellow-500 card-hover-effect">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-yellow-500 icon-enhanced" />
              إدارة الطلبات قيد الانتظار
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">العدد الإجمالي</p>
                    <p className="text-2xl font-bold text-yellow-600">{analytics}</p>
                  </div>
                  <MousePointerBan className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">في الصفحة الحالية</p>
                    <p className="text-2xl font-bold text-blue-600">{orders.orders.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">تحتاج معالجة فورية</p>
                    <p className="text-2xl font-bold text-green-600">{Math.ceil(analytics * 0.3)}</p>
                  </div>
                  <MousePointerBan className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">الصفحة الحالية</p>
                    <p className="text-2xl font-bold text-purple-600">{currentPage}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {currentPage}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>نصيحة:</strong> الطلبات قيد الانتظار تحتاج إلى مراجعة وموافقة. استخدم البحث والتصفية لإدارة الطلبات بكفاءة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders Management */}
        <PendingOrdersView
          orders={orders.orders}
          pendingCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading pending orders:', error);

    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        <BackButton variant="minimal" />

        {/* Enhanced Error Card */}
        <Card className="shadow-lg border-l-4 border-l-red-500 card-hover-effect">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <MousePointerBan className="h-5 w-5 icon-enhanced" />
              خطأ في تحميل الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <h3 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ أثناء تحميل الطلبات قيد الانتظار</h3>
              <p className="text-red-600 mb-4">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
              <Badge variant="destructive" className="gap-2">
                <Clock className="h-4 w-4" />
                خطأ في التحميل
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
