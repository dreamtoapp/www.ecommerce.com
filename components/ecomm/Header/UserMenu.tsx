"use client"

import {
  useState,
} from 'react';

import {
  LogIn,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';





import {
  Sheet,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

import { UserRole } from '@/constant/enums';





import { useMediaQuery } from '@/hooks/use-media-query';

// Define the shape of a single alert
type Alert = {
  id: string;
  type: 'warning' | 'destructive';
  title: string;
  description: string;
  href: string;
};

interface UserMenuProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  } | null;
  alerts: Alert[]; // Add alerts prop
  'aria-label'?: string;
}



const UserMenuSheetContent = dynamic(() => import('./UserMenuSheetContent'), {
  ssr: false,
  loading: () => null,
});

export default function UserMenu({ user, alerts }: UserMenuProps) {
  const { data: session, status } = useSession();



  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);

  if (status === 'loading') {
    return (
      <Skeleton className="h-9 w-9 rounded-full" />
    );
  }

  if (!session || !user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>تسجيل الدخول</span>
        </Link>
      </Button>
    );
  }

  const { name, image } = user;



  // Preload UserMenuSheetContent on hover/focus for better UX
  const handleTriggerMouseEnter = () => {
    if (!menuLoaded && !isMenuLoading) {
      setIsMenuLoading(true);
      import('./UserMenuSheetContent').then(() => {
        setMenuLoaded(true);
        setIsMenuLoading(false);
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !menuLoaded) {
      setIsMenuLoading(true);
      import('./UserMenuSheetContent').then(() => {
        setMenuLoaded(true);
        setIsMenuLoading(false);
        setIsOpen(true);
      });
      return;
    }
    setIsOpen(open);
  };

  return (
    <div className='flex items-center gap-3'>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          {isMobile ? (
            isMenuLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
                onMouseEnter={handleTriggerMouseEnter}
                onFocus={handleTriggerMouseEnter}
              >
                <Menu className="h-7 w-7" />
              </Button>
            )
          ) : (
            isMenuLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Button
                variant="ghost"
                className="p-0 focus:outline-none bg-transparent hover:bg-transparent active:bg-transparent"
                onMouseEnter={handleTriggerMouseEnter}
                onFocus={handleTriggerMouseEnter}
              >
                <Avatar className="h-10 w-10 border-2 border-border shadow-md bg-transparent">
                  <AvatarImage
                    src={image || "/default-avatar.png"}
                    alt={name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xl">
                    {name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            )
          )}
        </SheetTrigger>
        {isOpen && menuLoaded && (
          <UserMenuSheetContent
            user={user}
            alerts={alerts}
            isMobile={isMobile}
          />
        )}
      </Sheet>
    </div>
  )
}
