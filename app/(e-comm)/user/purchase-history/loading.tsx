import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';
import { iconVariants } from '@/lib/utils';

export default function PurchaseHistoryLoading() {
    return (
        <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='mb-6 flex items-center gap-3 sm:mb-8'>
                <div className='rounded-full bg-primary/10 p-2'>
                    <ShoppingBag className={iconVariants({ size: 'md', variant: 'primary' })} />
                </div>
                <h1 className='text-xl font-bold sm:text-2xl'>سجل المشتريات</h1>
            </div>

            {/* Statistics Cards */}
            <div className='mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='rounded-lg border bg-card p-3 shadow-sm sm:p-4'>
                        <div className='flex items-center gap-3'>
                            <Skeleton className='h-10 w-10 rounded-full' />
                            <div className='flex-1'>
                                <Skeleton className='mb-1 h-4 w-20' />
                                <Skeleton className='h-8 w-16' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Breakdown */}
            <div className='mb-8'>
                <Skeleton className='mb-4 h-6 w-48' />
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='rounded-lg border p-4'>
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-5 w-5' />
                                <div className='flex-1'>
                                    <Skeleton className='mb-1 h-4 w-24' />
                                    <Skeleton className='h-3 w-16' />
                                </div>
                                <Skeleton className='h-5 w-20' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Budget Tracking */}
            <div className='mb-8 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
                <div className='flex items-center gap-3 mb-4'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <Skeleton className='h-6 w-32' />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='text-center'>
                            <Skeleton className='mx-auto mb-1 h-4 w-20' />
                            <Skeleton className='mx-auto h-8 w-24' />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating Info */}
            <div className='mb-6 flex items-center gap-3 rounded-lg bg-muted/20 p-4'>
                <Skeleton className='h-5 w-5' />
                <Skeleton className='h-4 flex-1' />
            </div>

            {/* Purchase History List */}
            <div className='space-y-6'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='rounded-lg border bg-card p-4'>
                        <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
                            <div className='flex items-center gap-4'>
                                <div>
                                    <Skeleton className='mb-1 h-5 w-32' />
                                    <Skeleton className='h-4 w-24' />
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Skeleton className='h-4 w-4' />
                                    <Skeleton className='h-5 w-16' />
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-6 w-20' />
                                <Skeleton className='h-4 w-16' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 