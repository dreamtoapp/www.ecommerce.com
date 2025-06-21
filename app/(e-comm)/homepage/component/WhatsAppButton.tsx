'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
    whatsapp?: string;
    businessName?: string;
    welcomeMessage?: string;
    businessHours?: {
        start: string;
        end: string;
        timezone?: string;
    };
    showBusinessCard?: boolean;
    position?: 'bottom-right' | 'bottom-left';
    className?: string;
    // Legacy support
    phoneNumber?: string;
}

export default function WhatsAppButton({
    whatsapp,
    businessName = "متجر الأحلام",
    welcomeMessage = "Hello! I need help with my order.",
    businessHours = { start: "09:00", end: "22:00", timezone: "Asia/Riyadh" },
    showBusinessCard = false,
    position = 'bottom-right',
    className,
    phoneNumber // Legacy support
}: WhatsAppButtonProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showPulse, setShowPulse] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Use whatsapp prop or phoneNumber for backward compatibility
    const finalPhoneNumber = whatsapp || phoneNumber;

    // Check if the user is on a mobile device
    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
    }, []);

    // Check business hours
    useEffect(() => {
        const checkBusinessHours = () => {
            try {
                const now = new Date();
                const currentTime = now.toLocaleTimeString('en-US', {
                    hour12: false,
                    timeZone: businessHours.timezone
                });

                const [currentHour, currentMinute] = currentTime.split(':').map(Number);
                const [startHour, startMinute] = businessHours.start.split(':').map(Number);
                const [endHour, endMinute] = businessHours.end.split(':').map(Number);

                const currentMinutes = currentHour * 60 + currentMinute;
                const startMinutes = startHour * 60 + startMinute;
                const endMinutes = endHour * 60 + endMinute;

                setIsOnline(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
            } catch (error) {
                // Fallback to always online if timezone check fails
                setIsOnline(true);
            }
        };

        checkBusinessHours();
        const interval = setInterval(checkBusinessHours, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [businessHours]);

    // Hide pulse after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowPulse(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const handleWhatsAppClick = (customMessage?: string) => {
        if (!finalPhoneNumber) return;

        const message = customMessage || welcomeMessage;
        const cleanPhoneNumber = finalPhoneNumber.replace(/\D/g, '');

        // Use different URLs based on device type (keeping legacy behavior)
        const whatsappUrl = isMobile
            ? `whatsapp://send?phone=${cleanPhoneNumber}&text=${encodeURIComponent(message)}`
            : `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;

        if (isMobile) {
            window.location.href = whatsappUrl;
        } else {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }

        setIsExpanded(false);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    };

    const quickMessages = [
        {
            id: 'shopping',
            text: 'أريد المساعدة في التسوق',
            icon: '🛍️'
        },
        {
            id: 'order',
            text: 'استفسار عن طلبي',
            icon: '📦'
        },
        {
            id: 'support',
            text: 'أحتاج دعم فني',
            icon: '🔧'
        },
        {
            id: 'general',
            text: 'استفسار عام',
            icon: '💬'
        }
    ];

    if (!finalPhoneNumber) return null;

    // Simple version (legacy compatibility)
    if (!showBusinessCard) {
        return (
            <div className={cn(
                'fixed z-50',
                position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
                className
            )}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    <button
                        onClick={() => handleWhatsAppClick()}
                        className={cn(
                            'flex items-center justify-center rounded-full p-4 shadow-2xl transition-all duration-300',
                            'bg-green-500 hover:bg-green-600 text-white',
                            'relative overflow-hidden'
                        )}
                    >
                        <FaWhatsapp className="h-8 w-8" />

                        {/* Online Status Indicator */}
                        {isOnline && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                        )}

                        {/* Pulse Animation */}
                        {showPulse && isOnline && (
                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                        )}
                    </button>
                </motion.div>
            </div>
        );
    }

    // Enhanced version with business card
    return (
        <div className={cn(
            "fixed z-50",
            position === 'bottom-right' ? "bottom-6 right-6" : "bottom-6 left-6",
            className
        )}>
            {/* Business Card */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4"
                    >
                        <Card className="w-72 shadow-2xl border-0 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{businessName}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    isOnline ? "bg-green-300" : "bg-gray-300"
                                                )} />
                                                <span className="text-sm">
                                                    {isOnline ? 'متاح الآن' : 'غير متاح حالياً'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsExpanded(false)}
                                        className="text-white hover:bg-white/20 w-8 h-8 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        اختر نوع الاستفسار للحصول على مساعدة سريعة:
                                    </p>

                                    {quickMessages.map((msg) => (
                                        <button
                                            key={msg.id}
                                            onClick={() => handleWhatsAppClick(msg.text)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-right"
                                        >
                                            <span className="text-lg">{msg.icon}</span>
                                            <span className="text-sm text-foreground">{msg.text}</span>
                                        </button>
                                    ))}

                                    {/* Business Hours */}
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>ساعات العمل: {businessHours.start} - {businessHours.end}</span>
                                        </div>
                                    </div>

                                    {/* Direct Call Button */}
                                    <Button
                                        onClick={() => handleWhatsAppClick()}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        بدء محادثة واتساب
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main WhatsApp Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "w-16 h-16 rounded-full shadow-2xl border-0 relative overflow-hidden",
                        "bg-green-500 hover:bg-green-600 text-white",
                        "transition-all duration-300"
                    )}
                >
                    <FaWhatsapp className="h-8 w-8" />

                    {/* Online Status Indicator */}
                    {isOnline && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    )}

                    {/* Pulse Animation */}
                    {showPulse && isOnline && (
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                    )}
                </Button>
            </motion.div>

            {/* Tooltip for first-time users */}
            {!isExpanded && showPulse && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-lg p-2 shadow-lg whitespace-nowrap"
                >
                    <span className="text-xs text-foreground">تحدث معنا على واتساب!</span>
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-background border-r border-b border-border rotate-45" />
                </motion.div>
            )}
        </div>
    );
} 