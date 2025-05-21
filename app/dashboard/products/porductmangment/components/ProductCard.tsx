'use client';


import { Eye } from 'lucide-react';

import CardImage from '@/components/CardImage';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { iconVariants } from '@/lib/utils';
import { Product } from '@/types/databaseTypes';;

// نصوص واجهة المستخدم بالعربي
const UI_TEXT = {
  viewDetails: 'عرض التفاصيل',
  noImage: 'لا توجد صورة',
  price: 'السعر',
  size: 'الحجم',
  details: 'التفاصيل',
  inStock: 'متوفر',
  outOfStock: 'غير متوفر',
  lowStock: 'كمية محدودة',
  lastUpdated: 'آخر تحديث',
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* رأس البطاقة */}
      <CardHeader className="space-y-2 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <CardTitle className="line-clamp-2 text-xl font-bold text-primary">
          {product.name}
        </CardTitle>

        {/* حالة المخزون والنشر */}
        <div className="flex items-center justify-between">
          {typeof product.outOfStock === 'boolean' && (
            <Badge variant={product.outOfStock ? 'destructive' : 'default'} className="w-fit">
              {product.outOfStock ? UI_TEXT.outOfStock : UI_TEXT.inStock}
            </Badge>
          )}
          <Badge variant={product.published ? 'default' : 'destructive'} className="w-fit">
            {product.published ? 'منشور' : 'غير منشور'}
          </Badge>
        </div>
      </CardHeader>

      {/* محتوى البطاقة */}
      <CardContent className="flex-grow space-y-6 p-6">
        {/* صورة المنتج */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
          <CardImage
            imageUrl={product.imageUrl}
            altText={`${product.name} image`}
            aspectRatio="square"
            fallbackSrc="/default-logo.png"
            placeholderText={UI_TEXT.noImage}
            priority={true}
            className="h-full w-full object-cover"
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <strong className="font-semibold text-primary">{UI_TEXT.price}:</strong>
            <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
          </div>
          {product.size && (
            <div className="flex items-center gap-2">
              <strong className="font-semibold text-primary">{UI_TEXT.size}:</strong>
              <span className="text-foreground">{product.size}</span>
            </div>
          )}
          {product.details && (
            <div className="flex flex-col gap-2">
              <strong className="font-semibold text-primary">{UI_TEXT.details}:</strong>
              <p className="line-clamp-3 text-muted-foreground">{product.details}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <strong className="text-muted-foreground">{UI_TEXT.lastUpdated}:</strong>
            <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      {/* تذييل البطاقة */}
      <CardFooter className="flex items-center justify-between border-t border-border bg-muted/10 p-6">
        <Link
          href={`/dashboard/products/itemdetail/${product.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/10"
          aria-label={UI_TEXT.viewDetails}
        >
          <Eye className={iconVariants({ size: 'xs' })} />
          <span className="truncate">{UI_TEXT.viewDetails}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
