'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/cards';
import { useCartContext } from '@/providers/cart-provider';
import { Product } from '@/types/databaseTypes';

interface ProductCardAdapterProps {
    product: Product;
    className?: string;
    index?: number;
    discountPercentage?: number; // Optional global discount
}

export default function ProductCardAdapter({ product, className, discountPercentage }: ProductCardAdapterProps) {
    const { addToCart, updateQuantity: updateCartQuantity, removeFromCart, isInCart, cart } = useCartContext();
    const [quantity, setQuantity] = useState(1);

    // Update local quantity if product is in cart
    useEffect(() => {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(1); // Reset to 1 if not in cart
        }
    }, [cart, product.id]);

    const handleQuantityChange = (_productId: string, delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = async (productId: string, qty: number, product: Product) => {
        try {
            if (isInCart(productId)) {
                // Update existing cart item quantity
                updateCartQuantity(productId, qty);
            } else {
                // Add new item to cart
                addToCart(product, qty);
            }
        } catch (error) {
            console.error('Error adding/updating cart:', error);
            throw error; // Re-throw to let ProductCard handle the error
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            removeFromCart(productId);
            setQuantity(1); // Reset quantity when removed
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error; // Re-throw to let ProductCard handle the error
        }
    };

    // Discount logic: globally adapt product if discountPercentage is provided
    let adaptedProduct = product;
    if (discountPercentage && discountPercentage > 0) {
        adaptedProduct = {
            ...product,
            compareAtPrice: product.price,
            price: +(product.price * (1 - discountPercentage / 100)).toFixed(2),
        };
    }

    return (
        <ProductCard
            product={adaptedProduct}
            className={className}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            isInCart={isInCart(product.id)}
        />
    );
} 