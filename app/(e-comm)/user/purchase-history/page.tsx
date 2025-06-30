import { redirect } from 'next/navigation';
import { ShoppingBag, Star, TrendingUp, DollarSign, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { iconVariants } from '@/lib/utils';

import { auth } from '@/auth';
import { getUserPurchaseHistory } from './actions';
import PurchaseHistoryList from './components/PurchaseHistoryList';
import Link from '@/components/link';

export const metadata = {
  title: 'سجل المشتريات | المتجر الإلكتروني',
  description: 'عرض سجل مشترياتك السابقة وتقييم المنتجات التي اشتريتها',
};

export default async function PurchaseHistoryPage() {
  // Get the current user
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/user/purchase-history');
  }

  // Get the user's purchase history
  const userId = session.user.id;
  if (!userId) {
    redirect('/auth/login?redirect=/user/purchase-history');
  }
  const purchaseHistory = await getUserPurchaseHistory(userId);

  // Calculate statistics
  const totalOrders = purchaseHistory.length;
  // const totalSpent = purchaseHistory.reduce((sum, order) => {
  //   const orderTotal = order.products.reduce((productSum, product) => productSum + product.price, 0);
  //   return sum + orderTotal;
  // }, 0);

  // Calculate by status (excluding canceled orders for spending)
  const statusStats = purchaseHistory.reduce((acc, order) => {
    const orderTotal = order.products.reduce((sum, product) => sum + product.price, 0);
    const status = order.status;

    if (!acc[status]) {
      acc[status] = { count: 0, total: 0 };
    }
    acc[status].count++;
    acc[status].total += orderTotal;

    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  // Total spent excluding canceled orders
  const totalSpentExcludingCanceled = purchaseHistory
    .filter(order => order.status !== 'CANCELED')
    .reduce((sum, order) => {
      const orderTotal = order.products.reduce((productSum, product) => productSum + product.price, 0);
      return sum + orderTotal;
    }, 0);

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'قيد الانتظار'
        };
      case 'ASSIGNED':
        return {
          icon: Package,
          color: 'text-secondary',
          bgColor: 'bg-secondary/10',
          borderColor: 'border-secondary/20',
          label: 'تم التعيين'
        };
      case 'IN_TRANSIT':
        return {
          icon: TrendingUp,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          label: 'في الطريق'
        };
      case 'DELIVERED':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'تم التوصيل'
        };
      case 'CANCELED':
        return {
          icon: XCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'ملغي'
        };
      default:
        return {
          icon: Package,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          borderColor: 'border-muted',
          label: status
        };
    }
  };

  return (
    <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3 sm:mb-8'>
        <div className='rounded-full bg-primary/10 p-2'>
          <ShoppingBag className={iconVariants({ size: 'md', variant: 'primary' })} />
        </div>
        <h1 className='text-xl font-bold sm:text-2xl'>سجل المشتريات</h1>
      </div>

      {purchaseHistory.length === 0 ? (
        <div className='rounded-lg bg-muted/30 py-8 text-center sm:py-12'>
          <ShoppingBag className={iconVariants({ size: 'xl', variant: 'muted', className: 'mx-auto mb-4' })} />
          <h2 className='mb-2 text-lg font-medium sm:text-xl'>لا توجد مشتريات سابقة</h2>
          <p className='mb-6 text-sm text-muted-foreground sm:text-base'>
            لم تقم بشراء أي منتجات بعد. تصفح المتجر واستمتع بالتسوق!
          </p>
          <Link
            href='/'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base'
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className='mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4'>
            {/* Total Orders */}
            <div className='rounded-lg border bg-card p-3 shadow-sm sm:p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-primary/10 p-2'>
                  <ShoppingBag className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الطلبات</p>
                  <p className='text-lg font-bold text-primary sm:text-2xl'>{totalOrders}</p>
                </div>
              </div>
            </div>

            {/* Total Spent (Excluding Canceled) */}
            <div className='rounded-lg border bg-card p-3 shadow-sm sm:p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-success/10 p-2'>
                  <DollarSign className='h-4 w-4 text-success sm:h-5 sm:w-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الإنفاق</p>
                  <p className='text-lg font-bold text-success sm:text-2xl'>{totalSpentExcludingCanceled.toFixed(2)} ريال</p>
                </div>
              </div>
            </div>

            {/* Delivered Orders */}
            <div className='rounded-lg border bg-card p-3 shadow-sm sm:p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-success/10 p-2'>
                  <CheckCircle className='h-4 w-4 text-success sm:h-5 sm:w-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات المكتملة</p>
                  <p className='text-lg font-bold text-success sm:text-2xl'>{statusStats['DELIVERED']?.count || 0}</p>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className='rounded-lg border bg-card p-3 shadow-sm sm:p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-warning/10 p-2'>
                  <Clock className='h-4 w-4 text-warning sm:h-5 sm:w-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات المعلقة</p>
                  <p className='text-lg font-bold text-warning sm:text-2xl'>{statusStats['PENDING']?.count || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className='mb-6 sm:mb-8'>
            <h2 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg'>تفصيل الطلبات حسب الحالة</h2>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
              {Object.entries(statusStats).map(([status, stats]) => {
                const statusInfo = getStatusInfo(status);
                const IconComponent = statusInfo.icon;

                return (
                  <div key={status} className={`rounded-lg border p-3 ${statusInfo.bgColor} ${statusInfo.borderColor} sm:p-4`}>
                    <div className='flex items-center gap-3'>
                      <IconComponent className={`h-4 w-4 ${statusInfo.color} sm:h-5 sm:w-5`} />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium sm:text-base'>{statusInfo.label}</p>
                        <p className='text-xs text-muted-foreground sm:text-sm'>{stats.count} طلب</p>
                      </div>
                      <div className='text-right'>
                        <p className={`text-sm font-bold ${statusInfo.color} sm:text-base`}>{stats.total.toFixed(2)} ريال</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Tracking */}
          <div className='mb-6 rounded-lg border bg-gradient-to-r from-primary/5 to-secondary/5 p-4 sm:mb-8 sm:p-6'>
            <div className='flex items-center gap-3 mb-3 sm:mb-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <TrendingUp className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
              </div>
              <h2 className='text-base font-semibold text-primary sm:text-lg'>تتبع الميزانية</h2>
            </div>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
              <div className='text-center'>
                <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الإنفاق</p>
                <p className='text-lg font-bold text-primary sm:text-2xl'>{totalSpentExcludingCanceled.toFixed(2)} ريال</p>
              </div>
              <div className='text-center'>
                <p className='text-xs text-muted-foreground sm:text-sm'>متوسط الطلب</p>
                <p className='text-lg font-bold text-secondary sm:text-2xl'>
                  {totalOrders > 0 ? (totalSpentExcludingCanceled / totalOrders).toFixed(2) : '0.00'} ريال
                </p>
              </div>
              <div className='text-center'>
                <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات الملغية</p>
                <p className='text-lg font-bold text-destructive sm:text-2xl'>{statusStats['CANCELED']?.count || 0}</p>
              </div>
            </div>
          </div>

          {/* Rating Info */}
          <div className='mb-4 flex items-center gap-3 rounded-lg bg-muted/20 p-3 sm:mb-6 sm:p-4'>
            <Star className={iconVariants({ size: 'sm', variant: 'warning' })} />
            <p className='text-xs sm:text-sm'>يمكنك تقييم المنتجات التي اشتريتها لمساعدة المتسوقين الآخرين</p>
          </div>

          {/* Purchase History List */}
          <PurchaseHistoryList purchases={purchaseHistory} />
        </>
      )}
    </div>
  );
}
