"use client";
import Image from 'next/image';
import { Check, Star, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/databaseTypes';
import ProductCardBadges from './ProductCardBadges';
import QuickViewButton from './QuickViewButton';
// Compare feature is postponed; component temporarily disabled
// import CompareButton from './CompareButton';
import WishlistButton from './WishlistButton';

interface ProductCardMediaProps {
    product: Product;
    inCart: boolean;
    isOutOfStock: boolean;
    lowStock: boolean;
    stockQuantity?: number | null;
}

export default function ProductCardMedia({ product, inCart, isOutOfStock, lowStock, stockQuantity }: ProductCardMediaProps) {
    const imgSrc = product.imageUrl || '/fallback/product-fallback.avif';
    return (
        <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl bg-muted/30">
            {/* Product image */}
            <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-cover w-full h-full rounded-t-2xl transition-all duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
            />

            {/* In cart check */}
            {inCart && (
                <div className="absolute right-3 top-3 z-20 rounded-full bg-green-500 p-2 text-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                    <Check size={20} />
                </div>
            )}

            {/* Rating badge – relocated to bottom-left to avoid clashing with SALE / NEW badges */}
            {product.rating && product.rating > 0 && (
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-white backdrop-blur-sm shadow-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                </div>
            )}

            {/* Low stock badge */}
            {lowStock && (
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-lg bg-orange-500/90 px-2.5 py-1.5 text-white shadow-md">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-[10px] font-semibold">متبقي {stockQuantity}</span>
                </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground">غير متوفر</span>
                </div>
            )}

            {/* Quick actions – mobile: horizontal row; ≥sm: vertical column */}
            <div
                className="absolute bottom-2 right-2 z-20 flex gap-2 sm:bottom-3 sm:right-3 sm:flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <WishlistButton
                    productId={product.id}
                    size="sm"
                    showBackground
                    className="bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-105 min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px]"
                    data-analytics="wishlist-toggle"
                />
                <QuickViewButton product={product} />
                {/* <CompareButton productId={product.id} /> */}
            </div>

            {/* Sale / New badges */}
            <ProductCardBadges product={product} />
        </div>
    );
} 