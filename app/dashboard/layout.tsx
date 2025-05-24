import { redirect } from 'next/navigation';

import AppSidebar
  from '@/app/dashboard/components/AppSidebar'; // Reverted to Old sidebar
import { auth } from '@/auth';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserRole } from '@prisma/client';

import CurrentLinkTitle from './orders/component/CurrentLinkTitle';
import PusherNotify from './orders/component/pusherNotifaction/PusherNotify';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This layout is used for the dashboard pages
  const session = await auth();
  // Fix: Accept both string and enum for role, and handle legacy lowercase roles
  const userRole = (session?.user as { role?: string })?.role;
  if (!session?.user || (userRole !== UserRole.ADMIN && userRole !== 'ADMIN')) {
    return redirect('/auth/login');
  }
  console.log(session)



  // Hardcode RTL for now; in the future, detect from language/i18n
  return (
    <SidebarProvider defaultOpen={true}>
      <div className='flex min-h-screen w-full bg-background ' dir='rtl'>
        <AppSidebar /> {/* Reverted to use the old sidebar */}
        <div className='flex min-h-screen flex-1 flex-col'>
          {/* Sticky header */}
          <header className='sticky top-0 z-40 flex items-center justify-between border-b bg-secondary px-6 py-1'>
            <div className='flex items-center gap-2'>
              <SidebarTrigger />
              <CurrentLinkTitle />
            </div>
            <PusherNotify />
          </header>
          {/* Main content */}
          <main className='w-full flex-1 overflow-auto bg-background p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
