import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserStatementLoading() {
    return (
        <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='mb-6 flex items-center gap-3 sm:mb-8'>
                <div className='rounded-full bg-primary/10 p-2'>
                    <FileText className={iconVariants({ size: 'md', variant: 'primary' })} />
                </div>
                <h1 className='text-xl font-bold sm:text-2xl'>كشف الحساب</h1>
            </div>

            {/* User Info Card */}
            <Card className='mb-6 sm:mb-8'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>معلومات المستخدم</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className='mb-1 h-3 w-16 sm:h-4 sm:w-20' />
                                <Skeleton className='h-4 w-24 sm:h-5 sm:w-32' />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className='p-4 sm:p-6'>
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-8 w-8 rounded-full sm:h-10 sm:w-10' />
                                <div className='flex-1 min-w-0'>
                                    <Skeleton className='mb-1 h-3 w-16 sm:h-4 sm:w-20' />
                                    <Skeleton className='h-6 w-20 sm:h-8 sm:w-24' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Order Status Breakdown */}
            <Card className='mb-6 sm:mb-8'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>تفصيل الطلبات حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className='flex items-center justify-between rounded-lg border p-3 sm:p-4'>
                                <Skeleton className='h-4 w-20 sm:h-5 sm:w-24' />
                                <Skeleton className='h-6 w-8 sm:h-7 sm:w-10' />
                            </div>
                        ))}
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
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <th key={i} className='px-3 py-3 text-right sm:px-4'>
                                            <Skeleton className='mx-auto h-3 w-16 sm:h-4 sm:w-20' />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className='border-b'>
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <td key={j} className='px-3 py-3 sm:px-4'>
                                                <Skeleton className='h-4 w-20 sm:h-5 sm:w-24' />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 