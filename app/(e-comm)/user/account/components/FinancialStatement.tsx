'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { AccountData } from '../actions';
import { getStatusInfo } from '../helpers';

interface FinancialStatementProps {
    accountData: AccountData;
}

export default function FinancialStatement({ accountData }: FinancialStatementProps) {
    const { orders, statistics } = accountData;
    const [exporting, setExporting] = useState(false);

    // Export as CSV
    const handleExportCSV = () => {
        setExporting(true);
        const header = ['رقم الطلب', 'التاريخ', 'المبلغ', 'الحالة'];
        const rows = orders.map(order => [
            order.orderNumber,
            order.createdAt.toLocaleDateString('ar-EG'),
            order.amount.toFixed(2),
            getStatusInfo(order.status).label
        ]);
        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'financial-statement.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExporting(false);
    };



    return (
        <Card>
            <CardHeader className='pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <CardTitle className='text-lg sm:text-xl'>كشف الحساب المالي</CardTitle>
                <div className='flex gap-2'>
                    <Button onClick={handleExportCSV} disabled={exporting} className='btn-view-outline'>
                        <Download className='h-4 w-4 mr-2' />
                        تصدير CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='overflow-x-auto'>
                    <table className='w-full print:text-xs'>
                        <thead>
                            <tr className='border-b'>
                                <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>رقم الطلب</th>
                                <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>التاريخ</th>
                                <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>المبلغ</th>
                                <th className='px-3 py-3 text-right text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm'>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className='px-3 py-8 text-center text-sm text-muted-foreground sm:px-4'>
                                        لا توجد طلبات متاحة
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => {
                                    const statusInfo = getStatusInfo(order.status);
                                    return (
                                        <tr key={order.id} className='border-b transition-colors hover:bg-muted/50'>
                                            <td className='px-3 py-3 text-sm font-medium sm:px-4 sm:text-base'>
                                                {order.orderNumber}
                                            </td>
                                            <td className='px-3 py-3 text-sm text-muted-foreground sm:px-4 sm:text-base'>
                                                {order.createdAt.toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className='px-3 py-3 text-sm font-medium text-success sm:px-4 sm:text-base'>
                                                {order.amount.toFixed(2)} ريال
                                            </td>
                                            <td className='px-3 py-3 sm:px-4'>
                                                <span className={`rounded-full px-2 py-1 text-xs sm:text-sm ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Analytics summary */}
                <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
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
                        <p className='text-xs text-muted-foreground sm:text-sm'>عدد الطلبات</p>
                        <p className='text-lg font-bold text-primary sm:text-2xl'>
                            {statistics.totalOrders}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 