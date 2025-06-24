// HeaderClient.tsx
'use client';

import {
  useEffect,
  useState
} from 'react';
import { usePathname } from 'next/navigation';
import BackButton from './BackButton';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks/use-media-query';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Bell } from 'lucide-react';

const CartIcon = dynamic(() => import('./CartIcon'), {
  ssr: false,
  loading: () => <Skeleton className='h-9 w-9 rounded-full' />,
});

const UserMenu = dynamic(() => import('./UserMenu'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center gap-2'>
      <Skeleton className='h-9 w-9 rounded-full' />
      <Skeleton className='h-4 w-20' />
    </div>
  ),
});

interface HeaderClientProps {
  user: any; // Using 'any' for now, will be properly typed in child components
  alerts: any[];
}

export default function HeaderClient({ user, alerts }: HeaderClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Only show BackButton on sub-routes, not on homepage
  const isHomepage = pathname === '/';
  const showBackButton = !isHomepage;

  return (
    <>
      <div className='flex items-center gap-4 md:gap-6'>
        {/* On mobile, show only UserMenu trigger; on desktop, show full header */}
        {isMobile ? (
          <UserMenu user={user} alerts={alerts} aria-label="User account menu (mobile)" />
        ) : (
          <>
            {showBackButton && (
              <span>
                <BackButton />
              </span>
            )}
            <CartIcon />
            <NotificationDropdown alerts={alerts}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
              </Button>
            </NotificationDropdown>
            <UserMenu user={user} alerts={alerts} aria-label="User account menu" />
          </>
        )}
      </div>
    </>
  );
}
