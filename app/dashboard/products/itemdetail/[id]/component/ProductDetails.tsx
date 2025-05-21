'use client';


import { CardContent } from '@/components/ui/card';
import { Product } from '@/types/databaseTypes';;

import UpdateProductDialog from '../../../components/UpdateProductDialog';
import ProductHeader from './ProductHeader';
import ProductImagePreview from './ProductImagePreview';
import ProductPrice from './ProductPrice';
import ProductStatusBadges from './ProductStatusBadges';
import ProductStatusControl from './ProductStatusControl';

// fallback image config
const fallbackImage = { src: '/fallback/fallback.webp' };

// --- Subcomponents ---

function ProductInfoSection({ product }: { product: Product }) {
  return (
    <div className="flex w-full flex-col justify-between space-y-6">
      <ProductPrice price={product.price} />
      <ProductStatusBadges published={product.published} outOfStock={product.outOfStock} />
      <ProductMeta product={product} />
      {product.details && <ProductDescription details={product.details} />}
    </div>
  );
}

function ProductMeta({ product }: { product: Product }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>اسم المنتج</span>
        <span className="font-medium">{product.name}</span>
      </div>

      {product.size && (
        <div className="flex justify-between">
          <span>الحجم</span>
          <span className="font-medium">{product.size}</span>
        </div>
      )}

      {/* مثال لمورد، إذا أردت إضافته لاحقاً */}
      {/* {product.supplierId && (
        <div className="flex justify-between">
          <span>المورد</span>
          <span className="font-medium">{product.supplierId}</span>
        </div>
      )} */}

      <div className="flex justify-between">
        <span>آخر تحديث</span>
        <span className="font-medium">
          {new Date(product.updatedAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

function ProductDescription({ details }: { details: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">الوصف</h3>
      <p className="leading-relaxed text-muted-foreground">{details}</p>
    </div>
  );
}

// --- Main Component ---

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-2 md:p-6">
      {/* Header with product name */}
      <ProductHeader name={product.name || ''} />

      {/* Main content grid: image and info */}
      <CardContent className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center">
          <ProductImagePreview
            src={product.imageUrl || ''}
            alt={product.name}
            fallbackSrc={fallbackImage.src}
          />
          <div className="mt-4 flex flex-col gap-2">
            <UpdateProductDialog product={product} />
            <ProductStatusControl product={product} />
          </div>
        </div>

        <ProductInfoSection product={product} />
      </CardContent>
    </div>
  );
}
