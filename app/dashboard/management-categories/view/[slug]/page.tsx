import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BackButton from '@/components/BackButton';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/databaseTypes';;

import { getCategoryBySlug } from '../../actions/get-category-by-slug';
import {
  getProductsByCategorySlug,
} from '../../actions/get-products-by-category-slug';

const PRODUCTS_PER_PAGE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Resolve both promises in parallel
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const slug = decodeURIComponent(resolvedParams.slug);
  const currentPage = getValidatedPageNumber(resolvedSearchParams.page);

  try {
    // Parallel fetch pattern for better performance
    const [category, productsData] = await Promise.all([
      getCategoryData(slug),
      getProductsData(slug, currentPage)
    ]);

    return (
      <section className="space-y-6">
        <div className="flex items-center mb-4">
          <BackButton />
        </div>

        <CategoryInfoSection category={category} />
        <Separator />

        {productsData.products.length > 0 ? (
          <ProductsSection
            products={productsData.products}
            slug={slug}
            currentPage={currentPage}
            totalPages={productsData.totalPages}
          />
        ) : (
          <EmptyStateSection />
        )}
      </section>
    );
  } catch (error) {
    console.error('Category page error:', error);
    notFound();
  }
}

// Helper functions
function getValidatedPageNumber(pageParam: unknown): number {
  if (typeof pageParam !== 'string') return 1;
  const page = parseInt(pageParam, 10);
  return Math.max(1, Number.isNaN(page) ? 1 : page);
}

async function getCategoryData(slug: string) {
  const result = await getCategoryBySlug(slug);
  if (!result.success || !result.category) throw new Error('Category not found');
  return result.category;
}

async function getProductsData(slug: string, page: number) {
  const result = await getProductsByCategorySlug(slug, page, PRODUCTS_PER_PAGE);
  if (!result.success) throw new Error('Failed to fetch products');

  // Transform products to match Product type
  const products = (result.products || []).map(product => ({
    ...product,
    size: product.size ?? null,
    details: product.details ?? null,
    compareAtPrice: product.compareAtPrice ?? null,
    costPrice: product.costPrice ?? null,
  }));

  return {
    products,
    totalPages: result.totalPages || 1
  };
}

// Sub-components
function CategoryInfoSection({ category }: { category: Awaited<ReturnType<typeof getCategoryData>> }) {
  return (
    <div className="p-4 bg-card border rounded-lg">
      <h2 className="text-xl font-semibold mb-2 sm:text-2xl">
        عرض الصنف: {category.name}
      </h2>

      {category.imageUrl && (
        <div className="relative mx-auto mb-3 h-32 w-full max-w-sm overflow-hidden rounded-md md:h-40">
          <Image
            src={category.imageUrl}
            alt={`صورة لـ ${category.name}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {category.description && (
        <p className="text-sm text-muted-foreground md:text-base">
          {category.description}
        </p>
      )}
    </div>
  );
}

function ProductsSection({
  products,
  slug,
  currentPage,
  totalPages
}: {
  products: Product[];
  slug: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <>
      <h3 className="text-lg font-semibold sm:text-xl mb-4">
        المنتجات في هذا الصنف:
      </h3>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationControls
        slug={slug}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}

function PaginationControls({
  slug,
  currentPage,
  totalPages
}: {
  slug: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <>
      <div className="mt-10 flex justify-center space-x-4">
        {currentPage > 1 && (
          <PaginationLink slug={slug} page={currentPage - 1} label="الصفحة السابقة" />
        )}

        {currentPage < totalPages && (
          <PaginationLink slug={slug} page={currentPage + 1} label="الصفحة التالية" />
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        عرض صفحة {currentPage} من {totalPages}
      </div>
    </>
  );
}

function PaginationLink({
  slug,
  page,
  label
}: {
  slug: string;
  page: number;
  label: string;
}) {
  return (
    <Button asChild variant="outline">
      <Link href={`/dashboard/categories/view/${slug}?page=${page}`}>
        {label}
      </Link>
    </Button>
  );
}

function EmptyStateSection() {
  return (
    <div className="py-10 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="mx-auto mb-3 text-gray-400"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>

      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        لا توجد منتجات في هذا الصنف حاليًا.
      </p>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        يرجى التحقق مرة أخرى لاحقًا أو استكشاف أصناف أخرى.
      </p>

      <Button asChild className="mt-4">
        <Link href="/dashboard/categories">
          العودة إلى قائمة الأصناف
        </Link>
      </Button>
    </div>
  );
}