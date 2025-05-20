import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import db from '@/lib/prisma';
import { iconVariants } from '@/lib/utils';

import ProductViewContent from './product-view-content';

interface ProductViewPageProps {
  params: Promise<{ id: string }>;
}

async function getFullProductDetails(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        categoryAssignments: {
          include: { category: true },
        },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw new Error('Failed to load product data');
  }
}

export default async function ProductViewPage({ params }: ProductViewPageProps) {
  try {
    // Resolve params promise
    const { id } = await params;

    // Fetch product data
    const product = await getFullProductDetails(id);

    if (!product) {
      notFound();
    }

    // Calculate statistics
    const totalReviews = product.reviews.length;
    const averageRating = totalReviews > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const productWithStats = {
      ...product,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: totalReviews,
    };

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            تفاصيل المنتج: {product.name}
          </h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/products-control" className="flex items-center gap-2">
              <ArrowRight className={iconVariants({ size: 'sm' })} />
              <span>العودة إلى قائمة المنتجات</span>
            </Link>
          </Button>
        </div>
        <ProductViewContent product={productWithStats} />
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل بيانات المنتج
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}