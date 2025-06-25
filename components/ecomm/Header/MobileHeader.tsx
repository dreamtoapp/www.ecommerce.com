'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {

    ShoppingCart,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { UserRole } from '@/constant/enums';
import Logo from './Logo';
import { useCartStore } from '@/store/cartStore';
import UserMenuTrigger from './UserMenuTrigger';

interface UserWithRole {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    // You can add any other fields from your actual user model here
    // For example:
    // address?: string | null;
    // phone?: string | null;
    emailVerified?: Date | null;
}

type Alert = {
    id: string;
    type: 'warning' | 'destructive';
    title: string;
    description: string;
    href: string;
};

interface MobileHeaderProps {
    user: UserWithRole | null;
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    alerts: Alert[];
    unreadCount?: number;
}

const MobileHeader = ({
    user,
    logo,
    logoAlt,
    isLoggedIn,
    alerts,
    unreadCount,
}: MobileHeaderProps) => {

    const { getTotalUniqueItems } = useCartStore();
    const cartCount = getTotalUniqueItems();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
                {/* 1. UserMenu (left) */}
                <div className="flex items-center gap-2">
                    <UserMenuTrigger
                        user={user ? {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role as UserRole,
                        } : null}
                        alerts={alerts}
                        isMobile={true}
                        aria-label="User account menu (mobile)"
                    />
                </div>
                {/* 2. Logo (center) */}
                <div className="flex-1 flex justify-center">
                    <Logo logo={logo} logoAlt={logoAlt} />
                </div>
                {/* 3. Notification bell and Cart (right) */}
                <div className="flex items-center gap-4">
                    {/* Notification bell */}
                    {isLoggedIn && (
                        <NotificationDropdown alerts={alerts || []}>
                            <div className="relative cursor-pointer">
                                <svg className="h-6 w-6 text-feature-analytics icon-enhanced" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {/* Only show badge if unreadCount > 0 */}
                                {typeof unreadCount === 'number' && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow z-10">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </NotificationDropdown>
                    )}
                    {/* Cart icon */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full max-w-md p-0 flex flex-col">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>سلة التسوق</SheetTitle>
                            </SheetHeader>
                            <div className="p-4 flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">عرض السلة متاح في الصفحة الرئيسية</p>
                                    <Button asChild className="mt-4">
                                        <Link href="/cart">عرض السلة</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </>
    );
};

export default MobileHeader; 