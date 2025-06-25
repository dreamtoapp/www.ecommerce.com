import Fotter from '../../components/ecomm/Fotter/Fotter';
import Header from '../../components/ecomm/Header/Header';
import MobileBottomNav from '../../components/ecomm/Header/MobileBottomNav';
import MobileHeader from '../../components/ecomm/Header/MobileHeader';
// app/(ecommerce)/layout.tsx
import { TooltipProvider } from '../../components/ui/tooltip';
import getSession from '../../lib/getSession';
import { CartProvider } from '../../providers/cart-provider';
import { companyInfo } from './homepage/actions/companyDetail';
import { userProfile } from './user/profile/action/action';
import { getUnreadNotificationCount } from './user/notifications/actions/getUserNotifications';

export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const companyData = await companyInfo();
  const session = await getSession();
  const user = session?.user;

  let fullUser = null;
  let notificationCount = 0;

  if (user?.id) {
    fullUser = await userProfile(user.id);
    notificationCount = await getUnreadNotificationCount(user.id);
  }

  const alerts = [];
  if (fullUser) {
    if (!fullUser.address) {
      alerts.push({
        id: 'location-alert',
        type: 'warning' as const,
        title: 'أكمل ملفك الشخصي',
        description: 'الرجاء إضافة عنوانك لتسهيل عملية التوصيل.',
        href: '/user/profile?tab=address',
      });
    }
    if (!fullUser.emailVerified) {
      alerts.push({
        id: 'activation-alert',
        type: 'destructive' as const,
        title: 'تفعيل الحساب',
        description: 'الرجاء تفعيل حسابك للاستفادة من جميع الميزات.',
        href: '/auth/verify',
      });
    }
  }

  return (
    <TooltipProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header
              user={fullUser}
              logo={companyData?.logo || ''}
              logoAlt={companyData?.fullName || 'Dream to app'}
            />
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <MobileHeader
              user={fullUser ? {
                id: fullUser.id,
                name: fullUser.name,
                email: fullUser.email,
                image: fullUser.image,
                role: fullUser.role as any,
                emailVerified: fullUser.emailVerified,
              } : null}
              logo={companyData?.logo || ''}
              logoAlt={companyData?.fullName || 'Dream to app'}
              isLoggedIn={!!session}
              alerts={alerts}
              unreadCount={notificationCount}
            />
          </div>
          <MobileBottomNav
            isLoggedIn={!!session}
            userImage={fullUser?.image}
            userName={fullUser?.name}
            whatsappNumber={companyData?.whatsappNumber}
            userId={user?.id}
          />

          {/* Mobile-First Main Content */}
          <main className='flex-grow'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
              {children}
            </div>
          </main>
          <Fotter
            companyName={companyData?.fullName}
            aboutus={companyData?.bio}
            email={companyData?.email}
            phone={companyData?.phoneNumber}
            address={companyData?.address}
            facebook={companyData?.facebook}
            instagram={companyData?.instagram}
            twitter={companyData?.twitter}
            linkedin={companyData?.linkedin}
          />
        </div>
      </CartProvider>
    </TooltipProvider>
  );
}
