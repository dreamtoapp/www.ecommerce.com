"use client";
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { iconVariants } from '@/lib/utils';
import CartPreview from './CartPreview';
import { useState, useEffect, useTransition } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

import type { CartWithItems } from '@/app/(e-comm)/cart/actions/cartServerActions';
import { getCart } from '@/app/(e-comm)/cart/actions/cartServerActions';

export default function CartIconClient() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cart, setCart] = useState<CartWithItems | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const fetchCart = () => {
        startTransition(async () => {
            try {
                const cartData = await getCart();
                setCart(cartData);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        });
    };

    useEffect(() => {
        setMounted(true);
        fetchCart();
    }, []);

    // Refresh cart when popover/sheet opens
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;

    // Close popover/sheet when navigating away
    const handleClose = () => setIsOpen(false);

    // The CartIcon UI remains mostly the same
    const cartIcon = (
        <Button
            aria-label="عرض السلة"
            variant="ghost"
            className="relative flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 transition-all duration-300 hover:scale-105 hover:bg-primary/20"
            disabled={isPending}
        >
            <ShoppingCart
                className={iconVariants({ size: 'sm', variant: 'primary' })}
                aria-label="عرض السلة"
            />
            {mounted && cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 animate-bounce items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-md">
                    {cartCount}
                </span>
            )}
        </Button>
    );

    // Mobile version - bottom sheet
    if (isMobile) {
        return (
            <div className="relative">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        {cartIcon}
                    </SheetTrigger>

                    <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>
                                <span className="text-lg font-semibold text-primary">عربة التسوق</span>
                            </SheetTitle>
                        </SheetHeader>
                        <CartPreview cart={cart} closePopover={handleClose} hideHeader />
                    </SheetContent>
                </Sheet>
            </div>
        );
    }

    // Desktop version - popover dropdown
    return (
        <div className="relative">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {cartIcon}
                </PopoverTrigger>

                <PopoverContent
                    className="w-80 p-2 shadow-lg rounded-xl"
                    align="end"
                    sideOffset={10}
                >
                    <CartPreview cart={cart} closePopover={handleClose} />
                </PopoverContent>
            </Popover>
        </div>
    );
} 