'use client';

import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import CancelOrderDialog from './CancelOrderDialog';
import { calculateRemainingTime, isOrderEligibleForCancellation } from '../helpers/timeHelpers';

interface CancelOrderButtonProps {
    orderId: string;
    orderNumber: string;
    orderCreatedAt: Date;
    orderStatus: string;
}

export default function CancelOrderButton({
    orderId,
    orderNumber,
    orderCreatedAt,
    orderStatus
}: CancelOrderButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [canCancel, setCanCancel] = useState(false);
    const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

    // Check if order can be canceled on component mount
    useEffect(() => {
        const checkCancelEligibility = () => {
            try {
                const eligible = isOrderEligibleForCancellation(orderStatus, orderCreatedAt);
                setCanCancel(eligible);

                if (eligible) {
                    const { remainingMinutes } = calculateRemainingTime(orderCreatedAt);
                    setRemainingMinutes(remainingMinutes);
                } else {
                    setRemainingMinutes(null);
                }
            } catch (error) {
                console.error('Error checking cancel eligibility:', error);
                setCanCancel(false);
            }
        };

        checkCancelEligibility();
    }, [orderCreatedAt, orderStatus]);

    // Update remaining time every minute
    useEffect(() => {
        if (!canCancel || !remainingMinutes) return;

        const interval = setInterval(() => {
            setRemainingMinutes(prev => {
                if (prev && prev > 1) {
                    return prev - 1;
                } else {
                    setCanCancel(false);
                    return null;
                }
            });
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [canCancel, remainingMinutes]);

    if (!canCancel) {
        return null; // Don't show button if order can't be canceled
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDialogOpen(true)}
                            className="btn-delete-outline border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <X className="h-4 w-4 ml-2" />
                            إلغاء الطلب
                            {remainingMinutes && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    <Clock className="h-3 w-3 ml-1" />
                                    {remainingMinutes} د
                                </Badge>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>إلغاء الطلب خلال {remainingMinutes} دقيقة متبقية</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <CancelOrderDialog
                orderId={orderId}
                orderNumber={orderNumber}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                remainingMinutes={remainingMinutes || undefined}
            />
        </>
    );
} 