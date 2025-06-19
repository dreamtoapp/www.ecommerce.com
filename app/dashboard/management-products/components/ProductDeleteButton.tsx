'use client';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { iconVariants } from '@/lib/utils';
import { toast } from 'sonner';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { deleteProduct } from '../actions/deleteProduct';

export default function ProductDeleteButton({ productId }: { productId: string }) {
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(productId);
            toast.success('تم حذف المنتج بنجاح.');
            // Optionally: refresh or update UI
        } catch (e) {
            let errorMessage = 'لا يمكن حذف المنتج. تحقق من عدم ارتباطه بمعاملات.';
            if (e instanceof Error) errorMessage = e.message;
            toast.error(errorMessage);
        }
    };

    return (
        <ConfirmDeleteDialog onConfirm={handleDeleteProduct}>
            <Button
                variant="ghost"
                size="icon"
                title="حذف"
                className="text-destructive hover:bg-destructive/10"
            >
                <Trash2 className={iconVariants({ size: 'xs' })} />
                <span className="sr-only">حذف</span>
            </Button>
        </ConfirmDeleteDialog>
    );
} 