import Fotter from '../../components/ecomm/Fotter/Fotter';
import Header from '../../components/ecomm/Header/Header';
import MobileHeader from '../../components/ecomm/Header/MobileHeader';
// app/(ecommerce)/layout.tsx
import { TooltipProvider } from '../../components/ui/tooltip';
import getSession from '../../lib/getSession';
import { CartProvider } from '../../providers/cart-provider';
import { companyInfo } from './homepage/actions/companyDetail';

export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const companyData = await companyInfo();
  // const session = await auth()
  const session = await getSession();

  return (
    <TooltipProvider>
      <CartProvider>
        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header
            session={session}
            logo={companyData?.logo || ''}
            logoAlt={companyData?.fullName || 'Dream to app'}
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader
            cartCount={0} // TODO: Get from cart context
            wishlistCount={0} // TODO: Get from wishlist context
            notificationCount={0} // TODO: Get from notifications
            isLoggedIn={!!session}
            currentLanguage="ar"
            supportEnabled={true}
            whatsappNumber={companyData?.whatsappNumber}
            userId={session?.user?.id || 'guest'}
          />
        </div>

        {/* Mobile-First Main Content */}
        <main className='min-h-screen'>
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
      </CartProvider>
    </TooltipProvider>
  );
}
