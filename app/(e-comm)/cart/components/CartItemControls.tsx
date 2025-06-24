"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { updateItemQuantity, removeItem } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { toast } from "sonner";

interface CartItemControlsProps {
    itemId: string;
    currentQuantity: number;
    productName: string;
}

export default function CartItemControls({
    itemId,
    currentQuantity,
    productName
}: CartItemControlsProps) {
    const [quantity, setQuantity] = useState(currentQuantity);
    const [isPending, startTransition] = useTransition();

    const handleQuantityUpdate = (newQuantity: number) => {
        if (newQuantity < 1) return;

        setQuantity(newQuantity);
        startTransition(async () => {
            try {
                await updateItemQuantity(itemId, newQuantity);
                toast.success(`تم تحديث كمية ${productName}`);
            } catch (error) {
                toast.error("فشل في تحديث الكمية");
                setQuantity(currentQuantity); // Revert on error
            }
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            try {
                await removeItem(itemId);
                toast.success(`تم حذف ${productName} من السلة`);
            } catch (error) {
                toast.error("فشل في حذف المنتج");
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity >= 1 && newQuantity <= 99) {
            handleQuantityUpdate(newQuantity);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center gap-1 border border-feature-commerce/30 rounded-lg">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-feature-commerce/10"
                    onClick={() => handleQuantityUpdate(quantity - 1)}
                    disabled={isPending || quantity <= 1}
                    aria-label="تقليل الكمية"
                >
                    <Minus className="h-3 w-3" />
                </Button>

                <Input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-12 h-8 text-center border-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                    max="99"
                    disabled={isPending}
                />

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-feature-commerce/10"
                    onClick={() => handleQuantityUpdate(quantity + 1)}
                    disabled={isPending || quantity >= 99}
                    aria-label="زيادة الكمية"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>

            {/* Remove Button */}
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 btn-delete hover:bg-red-50 hover:text-red-600"
                onClick={handleRemove}
                disabled={isPending}
                aria-label={`حذف ${productName}`}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
} 