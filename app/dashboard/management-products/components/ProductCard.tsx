import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Edit3, BarChart2, Package, DollarSign, Info, CheckCircle, XCircle } from 'lucide-react';
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
    <Card className="group flex flex-col h-full min-h-[380px] w-full max-w-[360px] rounded-xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 card-hover-effect card-border-glow bg-gradient-to-b from-card to-card/80">
      {/* Product Image Section */}
      <CardContent className="p-0">
        <div className="relative w-full h-44 overflow-hidden rounded-t-xl bg-gradient-to-br from-muted/50 to-muted">
          <CardImage
            imageUrl={product.imageUrl || undefined}
            altText={`${product.name} image`}
            aspectRatio="square"
            fallbackSrc="/fallback/product-fallback.avif"
            placeholderText="لا توجد صورة متاحة"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Status Overlay Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge
              variant={product.published ? 'default' : 'secondary'}
              className={`shadow-md transition-all duration-200 ${product.published
                ? 'bg-feature-products text-white border-feature-products'
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
                }`}
            >
              {product.published ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  منشور
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  غير منشور
                </>
              )}
            </Badge>

            {typeof product.outOfStock !== 'undefined' && (
              <Badge
                className={`shadow-md transition-all duration-200 ${product.outOfStock
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-emerald-600 text-white border-emerald-600'
                  }`}
              >
                {product.outOfStock ? (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    غير متوفر
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    متوفر
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="p-4 space-y-3 flex-1">
          {/* Product Name */}
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-feature-products mt-1 flex-shrink-0 icon-enhanced" />
            <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-feature-products transition-colors duration-200 line-clamp-2" title={product.name}>
              {product.name}
            </h3>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-feature-commerce icon-enhanced" />
            <span className="text-lg font-bold text-feature-commerce">
              {product.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
            </span>
          </div>

          {/* Product Details */}
          <div className="space-y-2 text-xs">
            {product.size && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">المقاس: {product.size}</span>
              </div>
            )}

            {product.details && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {product.details}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Action Buttons Footer */}
      <CardFooter className="mt-auto p-3 border-t border-border/30 bg-gradient-to-r from-card/80 to-card/60 rounded-b-xl">
        <TooltipProvider>
          <div className="flex items-center justify-between w-full gap-2">
            {/* View Actions */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/management-products/view/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' btn-view-outline p-2 h-8'}
                  >
                    <Eye className="h-4 w-4 icon-enhanced" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>عرض التفاصيل</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/management-products/analytics/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' text-feature-analytics hover:bg-feature-analytics/10 border-feature-analytics/20 hover:border-feature-analytics/40 p-2 h-8'}
                  >
                    <BarChart2 className="h-4 w-4 icon-enhanced" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>تحليلات المنتج</TooltipContent>
              </Tooltip>
            </div>

            {/* Edit Actions */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/management-products/edit/${product.id}`}
                    className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' btn-edit p-2 h-8'}
                  >
                    <Edit3 className="h-4 w-4 icon-enhanced" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>تعديل المنتج</TooltipContent>
              </Tooltip>

              <ProductDeleteButton productId={product.id} />
            </div>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
