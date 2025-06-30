import { ShoppingBag, DollarSign, TrendingUp, Clock, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccountData } from '../actions';
import { getStatusInfo } from '../helpers';
import Link from 'next/link';

interface AccountOverviewProps {
    accountData: AccountData;
}

export default function AccountOverview({ accountData }: AccountOverviewProps) {
    const { statistics } = accountData;

    return (
        <div className='space-y-6'>
            {/* Key Statistics Cards */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
                {/* Total Orders */}
                <Card>
                    <CardContent className='p-4 sm:p-6'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-full bg-primary/10 p-2'>
                                <ShoppingBag className='h-4 w-4 text-primary sm:h-5 sm:w-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الطلبات</p>
                                <p className='text-lg font-bold text-primary sm:text-2xl'>{statistics.totalOrders}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Spent */}
                <Card>
                    <CardContent className='p-4 sm:p-6'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-full bg-success/10 p-2'>
                                <DollarSign className='h-4 w-4 text-success sm:h-5 sm:w-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الإنفاق</p>
                                <p className='text-lg font-bold text-success sm:text-2xl'>
                                    {statistics.totalSpentExcludingCanceled.toFixed(2)} ريال
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Order Value */}
                <Card>
                    <CardContent className='p-4 sm:p-6'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-full bg-secondary/10 p-2'>
                                <TrendingUp className='h-4 w-4 text-secondary sm:h-5 sm:w-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-muted-foreground sm:text-sm'>متوسط الطلب</p>
                                <p className='text-lg font-bold text-secondary sm:text-2xl'>
                                    {statistics.averageOrderValue.toFixed(2)} ريال
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                    <CardContent className='p-4 sm:p-6'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-full bg-warning/10 p-2'>
                                <Clock className='h-4 w-4 text-warning sm:h-5 sm:w-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات المعلقة</p>
                                <p className='text-lg font-bold text-warning sm:text-2xl'>
                                    {statistics.statusBreakdown['PENDING']?.count || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown */}
            <Card>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>تفصيل الطلبات حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
                        {Object.entries(statistics.statusBreakdown).map(([status, stats]) => {
                            const statusInfo = getStatusInfo(status);
                            return (
                                <div key={status} className='flex items-center justify-between rounded-lg border p-3 sm:p-4'>
                                    <div className='flex items-center gap-2'>
                                        <div className={`rounded-full p-1 ${statusInfo.bgColor}`}>
                                            <CheckCircle className={`h-3 w-3 ${statusInfo.color} sm:h-4 sm:w-4`} />
                                        </div>
                                        <span className='text-sm font-medium sm:text-base'>{statusInfo.label}</span>
                                    </div>
                                    <div className='text-right'>
                                        <Badge variant='outline' className={statusInfo.color}>
                                            {stats.count}
                                        </Badge>
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            {stats.total.toFixed(2)} ريال
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Budget Tracking */}
            <Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>تتبع الميزانية</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6'>
                        <div className='text-center'>
                            <p className='text-xs text-muted-foreground sm:text-sm'>إجمالي الإنفاق</p>
                            <p className='text-lg font-bold text-primary sm:text-2xl'>
                                {statistics.totalSpentExcludingCanceled.toFixed(2)} ريال
                            </p>
                        </div>
                        <div className='text-center'>
                            <p className='text-xs text-muted-foreground sm:text-sm'>متوسط الطلب</p>
                            <p className='text-lg font-bold text-secondary sm:text-2xl'>
                                {statistics.averageOrderValue.toFixed(2)} ريال
                            </p>
                        </div>
                        <div className='text-center'>
                            <p className='text-xs text-muted-foreground sm:text-sm'>الطلبات الملغية</p>
                            <p className='text-lg font-bold text-destructive sm:text-2xl'>
                                {statistics.statusBreakdown['CANCELED']?.count || 0}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
                        <Link href='/' className='flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary'>
                            <div className='rounded-full bg-primary/10 p-2'>
                                <ShoppingBag className='h-4 w-4 text-primary' />
                            </div>
                            <div>
                                <p className='font-medium'>تصفح المنتجات</p>
                                <p className='text-xs text-muted-foreground'>اكتشف منتجات جديدة</p>
                            </div>
                        </Link>
                        <Link href='/user/ratings' className='flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-warning'>
                            <div className='rounded-full bg-warning/10 p-2'>
                                <Star className='h-4 w-4 text-warning' />
                            </div>
                            <div>
                                <p className='font-medium'>تقييم المنتجات</p>
                                <p className='text-xs text-muted-foreground'>قيّم مشترياتك السابقة</p>
                            </div>
                        </Link>
                        <Link href='/user/order-tracking' className='flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-success'>
                            <div className='rounded-full bg-success/10 p-2'>
                                <CheckCircle className='h-4 w-4 text-success' />
                            </div>
                            <div>
                                <p className='font-medium'>متابعة الطلبات</p>
                                <p className='text-xs text-muted-foreground'>تحقق من حالة طلباتك</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 