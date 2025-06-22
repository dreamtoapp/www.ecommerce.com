'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Bell,
    Globe,
    Percent,
    Gift,
    Truck,
    Shield,
    Headphones,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
// MobileSearchBar removed - search is now in drawer
import MobileBottomNav from './MobileBottomNav';
import MobileSearchDrawer from './MobileSearchDrawer';
import { User as UserData } from '@prisma/client';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

interface MobileHeaderProps {
    user: UserData | null;
    cartCount?: number;
    wishlistCount?: number;
    notificationCount?: number;
    isLoggedIn?: boolean;
    userImage?: string | null;
    currentLanguage?: 'ar' | 'en';
    supportEnabled?: boolean;
    whatsappNumber?: string;
    userId?: string;
    onLanguageChange?: (lang: 'ar' | 'en') => void;
}

export default function MobileHeader({
    user,
    cartCount = 0,
    wishlistCount = 0,
    notificationCount = 0,
    isLoggedIn = false,
    userImage,
    currentLanguage = 'ar',
    supportEnabled = true,
    whatsappNumber,
    userId = 'guest',
    onLanguageChange
}: MobileHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPromoBar, setShowPromoBar] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    };

    const alerts = [];
    if (user) {
        if (!user.isOtp) {
            alerts.push({
                id: 'otp-verification-mobile',
                type: 'destructive' as const,
                title: 'حساب غير مفعل',
                description: 'يرجى تفعيل حسابك للوصول الكامل للميزات.',
                href: '/auth/verify',
            });
        }
        if (!user.latitude || !user.longitude) {
            alerts.push({
                id: 'location-missing-mobile',
                type: 'warning' as const,
                title: 'الموقع الجغرافي مطلوب',
                description: 'يرجى تحديث موقعك لتسهيل توصيل الطلبات.',
                href: '/user/profile',
            });
        }
    }

    const menuItems = [
        {
            title: 'الأقسام الرئيسية',
            items: [
                { label: 'ملابس نسائية', href: '/categories/women-clothing', icon: '👗' },
                { label: 'ملابس رجالية', href: '/categories/men-clothing', icon: '👔' },
                { label: 'ملابس أطفال', href: '/categories/kids-clothing', icon: '👶' },
                { label: 'أحذية', href: '/categories/shoes', icon: '👟' },
                { label: 'حقائب', href: '/categories/bags', icon: '👜' },
                { label: 'إكسسوارات', href: '/categories/accessories', icon: '💍' }
            ]
        },
        {
            title: 'خدمات العملاء',
            items: [
                { label: 'تتبع الطلب', href: '/track-order', icon: '📦' },
                { label: 'المرتجعات', href: '/returns', icon: '↩️' },
                { label: 'الدعم الفني', href: '/support', icon: '🎧' },
                { label: 'الأسئلة الشائعة', href: '/faq', icon: '❓' }
            ]
        }
    ];

    return (
        <>
            {/* Promotional Banner */}
            <AnimatePresence>
                {showPromoBar && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-center py-2 px-4 text-sm relative overflow-hidden md:hidden"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Percent className="h-4 w-4" />
                            <span className="font-medium">خصم 50% على جميع المنتجات - شحن مجاني</span>
                            <Gift className="h-4 w-4" />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPromoBar(false)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-destructive-foreground hover:bg-destructive-foreground/20 w-6 h-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Header */}
            <motion.header
                initial={false}
                animate={{
                    backgroundColor: scrolled ? 'hsl(var(--background) / 0.95)' : 'hsl(var(--background))',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none'
                }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 border-b border-border transition-all duration-300 md:hidden",
                    scrolled ? "shadow-lg" : "shadow-sm"
                )}
            >
                <div className="container mx-auto px-4">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between h-14">
                        {/* Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(true)}
                            className="w-10 h-10 p-0"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/assets/logo.webp"
                                alt="Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            {/* Cart */}
                            <Link href="/cart">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-10 h-10 p-0 relative"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-feature-commerce text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center p-0 font-bold">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            {/* Notifications */}
                            <NotificationDropdown alerts={alerts}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-10 h-10 p-0 relative"
                                >
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </NotificationDropdown>
                        </div>
                    </div>

                    {/* Search is now in drawer - removed from fixed header */}
                </div>
            </motion.header>

            {/* Side Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-background shadow-2xl z-50 overflow-y-auto"
                        >
                            {/* Menu Header */}
                            <div className="bg-gradient-to-r from-feature-products to-feature-analytics p-6 text-primary-foreground">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">القائمة الرئيسية</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-primary-foreground hover:bg-primary-foreground/20 w-8 h-8 p-0"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* User Info */}
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-bold">م</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">مرحباً، محمد</p>
                                            <p className="text-sm opacity-90">عضو ذهبي</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-sm">👤</span>
                                        </div>
                                        <span className="font-medium">تسجيل الدخول</span>
                                    </Link>
                                )}
                            </div>

                            {/* Menu Content */}
                            <div className="p-4 space-y-6">
                                {menuItems.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                            {section.title}
                                        </h3>
                                        <div className="space-y-1">
                                            {section.items.map((item, itemIndex) => (
                                                <Link
                                                    key={itemIndex}
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className="text-foreground">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Quick Actions */}
                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                        إعدادات سريعة
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Language Toggle */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                onLanguageChange?.(currentLanguage === 'ar' ? 'en' : 'ar');
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <Globe className="h-4 w-4" />
                                            <span>{currentLanguage === 'ar' ? 'English' : 'العربية'}</span>
                                        </Button>

                                        {/* Customer Service */}
                                        <Link href="/support">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full flex items-center gap-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Headphones className="h-4 w-4" />
                                                <span>الدعم</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Trust Indicators */}
                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Truck className="h-6 w-6 text-feature-products" />
                                            <span className="text-xs text-gray-600">شحن مجاني</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Shield className="h-6 w-6 text-feature-users" />
                                            <span className="text-xs text-gray-600">دفع آمن</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Gift className="h-6 w-6 text-feature-suppliers" />
                                            <span className="text-xs text-gray-600">ضمان الجودة</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <MobileBottomNav
                isLoggedIn={isLoggedIn}
                userImage={userImage}
                onSearchClick={() => setIsSearchOpen(true)}
            />

            {/* Search Drawer */}
            <MobileSearchDrawer
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearch={handleSearch}
            />
        </>
    );
} 