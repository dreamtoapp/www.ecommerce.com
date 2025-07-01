'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, AlertCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { cancelOrderByCustomer } from '../actions/cancelOrder';
import { z } from 'zod';

const cancelOrderSchema = z.object({
    reason: z.string().min(1, 'سبب الإلغاء مطلوب').max(500, 'سبب الإلغاء طويل جداً'),
});

type CancelOrderFormData = z.infer<typeof cancelOrderSchema>;

interface CancelOrderDialogProps {
    orderId: string;
    orderNumber: string;
    isOpen: boolean;
    onClose: () => void;
    remainingMinutes?: number;
}

export default function CancelOrderDialog({
    orderId,
    orderNumber,
    isOpen,
    onClose,
    remainingMinutes
}: CancelOrderDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const form = useForm<CancelOrderFormData>({
        resolver: zodResolver(cancelOrderSchema),
        defaultValues: {
            reason: '',
        },
    });

    const onSubmit = async (data: CancelOrderFormData) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('reason', data.reason);

            const result = await cancelOrderByCustomer(null, formData);
            setSubmitResult(result);

            if (result.success) {
                // Show success message and close dialog after 2 seconds
                setTimeout(() => {
                    handleClose();
                    // Refresh the page to show updated order status
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'حدث خطأ أثناء إلغاء الطلب. حاول مرة أخرى.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        form.reset();
        setSubmitResult(null);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <X className="h-5 w-5 text-destructive" />
                        إلغاء الطلب #{orderNumber}
                    </DialogTitle>
                    <DialogDescription>
                        يمكنك إلغاء طلبك خلال ساعة واحدة من إنشائه فقط.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Time Remaining Alert */}
                        {remainingMinutes && remainingMinutes > 0 && (
                            <Alert className="border-feature-analytics bg-feature-analytics-soft">
                                <Clock className="h-4 w-4 text-feature-analytics" />
                                <AlertDescription>
                                    الوقت المتبقي للإلغاء: <strong>{remainingMinutes} دقيقة</strong>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Alert */}
                        {submitResult?.success === false && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{submitResult.message}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success Alert */}
                        {submitResult?.success === true && (
                            <Alert className="border-success bg-success-soft">
                                <AlertCircle className="h-4 w-4 text-success" />
                                <AlertDescription>{submitResult.message}</AlertDescription>
                            </Alert>
                        )}

                        {/* Reason Input */}
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        سبب الإلغاء *
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="يرجى ذكر سبب إلغاء الطلب..."
                                            className="min-h-[100px] resize-none"
                                            disabled={isSubmitting || submitResult?.success === true}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground">
                                        {field.value.length}/500 حرف
                                    </p>
                                </FormItem>
                            )}
                        />

                        {/* Warning */}
                        <Alert className="border-warning bg-warning-soft">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <AlertDescription>
                                <strong>تنبيه:</strong> لا يمكن التراجع عن إلغاء الطلب بعد التأكيد.
                            </AlertDescription>
                        </Alert>

                        <DialogFooter className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="btn-cancel-outline"
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isSubmitting || submitResult?.success === true}
                                className="btn-delete"
                            >
                                {isSubmitting ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 