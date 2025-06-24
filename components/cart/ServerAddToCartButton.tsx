"use client";

import { useTransition } from "react";
import { addItem } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ServerAddToCartButtonProps {
    productId: string;
    quantity?: number;
    className?: string;
    label?: string;
}

export default function ServerAddToCartButton({
    productId,
    quantity = 1,
    className = "",
    label = "أضف للسلة",
}: ServerAddToCartButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleAddToCart = () => {
        startTransition(async () => {
            await addItem(productId, quantity);
            // Optionally: show a toast or feedback here
        });
    };

    return (
        <Button
            className={`btn-add flex items-center gap-2 ${className}`}
            onClick={handleAddToCart}
            disabled={isPending}
            aria-busy={isPending}
        >
            <ShoppingCart className="h-5 w-5 icon-enhanced" />
            {label}
            {isPending && (
                <span className="ml-2 animate-spin">⏳</span>
            )}
        </Button>
    );
} 