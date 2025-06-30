import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FileText, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { iconVariants } from '@/lib/utils';

import { auth } from '@/auth';
import { getUserStatement } from './action/action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'كشف الحساب | المتجر الإلكتروني',
  description: 'عرض تفاصيل حسابك وإحصائيات الطلبات',
};

interface Order {
  id: string;
  status: string;
  orderNumber: string;
  createdAt: Date;
  amount: number;
}

type UserWithCustomerOrders = {
  id: string;
  phone: string;
  name: string;
  email: string;
  customerOrders: Order[];
};

type OrderStatus = 'delivered' | 'pending' | 'in_transit' | 'canceled' | 'assigned';

export default async function UserStatementPage() {
  // Get the current user
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/user/statement');
  }

  // Get the user's statement
  const userId = session.user.id;
  if (!userId) {
    redirect('/auth/login?redirect=/user/statement');
  }

  const user = await getUserStatement(userId) as UserWithCustomerOrders;

  if (!user) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='rounded-lg bg-muted/30 py-8 text-center sm:py-12'>
          <FileText className={iconVariants({ size: 'xl', variant: 'muted', className: 'mx-auto mb-4' })} />
          <h2 className='mb-2 text-lg font-medium sm:text-xl'>لا توجد بيانات متاحة</h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            لم يتم العثور على بيانات الحساب
          </p>
        </div>
      </div>
    );
  }

  const totalSpent = user.customerOrders.reduce((sum: number, order: Order) => sum + order.amount, 0);
  const orderCounts = user.customerOrders.reduce(
    (acc: Record<OrderStatus, number>, order: Order) => {
      const status = order.status.toLowerCase() as OrderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          label: 'تم التوصيل',
          color: 'bg-success/10 text-success border-success/20'
        };
      case 'pending':
        return {
          label: 'قيد الانتظار',
          color: 'bg-warning/10 text-warning border-warning/20'
        };
      case 'in_transit':
        return {
          label: 'في الطريق',
          color: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'assigned':
        return {
          label: 'تم التعيين',
          color: 'bg-secondary/10 text-secondary border-secondary/20'
        };
      case 'canceled':
        return {
          label: 'ملغي',
          color: 'bg-destructive/10 text-destructive border-destructive/20'
        };
      default:
        return {
          label: status,
          color: 'bg-muted/20 text-muted-foreground border-muted'
        };
    }
  };

  return (
    <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3 sm:mb-8'>
        <div className='rounded-full bg-primary/10 p-2'>
          <FileText className={iconVariants({ size: 'md', variant: 'primary' })} />
        </div>
        <h1 className='text-xl font-bold sm:text-2xl'>كشف الحساب</h1>
      </div>

      {/* User Info */}
      <Card className='mb-6 sm:mb-8'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg sm:text-xl'>معلومات المستخدم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <p className='text-sm text-muted-foreground'>الاسم</p>
              <p className='font-medium'>{user.name || 'غير محدد'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>رقم الهاتف</p>
              <p className='font-medium'>{user.phone || 'غير محدد'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>البريد الإلكتروني</p>
              <p className='font-medium'>{user.email || 'غير محدد'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-success/10 p-2'>
                <DollarSign className='h-4 w-4 text-success sm:h-5 sm:w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الإنفاق</p>
                <p className='text-lg font-bold text-success sm:text-2xl'>{totalSpent.toFixed(2)} ريال</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-primary/10 p-2'>
                <ShoppingBag className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs text-muted-foreground sm:text-sm'>عدد الطلبات</p>
                <p className='text-lg font-bold text-primary sm:text-2xl'>{user.customerOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-secondary/10 p-2'>
                <TrendingUp className='h-4 w-4 text-secondary sm:h-5 sm:w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs text-muted-foreground sm:text-sm'>متوسط الطلب</p>
                <p className='text-lg font-bold text-secondary sm:text-2xl'>
                  {user.customerOrders.length > 0 ? (totalSpent / user.customerOrders.length).toFixed(2) : '0.00'} ريال
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-warning/10 p-2'>
                <FileText className='h-4 w-4 text-warning sm:h-5 sm:w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات المعلقة</p>
                <p className='text-lg font-bold text-warning sm:text-2xl'>{orderCounts['pending'] || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <Card className='mb-6 sm:mb-8'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg sm:text-xl'>تفصيل الطلبات حسب الحالة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
            {Object.entries(orderCounts).map(([status, count]) => {
              const statusInfo = getStatusInfo(status);
              return (
                <div key={status} className='flex items-center justify-between rounded-lg border p-3 sm:p-4'>
                  <span className='text-sm font-medium sm:text-base'>{statusInfo.label}</span>
                  <Badge variant='outline' className={statusInfo.color}>
                    {count}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg sm:text-xl'>تفاصيل الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>رقم الطلب</th>
                  <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>التاريخ</th>
                  <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>المبلغ</th>
                  <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {user.customerOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='px-3 py-8 text-center text-sm text-muted-foreground sm:px-4'>
                      لا توجد طلبات متاحة
                    </td>
                  </tr>
                ) : (
                  user.customerOrders.map((order: Order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr key={order.id} className='border-b transition-colors hover:bg-muted/50'>
                        <td className='px-3 py-3 text-sm font-medium sm:px-4 sm:text-base'>
                          {order.orderNumber}
                        </td>
                        <td className='px-3 py-3 text-sm text-muted-foreground sm:px-4 sm:text-base'>
                          {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: ar })}
                        </td>
                        <td className='px-3 py-3 text-sm font-medium text-success sm:px-4 sm:text-base'>
                          {order.amount.toFixed(2)} ريال
                        </td>
                        <td className='px-3 py-3 sm:px-4'>
                          <Badge variant='outline' className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
