'use client';

import { useState } from 'react';

import Image from 'next/image';
import { toast } from 'sonner';

// Note: PromotionBadge replaced with simple discount badge
import RatingPreview from '@/components/rating/RatingPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { cn } from '@/lib/utils';
import { Product } from '@/types/databaseTypes';;

import Link from '../link';

// Fix: Accept details as string | null | undefined for compatibility with backend data
export interface ProductCardProps {
  product: Product;
  className?: string;
  quantity?: number;
  onQuantityChange?: (productId: string, delta: number) => void;
  onAddToCart?: (productId: string, quantity: number, product: Product) => void;
  isInCart?: boolean;
}

export default function ProductCard({
  product,
  className,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  isInCart = false,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/fallback/product-fallback.avif');
  console.log('product.imageUrl:', product.imageUrl);

  // Format price
  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(product.price);

  // Format compareAtPrice (original price) if it exists
  const formattedCompareAtPrice = product.compareAtPrice
    ? new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(product.compareAtPrice)
    : null;

  // Calculate discount percentage if compareAtPrice exists and is greater than price
  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  // Handle add to cart click
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to product page
    if (onAddToCart) {
      if (quantity > 0) {
        onAddToCart(product.id, quantity, product);
        toast.success(`${product.name} (${quantity}) تمت إضافته للسلة بنجاح!`);
      } else {
        toast.error('الكمية يجب أن تكون أكبر من صفر'); // Quantity must be greater than zero
      }
    }
  };

  return (
    <div className={cn('group relative', className)}>
      {/* Wishlist button */}
      <div className='absolute left-3 top-3 z-10'>
        <WishlistButton productId={product.id} size='sm' showBackground={true} />
      </div>

      {/* Product link */}
      <Link href={`/product/${product.slug || product.id}`} className='block'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            onError={() => setImgSrc('/fallback/product-fallback.avif')}
          />

          {/* Display sale badge */}
          {discountPercentage !== null && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Stock badge */}
          {product.outOfStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <Badge variant='outline' className='bg-white px-3 py-1 font-bold text-black'>
                غير متوفر
              </Badge>
            </div>
          )}
        </div>

        <div className='mt-3 space-y-1'>
          {/* Product name */}
          <h3 className='line-clamp-1 text-sm font-medium'>{product.name}</h3>

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <RatingPreview
              productId={product.id}
              productSlug={product.slug}
              rating={product.rating}
              reviewCount={product.reviewCount || 0}
              size='sm'
              disableLink={true}
            />
          )}

          {/* Price */}
          <div className='flex items-center gap-2'>
            {/* Show current price */}
            <span className='text-sm font-bold'>{formattedPrice}</span>
            {/* Show original price if on sale */}
            {formattedCompareAtPrice && discountPercentage !== null && (
              <span className='text-xs text-muted-foreground line-through'>
                {formattedCompareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quantity selector and Add to Cart button */}
      {onQuantityChange && onAddToCart ? (
        <div className='mt-4 flex flex-col gap-2'>
          {/* Quantity selector */}
          <div className='flex items-center justify-between gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.preventDefault();
                onQuantityChange(product.id, -1);
              }}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input
              type='number'
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                const newQuantity = parseInt(e.target.value, 10);
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                  onQuantityChange(product.id, newQuantity - quantity);
                }
              }}
              className='w-16 text-center'
              min='1'
            />
            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.preventDefault();
                onQuantityChange(product.id, 1);
              }}
            >
              +
            </Button>
          </div>

          {/* Add to Cart button */}
          <Button
            className='w-full'
            onClick={handleAddToCartClick}
            disabled={product.outOfStock || quantity <= 0}
          >
            {product.outOfStock ? 'غير متوفر' : isInCart ? 'في السلة' : 'أضف للسلة'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
