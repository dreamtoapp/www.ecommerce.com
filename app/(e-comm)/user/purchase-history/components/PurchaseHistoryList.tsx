'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toast } from 'sonner';
import { Star, DollarSign } from 'lucide-react';
import { iconVariants } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { PurchaseHistoryItem } from '../actions';

// Dynamically import the RatingModal
const RatingModal = dynamic(() => import('@/components/rating/RatingModal'), {
  loading: () => <p>جاري التحميل...</p>,
  ssr: false,
});

interface PurchaseHistoryListProps {
  purchases: PurchaseHistoryItem[];
}

export default function PurchaseHistoryList({ purchases }: PurchaseHistoryListProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    slug?: string;
    imageUrl: string;
  } | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRateProduct = (product: {
    id: string;
    name: string;
    slug?: string;
    imageUrl: string;
  }) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (values: { rating: number; comment: string }) => {
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      // Import the submitProductRating function dynamically to avoid "use server" errors
      const { submitProductRating } = await import('@/app/(e-comm)/product/actions/rating');

      // Call the server action to submit the rating
      const result = await submitProductRating({
        productId: selectedProduct.id,
        rating: values.rating,
        comment: values.comment,
      });

      if (result.success) {
        toast.success(result.message || 'تم إضافة التقييم بنجاح');
        setIsRatingModalOpen(false);

        // Refresh the page to show updated ratings
        window.location.reload();
      } else {
        toast.error(result.message || 'حدث خطأ أثناء إرسال التقييم');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-success/10 text-success border-success/20';
      case 'PENDING':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'IN_TRANSIT':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'ASSIGNED':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'CANCELED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted';
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'تم التوصيل';
      case 'PENDING':
        return 'قيد الانتظار';
      case 'IN_TRANSIT':
        return 'في الطريق';
      case 'ASSIGNED':
        return 'تم التعيين';
      case 'CANCELED':
        return 'ملغي';
      default:
        return status;
    }
  };

  // Calculate order total
  const getOrderTotal = (products: PurchaseHistoryItem['products']) => {
    return products.reduce((sum, product) => sum + product.price, 0);
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <Accordion type='single' collapsible className='w-full'>
        {purchases.map((purchase) => {
          const orderTotal = getOrderTotal(purchase.products);

          return (
            <AccordionItem key={purchase.orderId} value={purchase.orderId}>
              <AccordionTrigger className='rounded-lg bg-card px-3 py-3 hover:bg-card/80 sm:px-4'>
                <div className='flex w-full flex-col justify-between gap-2 text-right sm:flex-row sm:items-center'>
                  <div className='flex items-center gap-2 sm:gap-4'>
                    <div className='flex-1 min-w-0'>
                      <span className='block text-sm font-medium sm:text-base'>طلب #{purchase.orderNumber}</span>
                      <span className='block text-xs text-muted-foreground sm:text-sm'>
                        {format(new Date(purchase.orderDate), 'd MMMM yyyy', { locale: ar })}
                      </span>
                    </div>
                    {/* Order Total */}
                    <div className='flex items-center gap-1 text-success'>
                      <DollarSign className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span className='text-sm font-semibold sm:text-base'>{orderTotal.toFixed(2)} ريال</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <Badge variant='outline' className={cn('mr-auto text-xs sm:text-sm', getStatusColor(purchase.status))}>
                      {formatStatus(purchase.status)}
                    </Badge>
                    <span className='text-xs text-muted-foreground sm:text-sm'>
                      {purchase.products.length} منتج
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className='px-3 pt-3 sm:px-4 sm:pt-4'>
                <div className='space-y-3 sm:space-y-4'>
                  {purchase.products.map((product) => (
                    <div key={product.id} className='flex flex-col gap-3 pb-3 sm:flex-row sm:pb-4'>
                      <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-20'>
                        <Image
                          src={product.imageUrl || '/fallback/product-fallback.avif'}
                          alt={product.name}
                          fill
                          className='object-cover'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium sm:text-base'>{product.name}</h3>
                        <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
                          <span>الكمية: {product.quantity}</span>
                          <span>•</span>
                          <span>السعر: {product.price.toFixed(2)} ريال</span>
                        </div>

                        <div className='mt-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-warning/20 text-warning hover:bg-warning/10 hover:text-warning'
                            onClick={() => handleRateProduct(product)}
                          >
                            <Star className={iconVariants({ size: 'xs', variant: 'warning', className: 'mr-1' })} />
                            <span className='text-xs sm:text-sm'>{product.hasRated ? 'تعديل التقييم' : 'قيّم المنتج'}</span>
                          </Button>

                          {/* Product Total */}
                          <div className='text-xs font-medium text-success sm:text-sm'>
                            {(product.price * product.quantity).toFixed(2)} ريال
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Order Summary */}
                  <div className='mt-3 rounded-lg bg-muted/30 p-3 sm:mt-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium sm:text-base'>إجمالي الطلب:</span>
                      <span className='text-sm font-bold text-success sm:text-base'>{orderTotal.toFixed(2)} ريال</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {selectedProduct && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleSubmitRating}
          productName={selectedProduct.name}
          productImage={selectedProduct.imageUrl}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
