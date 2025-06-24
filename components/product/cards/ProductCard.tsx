'use client';
import { useState, useEffect, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Trash2 } from 'lucide-react';
import { FaCartPlus } from 'react-icons/fa6';
import Image from 'next/image';
import { Product } from '@/types/databaseTypes';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WishlistButton = dynamic(() => import('@/components/product/cards/WishlistButton'), { ssr: false });
const Notification = dynamic(() => import('@/components/product/cards/NotificationSection'), { ssr: false });
const QuantityControls = dynamic(() => import('@/components/product/cards/QuantityControls'), { ssr: false });

interface ProductCardProps {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: string, delta: number) => void;
    onAddToCart: (productId: string, quantity: number, product: Product) => void;
    onRemoveFromCart?: (productId: string) => void;
    isInCart: boolean;
    className?: string;
    quantityControls?: ReactNode;
}

const ProductCard = ({ product, quantity, onQuantityChange, onAddToCart, onRemoveFromCart, isInCart, className, quantityControls }: ProductCardProps) => {
    const [added, setAdded] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState(product.imageUrl || '/fallback/product-fallback.avif');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentCartState, setCurrentCartState] = useState(isInCart);

    // Sync internal cart state with prop changes
    useEffect(() => {
        setCurrentCartState(isInCart);
    }, [isInCart]);

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await onAddToCart(product.id, quantity, product);
            setCurrentCartState(true);
            setAdded(true);
            setRemoved(false); // Clear remove notification
            // Reset feedback states
            setTimeout(() => setAdded(false), 3000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // Reset state on error
            setCurrentCartState(false);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    const handleRemoveFromCart = async () => {
        if (!onRemoveFromCart) return;

        setLoading(true);
        try {
            await onRemoveFromCart(product.id);
            setCurrentCartState(false);
            setAdded(false); // Clear add notification
            setRemoved(true);
            // Reset feedback states
            setTimeout(() => setRemoved(false), 3000);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            // Reset state on error
            setCurrentCartState(true);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    // Determine button state based on current cart state and availability of remove function
    const isRemoveMode = currentCartState && onRemoveFromCart;
    const buttonText = loading
        ? (isRemoveMode ? 'جاري الإزالة...' : 'جاري الإضافة...')
        : isRemoveMode
            ? 'إزالة من السلة'
            : 'أضف إلى السلة';

    return (
        <Card
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl hover:shadow-2xl border border-border/50 hover:border-primary/20 min-h-[420px] sm:min-h-[520px] w-full max-w-sm mx-auto flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer ${className || ''}`}
            tabIndex={0}
            aria-label={`عرض تفاصيل ${product.name}`}
        >
            {/* Enhanced Notification Feedback */}
            {(added || removed) && (
                <Notification
                    show={added || removed}
                    type={added ? 'add' : 'remove'}
                    message={added ? 'تمت الإضافة إلى السلة!' : 'تمت الإزالة من السلة!'}
                />
            )}

            {/* Cart Indicator (Top-Right) */}
            {currentCartState && (
                <div className="absolute right-3 top-3 z-20 rounded-full bg-green-500 p-2 text-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                    <Check size={20} />
                </div>
            )}

            {/* Image Section - Clean & Minimal */}
            <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl bg-muted/30">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onError={() => setImgSrc('/fallback/product-fallback.avif')}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />

                {/* Only Rating - Minimal Info */}
                {product.rating && product.rating > 0 && (
                    <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Only Wishlist - Bottom Corner */}
                <div className="absolute bottom-3 right-3 z-20" onClick={e => e.stopPropagation()}>
                    <WishlistButton
                        productId={product.id}
                        size="sm"
                        showBackground={true}
                        className="bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-105 min-w-[44px] min-h-[44px]"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-3 sm:p-5 gap-2 sm:gap-3">
                {/* Product Name & Type */}
                <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200" title={product.name}>{product.name}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {product.type === 'accessories' ? 'إكسسوارات' : product.type}
                        </span>
                        <Link href={`/product/${product.slug}`} className="text-xs text-primary/70 group-hover:text-primary transition-colors duration-200 underline focus:outline-none" aria-label={`عرض تفاصيل ${product.name}`}>
                            انقر للتفاصيل ←
                        </Link>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.details}</p>

                {/* Price Display */}
                <div className="flex items-center justify-between gap-2 py-2">
                    <div className="flex flex-col items-start gap-1">
                        {product.compareAtPrice && product.compareAtPrice > product.price ? (
                            <>
                                <span className="text-base sm:text-lg font-semibold text-muted-foreground line-through">
                                    ${typeof product.compareAtPrice === 'number' ? product.compareAtPrice.toFixed(2) : ''}
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                    ${typeof product.price === 'number' ? product.price.toFixed(2) : ''}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                ${typeof product.price === 'number' ? product.price.toFixed(2) : ''}
                            </span>
                        )}
                    </div>
                    {quantity > 1 && (
                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                            <span className="text-xs text-green-600 dark:text-green-400">الإجمالي:</span>
                            <span className="text-sm font-bold text-green-700 dark:text-green-300">${typeof product.price === 'number' ? (quantity * product.price).toFixed(2) : '0.00'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Section - Simplified */}
            <div className="flex flex-col gap-3 mt-auto p-3 sm:p-5 pt-0" onClick={e => e.stopPropagation()}>
                {/* Only show quantity controls when item is in cart or custom controls provided */}
                {(quantityControls || currentCartState) && (
                    quantityControls ? (
                        quantityControls
                    ) : (
                        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                            <QuantityControls
                                quantity={quantity}
                                onDecrease={() => onQuantityChange(product.id, -1)}
                                onIncrease={() => onQuantityChange(product.id, 1)}
                            />
                        </div>
                    )
                )}

                {/* Add/Remove to Cart Button */}
                <Button
                    onClick={isRemoveMode ? handleRemoveFromCart : handleAddToCart}
                    variant={isRemoveMode ? 'destructive' : 'default'}
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 btn-professional"
                    disabled={loading}
                    aria-label={isRemoveMode ? `إزالة ${product.name} من السلة` : `أضف ${product.name} إلى السلة`}
                >
                    {isRemoveMode ? <Trash2 className="h-5 w-5" /> : <FaCartPlus className="h-5 w-5" />}
                    <span className="font-semibold text-base">
                        {buttonText}
                    </span>
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard; 