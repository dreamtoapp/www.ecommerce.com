import './globals.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';
import { cairo } from './font';

import { Directions } from '../constant/enums';
import { ThemeProvider } from '../provider/theme-provider';
import WebVitalsCollector from '@/components/seo/WebVitalsCollector';

export const metadata: Metadata = {
  title: 'Dream To App',
  manifest: '/manifest.webmanifest', // Automatically mapped
  // themeColor: "#2196f3",
  appleWebApp: {
    capable: true,
    title: 'Dream To App',
    statusBarStyle: 'black-translucent',
  },
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = 'ar'; // Hardcoded for now
  const dir = Directions.RTL; // Set direction dynamically later

  return (
    // <SessionProvider>
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {/* <head>{head()}</head> */}
      <body className={`${cairo.className} min-h-screen bg-background antialiased`}>
        <WebVitalsCollector />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <main className='min-h-screen'>{children}</main>
          <Toaster position='top-center' />
        </ThemeProvider>
        {/* </NotificationsProvider> */}
      </body>
    </html>
    // </SessionProvider>
  );
}
