import { redirect } from 'next/navigation';
import {
    ShoppingBag,
    TrendingUp,
    User,
    FileText
} from 'lucide-react';
import { iconVariants } from '@/lib/utils';

import { auth } from '@/auth';
import { getUserAccountData } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountOverview from './components/AccountOverview';
import OrderHistory from './components/OrderHistory';
import FinancialStatement from './components/FinancialStatement';

export const metadata = {
    title: 'حسابي | المتجر الإلكتروني',
    description: 'إدارة حسابك وعرض سجل الطلبات والتحليلات المالية',
};

export default async function AccountDashboardPage() {
    // Get the current user
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/auth/login?redirect=/user/account');
    }

    // Get the user's account data
    const userId = session.user.id;
    if (!userId) {
        redirect('/auth/login?redirect=/user/account');
    }

    const accountData = await getUserAccountData(userId);

    if (!accountData) {
        return (
            <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
                <div className='rounded-lg bg-muted/30 py-8 text-center sm:py-12'>
                    <User className={iconVariants({ size: 'xl', variant: 'muted', className: 'mx-auto mb-4' })} />
                    <h2 className='mb-2 text-lg font-medium sm:text-xl'>لا توجد بيانات متاحة</h2>
                    <p className='text-sm text-muted-foreground sm:text-base'>
                        لم يتم العثور على بيانات الحساب
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='mb-6 flex items-center gap-3 sm:mb-8'>
                <div className='rounded-full bg-primary/10 p-2'>
                    <User className={iconVariants({ size: 'md', variant: 'primary' })} />
                </div>
                <h1 className='text-xl font-bold sm:text-2xl'>حسابي</h1>
            </div>

            {/* User Info Card */}
            <Card className='mb-6 sm:mb-8'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>معلومات الحساب</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <div>
                            <p className='text-sm text-muted-foreground'>الاسم</p>
                            <p className='font-medium'>{accountData.user.name || 'غير محدد'}</p>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>رقم الهاتف</p>
                            <p className='font-medium'>{accountData.user.phone || 'غير محدد'}</p>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>البريد الإلكتروني</p>
                            <p className='font-medium'>{accountData.user.email || 'غير محدد'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue='overview' className='space-y-6'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='overview' className='flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4' />
                        <span className='hidden sm:inline'>نظرة عامة</span>
                        <span className='sm:hidden'>عامة</span>
                    </TabsTrigger>
                    <TabsTrigger value='orders' className='flex items-center gap-2'>
                        <ShoppingBag className='h-4 w-4' />
                        <span className='hidden sm:inline'>سجل الطلبات</span>
                        <span className='sm:hidden'>الطلبات</span>
                    </TabsTrigger>
                    <TabsTrigger value='statement' className='flex items-center gap-2'>
                        <FileText className='h-4 w-4' />
                        <span className='hidden sm:inline'>كشف الحساب</span>
                        <span className='sm:hidden'>الحساب</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='space-y-6'>
                    <AccountOverview accountData={accountData} />
                </TabsContent>

                <TabsContent value='orders' className='space-y-6'>
                    <OrderHistory orders={accountData.orders} />
                </TabsContent>

                <TabsContent value='statement' className='space-y-6'>
                    <FinancialStatement accountData={accountData} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 