'use client';

import dynamic from 'next/dynamic';

import { Separator } from '@/components/ui/separator';

import AboutUs from './AboutUs';
import ContactInfo from './ContactInfo';
import Copyright from './Copyright';
import QuickLinks from './QuickLinks';
import SocialMedia from './SocialMedia';

// Dynamic import for Newsletter (client-only, interactive)
const Newsletter = dynamic(() => import('./Newsletter'), {
  ssr: false,
  loading: () => <div>Loading newsletter…</div>,
});

// WhatsApp functionality moved to mobile action buttons

// Support ping functionality moved to mobile action buttons

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

const Footer = ({
  aboutus,
  email,
  phone,
  address,
  latitude,
  longitude,
  facebook,
  instagram,
  twitter,
  linkedin,
  companyName,
}: FooterProps) => {
  return (
    <footer className='bg-background py-12 text-foreground'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Footer Grid */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <AboutUs aboutus={aboutus} companyName={companyName} />
          <QuickLinks />
          <ContactInfo
            email={email}
            phone={phone}
            address={address}
            latitude={latitude || ''}
            longitude={longitude || ''}
          />

          <Newsletter />
        </div>

        <Separator className='my-6' />

        <SocialMedia
          facebook={facebook}
          instagram={instagram}
          twitter={twitter}
          linkedin={linkedin}
        />

        <Copyright />
        {/* --- Floating Support & WhatsApp moved to mobile action buttons --- */}
        {/* Support and WhatsApp functionality now integrated into mobile navigation */}
      </div>
    </footer>
  );
};

export default Footer;
