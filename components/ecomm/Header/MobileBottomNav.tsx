'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Grid3X3,
    Search,
    Heart,
    User,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    MessageCircle,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { pingAdminAction } from '@/app/pingAdminAction';

interface BottomNavItem {
    id: string;
    label: string;
    icon: any;
    href: string;
    badge?: number;
    isActive?: boolean;
    color: string;
}

interface MobileBottomNavProps {
    cartCount?: number;
    wishlistCount?: number;
    isLoggedIn?: boolean;
    supportEnabled?: boolean;
    whatsappNumber?: string;
    userId?: string;
}

export default function MobileBottomNav({
    cartCount = 0,
    wishlistCount = 0,
    isLoggedIn = false,
    supportEnabled = true,
    whatsappNumber,
    userId = 'guest'
}: MobileBottomNavProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('home');
    const [showFAB, setShowFAB] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Support ping state
    const [supportStatus, setSupportStatus] = useState<'idle' | 'sent' | 'error' | 'fallback' | 'rate-limited'>('idle');
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportCooldown, setSupportCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const COOLDOWN_SECONDS = 180; // 3 minutes
    const LAST_PING_KEY = 'support_ping_last_time';

    // Hide/show bottom nav on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowFAB(false); // Hide when scrolling down
            } else {
                setShowFAB(true); // Show when scrolling up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Update active tab based on current path
    useEffect(() => {
        if (pathname === '/') {
            setActiveTab('home');
        } else if (pathname.startsWith('/categories')) {
            setActiveTab('categories');
        } else if (pathname.startsWith('/search')) {
            setActiveTab('search');
        } else if (pathname.startsWith('/wishlist')) {
            setActiveTab('wishlist');
        } else if (pathname.startsWith('/user') || pathname.startsWith('/auth')) {
            setActiveTab('account');
        }
    }, [pathname]);

    // Support ping cooldown restoration
    useEffect(() => {
        const lastPing = localStorage.getItem(LAST_PING_KEY);
        if (lastPing) {
            const elapsed = Math.floor((Date.now() - parseInt(lastPing, 10)) / 1000);
            if (elapsed < COOLDOWN_SECONDS) {
                setSupportCooldown(COOLDOWN_SECONDS - elapsed);
            }
        }
    }, [COOLDOWN_SECONDS, LAST_PING_KEY]);

    // Support ping cooldown timer
    useEffect(() => {
        if (supportCooldown > 0) {
            timerRef.current = setInterval(() => {
                setSupportCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current!);
        }
    }, [supportCooldown]);

    const navItems: BottomNavItem[] = [
        {
            id: 'home',
            label: 'الرئيسية',
            icon: Home,
            href: '/',
            color: 'text-feature-products'
        },
        {
            id: 'categories',
            label: 'الأقسام',
            icon: Grid3X3,
            href: '/categories',
            color: 'text-feature-analytics'
        },
        {
            id: 'search',
            label: 'البحث',
            icon: Search,
            href: '/search',
            color: 'text-feature-users'
        },
        {
            id: 'wishlist',
            label: 'المفضلة',
            icon: Heart,
            href: '/wishlist',
            badge: wishlistCount,
            color: 'text-feature-suppliers'
        },
        {
            id: 'account',
            label: isLoggedIn ? 'حسابي' : 'دخول',
            icon: User,
            href: isLoggedIn ? '/user/profile' : '/auth/login',
            color: 'text-feature-settings'
        }
    ];

    const handleTabPress = (tabId: string) => {
        setActiveTab(tabId);
        // Add haptic feedback if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    // Support ping handler
    const handleSupportPing = async () => {
        setSupportLoading(true);
        const res = await pingAdminAction(userId, supportMessage);
        setSupportLoading(false);

        if (res.success) {
            setSupportStatus('sent');
            setSupportCooldown(COOLDOWN_SECONDS);
            localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        } else if (res.fallback) {
            setSupportStatus('fallback');
            setSupportCooldown(COOLDOWN_SECONDS);
            localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        } else if (res.rateLimited) {
            setSupportStatus('rate-limited');
            setSupportCooldown(COOLDOWN_SECONDS);
            localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        } else {
            setSupportStatus('error');
        }

        setShowSupportModal(false);
        setSupportMessage('');
    };

    return (
        <>
            {/* Bottom Navigation */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: showFAB ? 0 : 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg md:hidden"
            >
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => handleTabPress(item.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center relative transition-all duration-200",
                                    "hover:bg-muted/50 active:bg-muted",
                                    isActive ? "bg-muted/50" : ""
                                )}
                            >
                                <div className="relative">
                                    <Icon
                                        className={cn(
                                            "h-5 w-5 transition-all duration-200",
                                            isActive
                                                ? `${item.color} scale-110`
                                                : "text-muted-foreground"
                                        )}
                                    />

                                    {/* Badge for notifications */}
                                    {item.badge && item.badge > 0 && (
                                        <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs min-w-[16px] h-[16px] rounded-full flex items-center justify-center p-0">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </Badge>
                                    )}

                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={cn(
                                                "absolute -bottom-1 left-1/2 transform -translate-x-1/2",
                                                "w-1 h-1 rounded-full",
                                                item.color.replace('text-', 'bg-')
                                            )}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </div>

                                <span className={cn(
                                    "text-xs mt-1 transition-colors duration-200",
                                    isActive
                                        ? item.color
                                        : "text-muted-foreground"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* Floating Action Button (Cart) */}
            <AnimatePresence>
                {showFAB && (
                    <motion.div
                        initial={{ scale: 0, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 100 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed bottom-20 right-4 z-50 md:hidden"
                    >
                        <Link href="/cart">
                            <Button
                                size="lg"
                                className={cn(
                                    "w-14 h-14 rounded-full shadow-xl",
                                    "bg-gradient-to-r from-feature-commerce to-feature-products",
                                    "hover:shadow-2xl hover:scale-110 transition-all duration-300",
                                    "border-4 border-white"
                                )}
                            >
                                <div className="relative">
                                    <ShoppingBag className="h-6 w-6 text-white" />
                                    {cartCount > 0 && (
                                        <Badge className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground text-xs min-w-[20px] h-[20px] rounded-full flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </Badge>
                                    )}
                                </div>
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Action Buttons */}
            <AnimatePresence>
                {showFAB && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ delay: 0.1 }}
                        className="fixed bottom-32 right-4 z-40 md:hidden space-y-3"
                    >
                        {/* WhatsApp Support */}
                        {whatsappNumber && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-12 h-12 rounded-full shadow-lg bg-feature-suppliers hover:bg-feature-suppliers/90 border-0 relative"
                                    onClick={() => {
                                        const message = encodeURIComponent('مرحباً، أحتاج مساعدة في التسوق');
                                        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');

                                        // Haptic feedback
                                        if ('vibrate' in navigator) {
                                            navigator.vibrate(100);
                                        }
                                    }}
                                >
                                    <MessageCircle className="h-5 w-5 text-white" />
                                    {/* Online indicator */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-feature-suppliers rounded-full border-2 border-white animate-pulse"></div>
                                </Button>
                            </motion.div>
                        )}

                        {/* Support Ping */}
                        {supportEnabled && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-12 h-12 rounded-full shadow-lg bg-feature-settings hover:bg-feature-settings/90 border-0 relative"
                                    onClick={() => setShowSupportModal(true)}
                                    disabled={supportCooldown > 0}
                                    title="طلب دعم فوري من الإدارة"
                                >
                                    <Zap className="h-5 w-5 text-white" />
                                    {/* Cooldown timer */}
                                    {supportCooldown > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-background border border-border rounded-full px-1 py-0.5 text-xs font-bold text-foreground shadow">
                                            {Math.floor(supportCooldown / 60)}:{(supportCooldown % 60).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        {/* Quick Search */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 rounded-full shadow-lg bg-background border border-border"
                                onClick={() => {
                                    // Open search modal or focus search input
                                    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                                    if (searchInput) {
                                        searchInput.focus();
                                    }
                                }}
                            >
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>

                        {/* Trending Products */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Link href="/trending">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-12 h-12 rounded-full shadow-lg bg-background border border-border relative"
                                >
                                    <TrendingUp className="h-5 w-5 text-feature-analytics" />
                                    <Sparkles className="h-3 w-3 text-feature-analytics absolute -top-1 -right-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content overlap */}
            <div className="h-16 md:hidden" />

            {/* Support Ping Modal */}
            {showSupportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="flex w-full max-w-xs flex-col gap-3 rounded-lg bg-background p-6 shadow-lg mx-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground">وصف مشكلتك</h3>
                        <p className="mb-1 text-xs text-muted-foreground">
                            <span className="mb-0.5 block">
                                الغرض من هذه الخدمة: إرسال طلب دعم فوري للإدارة لحل مشكلة عاجلة أو استفسار هام.
                            </span>
                            <span className="block">عدد الأحرف المسموح: من 5 إلى 200 حرف.</span>
                            <span className="block">
                                يرجى استخدام هذه الخدمة فقط للمشاكل العاجلة أو الاستفسارات الهامة.
                            </span>
                        </p>
                        <textarea
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            maxLength={200}
                            rows={3}
                            className="w-full resize-none rounded border border-border bg-background p-2 text-foreground placeholder:text-muted-foreground"
                            placeholder="كيف يمكننا مساعدتك؟"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSupportModal(false)}
                                disabled={supportLoading}
                            >
                                إلغاء
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSupportPing}
                                disabled={supportLoading || supportMessage.trim().length < 5}
                                className="bg-feature-settings hover:bg-feature-settings/90"
                            >
                                {supportLoading ? 'جارٍ الإرسال...' : 'إرسال'}
                            </Button>
                        </div>

                        {/* Status Messages */}
                        {supportStatus === 'sent' && (
                            <p className="text-sm text-green-600">تم إرسال الطلب بنجاح!</p>
                        )}
                        {supportStatus === 'fallback' && (
                            <p className="text-sm text-yellow-600">
                                ستتم مراجعة طلبك قريباً (وضع الاحتياط).
                            </p>
                        )}
                        {supportStatus === 'rate-limited' && (
                            <p className="text-sm text-orange-600">يرجى الانتظار قبل إرسال طلب آخر.</p>
                        )}
                        {supportStatus === 'error' && (
                            <p className="text-sm text-red-600">فشل في إرسال الطلب. حاول مرة أخرى.</p>
                        )}
                    </motion.div>
                </div>
            )}
        </>
    );
} 