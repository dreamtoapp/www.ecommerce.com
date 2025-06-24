"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, DollarSign, Package, ShoppingCart, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../../../../lib/formatCurrency';

export default function MiniCartSummary() {
  const [showItems, setShowItems] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  const items = cart?.items || [];
  const totalPrice = items.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const totalWithTax = totalPrice * 1.15;
  const totalUniqueItems = items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-sm rounded-xl border border-gray-200 bg-card p-6 text-foreground shadow-lg dark:border-gray-700 dark:shadow-gray-800/50'
    >
      {/* Header */}
      <div className='mb-6 flex flex-row-reverse items-center justify-between'>
        <h2 className='flex items-center text-xl font-semibold'>
          ملخص الطلب
          <ShoppingCart className='mr-2 h-5 w-5 text-primary' />
        </h2>
        <div className='rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'>
          {totalUniqueItems} منتج
        </div>
      </div>

      {/* Summary Items */}
      <div className='space-y-4'>
        {/* Subtotal */}
        <div className='flex flex-row-reverse items-center justify-between'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Tag className='h-4 w-4' />
            <span>الإجمالي الفرعي</span>
          </div>
          <span className='font-medium'>{formatCurrency(totalPrice)}</span>
        </div>

        {/* Tax */}
        <div className='flex flex-row-reverse items-center justify-between'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <DollarSign className='h-4 w-4' />
            <span>الضريبة (15%)</span>
          </div>
          <span className='font-medium'>
            {formatCurrency(totalWithTax - totalPrice)}
          </span>
        </div>

        {/* Total */}
        <div className='flex flex-row-reverse items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex items-center gap-2'>
            <Package className='h-5 w-5 text-primary' />
            <span className='font-semibold'>الإجمالي النهائي</span>
          </div>
          <span className='text-xl font-bold text-primary'>
            {formatCurrency(totalWithTax)}
          </span>
        </div>

        {/* Cart Items Toggle */}
        <Button
          className='mt-4 h-10 w-full bg-primary/10 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20'
          size='sm'
          onClick={() => setShowItems((prev) => !prev)}
        >
          {showItems ? 'إخفاء العناصر' : 'عرض العناصر'}
          {showItems ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : (
            <ChevronDown className='ml-2 h-4 w-4' />
          )}
        </Button>

        {/* Cart Items */}
        {showItems && (
          <div className='mt-4 space-y-2'>
            {items.map((item: any) => (
              <div
                key={item.id}
                className='flex flex-row-reverse items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  <span>{item.product?.name}</span>
                  <span className='text-sm text-muted-foreground'>x{item.quantity}</span>
                </div>
                <span className='text-sm font-medium'>
                  {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Button */}
        <Button
          className='mt-6 h-12 w-full bg-primary text-lg font-semibold transition-all duration-200 hover:bg-primary/90'
          size='lg'
          onClick={() => router.push('/')}
        >
          متابعة التسوق
        </Button>
      </div>
    </motion.div>
  );
}
