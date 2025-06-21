'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Heart,
    ShoppingCart,
    Star,
    Eye,
    Share2,
    Zap,
    Timer,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    isOnSale?: boolean;
    discountPercentage?: number;
    slug: string;
    isNew?: boolean;
    isFeatured?: boolean;
    stockQuantity?: number;
}

interface OptimizedProductCardProps {
    product: Product;
    priority?: boolean;
    layout?: 'grid' | 'list';
    showQuickActions?: boolean;
    className?: string;
}

function OptimizedProductCard({
    product,
    priority = false,
    layout = 'grid',
    showQuickActions = true,
    className
}: OptimizedProductCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const getStockStatus = () => {
        if (!product.inStock) return { status: 'out-of-stock', text: 'نفد المخزون', color: 'bg-red-100 text-red-800' };
        if (product.stockQuantity && product.stockQuantity < 5) {
            return { status: 'low-stock', text: `باقي ${product.stockQuantity} قطع`, color: 'bg-orange-100 text-orange-800' };
        }
        return { status: 'in-stock', text: 'متوفر', color: 'bg-green-100 text-green-800' };
    };

    const stockStatus = getStockStatus();

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300 will-change-transform',
                'hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]',
                'border-border/50 hover:border-border',
                'bg-background/50 backdrop-blur-sm',
                layout === 'list' && 'flex flex-row',
                className
            )}
        >
            <Link href={`/product/${product.slug}`} className="block">
                <div className={cn(
                    'relative overflow-hidden bg-muted/30',
                    layout === 'grid' ? 'aspect-square' : 'w-48 h-48'
                )}>
                    {/* Product badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                        {product.isNew && (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                                <Zap className="w-3 h-3 mr-1" />
                                جديد
                            </Badge>
                        )}
                        {product.isOnSale && product.discountPercentage && (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md animate-pulse">
                                -{product.discountPercentage}%
                            </Badge>
                        )}
                        {product.isFeatured && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md">
                                مميز
                            </Badge>
                        )}
                    </div>

                    {/* Stock status indicator */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className={cn('text-xs font-medium', stockStatus.color)}>
                            {stockStatus.text}
                        </Badge>
                    </div>

                    {/* Loading skeleton */}
                    {!isImageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
                    )}

                    {/* Product image with advanced optimization */}
                    <Image
                        src={imageError ? '/fallback/product-fallback.avif' : product.imageUrl}
                        alt={product.name}
                        fill
                        className={cn(
                            'object-cover transition-all duration-500 group-hover:scale-110',
                            isImageLoaded ? 'opacity-100' : 'opacity-0'
                        )}
                        sizes={layout === 'grid'
                            ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            : "192px"
                        }
                        priority={priority}
                        quality={85}
                        loading={priority ? 'eager' : 'lazy'}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => {
                            setImageError(true);
                            setIsImageLoaded(true);
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />

                    {/* Quick action overlay */}
                    {showQuickActions && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsWishlisted(!isWishlisted);
                                    }}
                                >
                                    <Heart className={cn(
                                        'w-4 h-4',
                                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                    )} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Share2 className="w-4 h-4 text-gray-600" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="secondary" className="bg-gray-800 text-white text-lg px-4 py-2">
                                نفد المخزون
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className={cn(
                    'p-4 space-y-3',
                    layout === 'list' && 'flex-1'
                )}>
                    {/* Product title */}
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {product.name}
                    </h3>

                    {/* Rating and reviews */}
                    {product.rating && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            'w-4 h-4',
                                            i < Math.floor(product.rating!)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground/30'
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ({product.reviewCount || 0})
                            </span>
                        </div>
                    )}

                    {/* Price section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">
                                {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <Badge variant="destructive" className="text-xs">
                                وفر {formatPrice(product.originalPrice - product.price)}
                            </Badge>
                        )}
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>ضمان الجودة</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>توصيل سريع</span>
                        </div>
                    </div>

                    {/* Add to cart button */}
                    <Button
                        className={cn(
                            'w-full font-semibold transition-all duration-300',
                            product.inStock
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg hover:scale-105'
                                : 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed'
                        )}
                        disabled={!product.inStock}
                        onClick={(e) => e.preventDefault()}
                    >
                        {product.inStock ? (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                أضف للسلة
                            </>
                        ) : (
                            'نفد المخزون'
                        )}
                    </Button>
                </CardContent>
            </Link>
        </Card>
    );
}

// Memoize the component for better performance
export default memo(OptimizedProductCard); 