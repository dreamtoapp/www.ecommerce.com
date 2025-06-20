
'use client';

import { useState } from 'react';

import {
  Filter,
  Map,
  MapPin,
  PhoneCall,
  Search,
  Truck,
} from 'lucide-react';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';

interface InWayOrdersViewProps {
  orders: Order[];
  inWayCount: number;
  currentPage: number;
  pageSize: number;
  selectedDriverId: string;
}

export default function InWayOrdersView({
  orders,

}: InWayOrdersViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [driverSort, setDriverSort] = useState<'asc' | 'desc'>('asc');

  // Sort orders by driver name
  const sortedOrders = [...orders].sort((a, b) => {
    const nameA = a.driver?.name || '';

    const nameB = b.driver?.name || '';

    if (driverSort === 'asc') {
      return nameA.localeCompare(nameB, 'ar');
    } else {
      return nameB.localeCompare(nameA, 'ar');
    }
  });



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-input gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Filter className="h-4 w-4 ml-2 " />
              قائمة
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4 ml-2 " />
              خريطة
            </Button>
          </div>
        </div>
      </div>

      {/* Orders View (List or Map) */}
      {orders.length > 0 ? (
        viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => setDriverSort(driverSort === 'asc' ? 'desc' : 'asc')}>
                      <span className="flex items-center gap-1">
                        السائق
                        <span>{driverSort === 'asc' ? '▲' : '▼'}</span>
                      </span>
                    </TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => {

                    return (
                      <TableRow key={order.id} className="hover:bg-secondary align-middle">
                        <TableCell className="font-medium align-middle">
                          <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary hover:underline">
                            {order.orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell className="align-middle">{order.customer.name || 'غير معروف'}</TableCell>
                        <TableCell className="align-middle">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-feature-commerce-soft border border-feature-commerce">
                              {order.isTripStart ? (
                                <Truck className="h-4 w-4 text-feature-commerce" />
                              ) : (
                                <MapPin className="h-4 w-4 text-amber-600 animate-pulse" />
                              )}
                            </div>
                            <span>{order.driver?.name || 'لم يتم تعيين'}</span>
                            {!order.isTripStart && (
                              <span className="text-xs text-amber-700 font-semibold ml-2">لم يبدأ الرحلة</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold align-middle">{order.amount} ر.س</TableCell>
                        <TableCell className="align-middle">
                          <div className="flex items-center gap-2">

                            {order.driverId ? (
                              <a
                                href={`tel:${order.driverId}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                title={order.driverId}
                                style={{ direction: 'ltr' }}
                              >
                                <PhoneCall className="h-4 w-4" />
                                <span className="sr-only">{order.driverId}</span>
                              </a>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground"
                                title="لا يوجد رقم سائق"
                                disabled
                              >
                                <PhoneCall className="h-4 w-4" />
                              </Button>
                            )}
                            <Link
                              href={`/dashboard/track/${order.id}`}
                              className={cn(
                                "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors",
                                "text-feature-commerce hover:bg-feature-commerce-soft hover:text-feature-commerce"
                              )}
                              title="تتبع الطلب"
                            >
                              <MapPin className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/dashboard/show-invoice/${order.id}`}
                              className={cn(
                                "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors",
                                "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                              title="عرض التفاصيل"
                            >
                              <Search className="h-4 w-4" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-[500px]">
            <CardContent className="p-4 h-full">
              <div className="flex h-full items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto text-feature-commerce" />
                  <h3 className="mt-2 text-lg font-medium text-foreground">خريطة تتبع الطلبات</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                    هنا ستظهر خريطة تفاعلية تعرض مواقع جميع الطلبات قيد التوصيل في الوقت الفعلي.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Truck className="h-16 w-16 text-feature-commerce" />
            <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد طلبات في الطريق</h3>
            <p className="text-sm text-muted-foreground">
              لا توجد طلبات قيد التوصيل حالياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
