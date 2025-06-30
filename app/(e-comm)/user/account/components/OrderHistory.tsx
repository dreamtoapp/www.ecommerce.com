import { Star } from 'lucide-react';
import { getStatusInfo } from '../helpers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { AccountData } from '../actions';

interface OrderHistoryProps {
    orders: AccountData['orders'];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle className='text-lg sm:text-xl'>سجل الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className='py-8 text-center text-muted-foreground'>لا توجد طلبات بعد</div>
                ) : (
                    <Accordion type='single' collapsible className='w-full'>
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <AccordionItem key={order.id} value={order.id}>
                                    <AccordionTrigger className='rounded-lg bg-card px-3 py-3 hover:bg-card/80 sm:px-4'>
                                        <div className='flex w-full flex-col justify-between gap-2 text-right sm:flex-row sm:items-center'>
                                            <div className='flex items-center gap-2 sm:gap-4'>
                                                <span className='block text-sm font-medium sm:text-base'>طلب #{order.orderNumber}</span>
                                                <span className='block text-xs text-muted-foreground sm:text-sm'>
                                                    {order.createdAt.toLocaleDateString('ar-EG')}
                                                </span>
                                                <Badge variant='outline' className={statusInfo.color + ' text-xs sm:text-sm'}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>
                                            <div className='flex items-center gap-2 sm:gap-4'>
                                                <span className='text-xs font-semibold text-success sm:text-base'>
                                                    {order.amount.toFixed(2)} ريال
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='px-3 pt-3 sm:px-4 sm:pt-4'>
                                        {/*
                                        <div className='flex justify-end mb-2'>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant='outline'
                                                    size='icon'
                                                    className='
                                                      border-feature-commerce
                                                      text-feature-commerce
                                                      bg-feature-commerce-soft
                                                      hover:shadow-lg
                                                      card-hover-effect
                                                      transition-all
                                                      duration-200
                                                      group
                                                      relative
                                                    '
                                                    aria-label='إعادة الطلب'
                                                  >
                                                    <Repeat className='h-5 w-5 icon-enhanced group-hover:rotate-180 transition-transform duration-300' />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side='top' className='text-xs'>
                                                  إعادة الطلب
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        */}
                                        <div className='space-y-3 sm:space-y-4'>
                                            {order.items.map((item) => (
                                                <div key={item.id} className='flex flex-col gap-3 pb-3 sm:flex-row sm:pb-4'>
                                                    <div className="relative h-24 w-24 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-feature-products bg-feature-products-soft shadow-md">
                                                        <Image
                                                            src={item.productImageUrl || '/fallback/product-fallback.avif'}
                                                            alt={item.productName}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <h3 className='text-sm font-medium sm:text-base'>{item.productName}</h3>
                                                        <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
                                                            <span>الكمية: {item.quantity}</span>
                                                            <span>•</span>
                                                            <span>السعر: {item.price.toFixed(2)} ريال</span>
                                                        </div>
                                                        <div className='mt-3 flex items-center gap-2'>
                                                            {order.status === 'DELIVERED' && (
                                                                <Button
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='border-warning/20 text-warning hover:bg-warning/10 hover:text-warning'
                                                                >
                                                                    <Star className='h-4 w-4 mr-1' />
                                                                    <span className='text-xs sm:text-sm'>قيّم المنتج</span>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='mt-3 rounded-lg bg-muted/30 p-3 sm:mt-4'>
                                                <div className='flex items-center justify-between'>
                                                    <span className='text-sm font-medium sm:text-base'>إجمالي الطلب:</span>
                                                    <span className='text-sm font-bold text-success sm:text-base'>{order.amount.toFixed(2)} ريال</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
} 