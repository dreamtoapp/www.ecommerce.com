import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Edit3, BarChart2 } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import CardImage from '../../../../components/CardImage';
import ProductDeleteButton from './ProductDeleteButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    size?: string | null;
    details?: string | null;
    imageUrl?: string | null;
    published: boolean;
    outOfStock?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full rounded-xl border bg-card shadow-lg transition-shadow hover:shadow-2xl">
      <CardContent className="flex flex-col items-center p-0">
        <div className="w-full h-40 flex items-center justify-center overflow-hidden rounded-t-xl bg-muted">
          <CardImage
            imageUrl={product.imageUrl || undefined}
            altText={`${product.name} image`}
            aspectRatio="square"
            fallbackSrc="/default-product.jpg"
            placeholderText="لا توجد صورة متاحة"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full p-4 flex flex-col gap-1">
          <div className="font-bold text-lg truncate" title={product.name}>{product.name}</div>
          <div className="text-primary font-semibold">{product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })}</div>
          <div className="text-sm text-muted-foreground">المقاس: {product.size || '-'}</div>
          <div className="text-xs text-muted-foreground">{product.details || 'لا توجد تفاصيل'}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={product.published ? 'default' : 'secondary'} className="w-fit">
              {product.published ? 'منشور' : 'غير منشور'}
            </Badge>
            {typeof product.outOfStock !== 'undefined' && (
              <Badge
                className={`w-fit ${product.outOfStock ? 'bg-destructive text-destructive-foreground' : 'bg-emerald-600 text-white'}`}
              >
                {product.outOfStock ? 'غير متوفر' : 'متوفر'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2 border-t flex justify-end gap-2 flex-wrap bg-card">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 w-full justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/management-products/view/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                    title="عرض التفاصيل"
                  >
                    <Eye className={iconVariants({ size: 'xs' })} />
                    <span className="sr-only">عرض التفاصيل</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>عرض التفاصيل</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/management-products/analytics/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                    title="تحليلات"
                  >
                    <BarChart2 className={iconVariants({ size: 'xs' })} />
                    <span className="sr-only">تحليلات</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>تحليلات</TooltipContent>
              </Tooltip>
            </div>
            <div className="h-6 w-px bg-muted-foreground/30 mx-2" />
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/products/edit/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                    title="تعديل"
                  >
                    <Edit3 className={iconVariants({ size: 'xs' })} />
                    <span className="sr-only">تعديل</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>تعديل</TooltipContent>
              </Tooltip>
              <ProductDeleteButton productId={product.id} />
            </div>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
