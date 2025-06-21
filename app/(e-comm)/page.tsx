import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { auth } from '@/auth';
import BackToTopButton from '@/components/ecomm/BackToTopButton';

import { getCategories } from './homepage/actions/getCategories';
// import { generatePageMetadata } from '../../lib/seo-utils';
import { getPromotions } from './homepage/actions/getPromotions';
import {
  fetchSuppliersWithProducts,
} from './homepage/actions/getSuppliersWithProducts';
import { UserRole } from '@prisma/client';
import { PageProps } from '@/types/commonTypes';

// Import our new optimized components with high priority
const OptimizedHeroSection = dynamic(() => import('./homepage/component/slider/OptimizedHeroSection'), {
  ssr: true,
});

const CriticalCSS = dynamic(() => import('./homepage/component/CriticalCSS'), {
  ssr: true,
});

const PreloadScript = dynamic(() => import('./homepage/component/PreloadScript'), {
  ssr: true,
});

// Critical above-the-fold components with optimized loading

// Main category section with priority loading
const RealCategoryListClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.RealCategoryListClient),
  {
    ssr: true,
    loading: () => (
      <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
        <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
        <div className='flex gap-6 overflow-x-auto pb-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-48 w-72 flex-shrink-0 rounded-2xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
          ))}
        </div>
      </div>
    ),
  },
);

// Enhanced featured promotions component
const FeaturedPromotions = dynamic(() => import('./homepage/component/FeaturedPromotions'), {
  ssr: true,
  loading: () => (
    <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
      <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-72 rounded-2xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
        ))}
      </div>
    </div>
  ),
});

// Lower priority supplier components
const CategoryListClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CategoryListClient),
  {
    ssr: true,
    loading: () => (
      <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
        <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-40 rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
          ))}
        </div>
      </div>
    ),
  },
);

// Update the user type to include role
type UserWithRole = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  // ... other fields ...
};

// Dynamically import components with enhanced loading states
const CheckUserActivationClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CheckUserActivationClient),
  { ssr: true }
);

const CheckUserLocationClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CheckUserLocationClient),
  { ssr: true }
);

const ClearButton = dynamic(() => import('./homepage/component/supplier/ClearButton'), {
  ssr: true,
  loading: () => <div className='h-12 w-full animate-pulse rounded-xl bg-gradient-to-r from-card to-card/70 shadow-md'></div>,
});

// Use dynamic imports with optimized component for product section
const ProductsSection = dynamic(() => import('./homepage/component/product/ProductsSection'), {
  ssr: true,
  loading: () => (
    <div className='container mx-auto p-6'>
      <div className='mb-8 h-10 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='relative h-96 animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg'
          >
            <div className='h-48 bg-gradient-to-br from-muted to-muted/70'></div>
            <div className='space-y-4 p-6'>
              <div className='h-5 w-3/4 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
              <div className='h-4 w-1/2 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
              <div className='h-12 rounded-xl bg-gradient-to-r from-muted to-muted/50'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

// Generate metadata dynamically
// export async function generateMetadata() {
//   return generatePageMetadata('ecomm');
// }

export default async function HomePage({ searchParams }: PageProps<Record<string, never>, { slug?: string }>) {
  const resolvedSearchParams = await searchParams;
  const slug = resolvedSearchParams?.slug || '';
  const session = await auth();

  // Fetch data in parallel for better performance
  const [supplierWithItems, promotionsData, categories] = await Promise.all([
    fetchSuppliersWithProducts(),
    getPromotions(),
    getCategories(),
  ]);

  // Create optimized hero slides from promotions with better data structure
  const heroSlides = promotionsData.length > 0
    ? promotionsData.map(promo => ({
      id: promo.id,
      title: promo.name || 'عرض خاص مميز',
      subtitle: 'اكتشف أفضل المنتجات بأسعار لا تُقاوم',
      description: 'تسوق الآن واستمتع بأفضل العروض والخصومات الحصرية على مجموعة واسعة من المنتجات عالية الجودة',
      imageUrl: promo.imageUrl || '/fallback/fallback.avif',
      ctaText: 'تسوق الآن',
      ctaLink: '/categories',
      discountPercentage: 30,
      isActive: promo.isActive,
    }))
    : [
      {
        id: 'fallback-hero',
        title: 'مرحباً بك في متجرنا الإلكتروني',
        subtitle: 'اكتشف أفضل المنتجات بأسعار مناسبة',
        description: 'تسوق من مجموعة واسعة من المنتجات عالية الجودة مع ضمان أفضل الأسعار وخدمة توصيل سريعة',
        imageUrl: '/fallback/fallback.avif',
        ctaText: 'استكشف المنتجات',
        ctaLink: '/categories',
        discountPercentage: 25,
        isActive: true,
      }
    ];

  // Enhanced promotions with fallback data
  const displayPromotions =
    promotionsData.length > 0
      ? promotionsData
      : [
        {
          id: 'promo-1',
          name: 'مجموعة الصيف الجديدة',
          imageUrl: '/fallback/fallback.avif',
          isActive: true,
        },
        {
          id: 'promo-2',
          name: 'عروض الربيع 2025',
          imageUrl: '/fallback/fallback.webp',
          isActive: true,
        },
        {
          id: 'promo-3',
          name: 'تخفيضات نهاية الموسم',
          imageUrl: '/fallback/fallback.avif',
          isActive: true,
        },
      ];

  return (
    <>
      {/* Inline Critical CSS for above-the-fold content */}
      <CriticalCSS />

      <div className='container mx-auto flex flex-col gap-8 bg-background text-foreground px-4 sm:px-6 lg:px-8'>
        {/* Performance optimization script */}
        <PreloadScript />

        {/* User-specific components */}
        {session && (
          <Suspense fallback={null}>
            <CheckUserActivationClient user={session.user as Partial<UserWithRole>} />
            <CheckUserLocationClient user={session.user as Partial<UserWithRole>} />
          </Suspense>
        )}

        {/* Enhanced Hero Section with compelling value proposition */}
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-label="Hero banner">
          <OptimizedHeroSection slides={heroSlides} />
        </section>

        {/* Main Categories Section */}
        <section className="space-y-6" aria-label="Product categories">
          <Suspense
            fallback={
              <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
                <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='h-40 rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
                  ))}
                </div>
              </div>
            }
          >
            <RealCategoryListClient
              categories={categories}
              title="تسوق حسب الفئة"
              description="استكشف مجموعتنا المتنوعة من المنتجات حسب الفئة"
            />
          </Suspense>
        </section>

        {/* Featured Promotions Section */}
        <section className="space-y-6" aria-label="Featured promotions">
          <Suspense
            fallback={
              <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
                <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-72 rounded-2xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
                  ))}
                </div>
              </div>
            }
          >
            <FeaturedPromotions promotions={displayPromotions} />
          </Suspense>
        </section>

        {/* Products Section */}
        <section className="space-y-6" aria-label="Featured products">
          <Suspense
            fallback={
              <div className='container mx-auto p-6'>
                <div className='mb-8 h-10 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className='relative h-96 animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg'
                    >
                      <div className='h-48 bg-gradient-to-br from-muted to-muted/70'></div>
                      <div className='space-y-4 p-6'>
                        <div className='h-5 w-3/4 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                        <div className='h-4 w-1/2 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                        <div className='h-12 rounded-xl bg-gradient-to-r from-muted to-muted/50'></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ProductsSection slug={slug} />
          </Suspense>
        </section>

        {/* Categories Section (Secondary) */}
        <section className="space-y-6" aria-label="All categories">
          <Suspense
            fallback={
              <div className='w-full animate-pulse rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg'>
                <div className='mb-6 h-8 w-1/3 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='h-40 rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-md'></div>
                  ))}
                </div>
              </div>
            }
          >
            <CategoryListClient
              suppliers={supplierWithItems.companyData || []}
              cardDescription='اكتشف المنتجات من الموردين الموثوقين وتمتع بأفضل الخيارات المتاحة'
              cardHeader='قائمة الموردين المميزة'
            />
          </Suspense>
        </section>

        {/* Suppliers Section */}
        <section className="space-y-6" aria-label="Our suppliers">
          <Suspense fallback={<div className='h-12 w-full animate-pulse rounded-xl bg-gradient-to-r from-card to-card/70 shadow-md'></div>}>
            <ClearButton slugString={slug} />
          </Suspense>
        </section>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </>
  );
}
