'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  BadgeAlert,
  ChevronRight,
  Heart,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  User,
  Wallet,
} from 'lucide-react';
import { Session } from 'next-auth';

import Link from '@/components/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserRole } from '@/constant/enums';
import { iconVariants } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

import { userLogOut } from '../../../app/(e-comm)/auth/action';

interface UserMenuProps {
  session: Session | null;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const { clearCart, getTotalItems } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true);
      clearCart();
      await new Promise((res) => setTimeout(res, 500));
    } finally {
      setIsClearingCart(false);
    }
  };

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await userLogOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!session) {
    return (
      <Button variant='outline' asChild className='group border-primary/20 hover:border-primary/40 hover:bg-primary/10'>
        <Link href='/auth/login' className='flex items-center gap-2 px-4 py-2'>
          <LogIn className={iconVariants({ size: 'xs', className: 'text-primary group-hover:scale-110' })} />
          <span className='font-medium text-primary'>دخول</span>
        </Link>
      </Button>
    );
  }

  const navLinks = [
    {
      href: `/user/profile?id=${session.user.id}`,
      label: 'الملف الشخصي',
      icon: <User className={iconVariants({ size: 'xs', className: 'text-primary' })} />,
    },
    {
      href: `/user/statement?id=${session.user.id}`,
      label: 'الحركات المالية',
      icon: <Wallet className={iconVariants({ size: 'xs', className: 'text-emerald-500' })} />,
    },
    {
      href: `/user/purchase-history`,
      label: 'سجل المشتريات',
      icon: <ShoppingBag className={iconVariants({ size: 'xs', className: 'text-blue-500' })} />,
    },
    {
      href: `/user/ratings`,
      label: 'تقييماتي',
      icon: <Star className={iconVariants({ size: 'xs', className: 'text-amber-500' })} />,
    },
    {
      href: `/user/wishlist`,
      label: 'المفضلة',
      icon: <Heart className={iconVariants({ size: 'xs', className: 'text-red-500' })} />,
    },
    {
      href: `/user/setting`,
      label: 'الاعدادات',
      icon: <Settings className={iconVariants({ size: 'xs', className: 'text-secondary' })} />,
    },
    ...(session.user.role === UserRole.ADMIN
      ? [{
        href: `/dashboard`,
        label: 'لوحة التحكم',
        icon: <Lock className={iconVariants({ size: 'xs', className: 'text-purple-500' })} />,
      }]
      : []),
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-3 p-3'>
          <Avatar className='h-10 w-10 border-2 border-primary/10 group-hover:border-primary/50 group-hover:shadow-md'>
            <AvatarImage src={session.user.image || '/default-avatar.png'} alt={session.user.name || 'User'} />
            <AvatarFallback className='bg-muted/10 text-primary'>
              {session.user.name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className='hidden text-sm font-semibold sm:inline'>{session.user.name}</span>
        </Button>
      </SheetTrigger>

      <SheetContent side='right' className='w-[320px] p-4'>
        <SheetTitle className='text-lg font-semibold mb-2 mt-5'>حسابي</SheetTitle>
        <SheetHeader className='mb-4 text-right'>
          <div className='flex items-center justify-between border-b pb-2'>
            <span className='text-sm font-semibold'>مرحباً، {session.user.name}</span>
            {session.user.role === UserRole.ADMIN && (
              <span className='flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive'>
                <BadgeAlert className={iconVariants({ size: 'xs' })} />
                مدير النظام
              </span>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className='h-[calc(100vh-180px)] pr-2'>
          <div className='space-y-1'>
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className='flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent/20 transition'
              >
                <div className='flex items-center gap-3'>
                  <div className='rounded-md bg-muted p-2'>{icon}</div>
                  <span className='text-sm'>{label}</span>
                </div>
                <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
              </Link>
            ))}

            {getTotalItems() > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isClearingCart}
                className='flex w-full items-center justify-between rounded-md px-3 py-2 text-destructive hover:bg-destructive/10 transition'
              >
                <div className='flex items-center gap-3'>
                  <div className='rounded-md bg-destructive/10 p-2'>
                    {isClearingCart ? (
                      <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'text-destructive' })} />
                    ) : (
                      <ShoppingCart className={iconVariants({ size: 'xs', className: 'text-destructive' })} />
                    )}
                  </div>
                  <span className='text-sm'>
                    {isClearingCart ? 'جاري إفراغ السلة...' : 'إفراغ سلة التسوق'}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={logOut}
              disabled={isLoggingOut}
              className='flex w-full items-center justify-between rounded-md px-3 py-2 text-destructive hover:bg-destructive/10 transition'
            >
              <div className='flex items-center gap-3'>
                <div className='rounded-md bg-destructive/10 p-2'>
                  {isLoggingOut ? (
                    <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'text-destructive' })} />
                  ) : (
                    <LogOut className={iconVariants({ size: 'xs', className: 'text-destructive' })} />
                  )}
                </div>
                <span className='text-sm'>
                  {isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
                </span>
              </div>
            </button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
