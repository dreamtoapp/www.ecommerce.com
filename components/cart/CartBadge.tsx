"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { useTransition } from "react";

interface CartBadgeProps {
    count: number;
    className?: string;
}

export default function CartBadge({ count, className }: CartBadgeProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            router.push("/cart");
        });
    };

    return (
        <button
            onClick={handleClick}
            aria-label="سلة التسوق"
            className={clsx("relative flex items-center", className)}
        >
            <ShoppingCart className="h-6 w-6 text-feature-commerce icon-enhanced" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] leading-none text-white shadow">
                    {count}
                </span>
            )}
            {isPending && <span className="ml-2 animate-bounce text-xs">…</span>}
        </button>
    );
} 