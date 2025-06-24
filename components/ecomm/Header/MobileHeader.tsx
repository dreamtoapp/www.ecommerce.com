'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LogIn,
    ShoppingCart,
    Bell,
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
import dynamic from 'next/dynamic';

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
}

const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });

const MobileHeader = ({
    user,
    logo,
    logoAlt,
    isLoggedIn,

    alerts,
}: MobileHeaderProps) => {

    const { getTotalUniqueItems } = useCartStore();
    const cartCount = getTotalUniqueItems();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);



    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
                <div className="flex items-center gap-2">
                    <UserMenu
                        user={user ? {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role as UserRole,
                        } : null}
                        alerts={alerts}
                        aria-label="User account menu (mobile)"
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <Logo logo={logo} logoAlt={logoAlt} />
                </div>
                <div className="flex items-center gap-2">
                    {isLoggedIn && user ? (
                        <NotificationDropdown alerts={alerts}>
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </NotificationDropdown>
                    ) : (
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/auth/login">
                                <LogIn className="h-5 w-5" />
                            </Link>
                        </Button>
                    )}
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