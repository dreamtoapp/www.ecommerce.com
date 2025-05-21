import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getPromotionPageData,
} from '@/app/(e-comm)/promotions/actions/promotion-service';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/databaseTypes';;

import ProductCardAdapter from '../../categories/components/ProductCardAdapter';
import { applyPromotionsToProducts } from '../actions/promotionService';

// Extract real ID from slug-format URL parameter




export default async function PromotionPage({ params }: { params: Promise<{ id: string }> }) {
    const promotionIdOrSlug = (await params).id;

    const { promotion, products } = (await getPromotionPageData(promotionIdOrSlug)) || { promotion: null, products: [] };

    if (!promotion) {
        notFound();
    }

    const productsWithInStock = products.map(product => ({
        ...product,
        inStock: !product.outOfStock,
        description: product.description || '',
    }) as Product);

    // Apply promotion to products - this ensures discounts are correctly calculated
    const productsWithPromotion = await applyPromotionsToProducts(productsWithInStock);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Banner */}
            <div className="relative mb-8 overflow-hidden rounded-xl">
                {promotion.imageUrl ? (
                    <div className="relative aspect-[3/1] w-full">
                        <Image
                            src={promotion.imageUrl}
                            alt={promotion.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                ) : (
                    <div className="aspect-[3/1] w-full bg-gradient-to-r from-primary/30 to-primary/10" />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-3xl font-bold md:text-4xl">{promotion.title}</h1>
                    {promotion.description && (
                        <p className="mt-2 max-w-2xl">{promotion.description}</p>
                    )}

                    {/* Promotion Details */}
                    <div className="mt-4 flex flex-wrap gap-4">
                        {promotion.discountValue && promotion.discountType && (
                            <div className="rounded-full bg-red-500 px-4 py-2 font-bold">
                                {promotion.discountType === 'PERCENTAGE'
                                    ? `${promotion.discountValue}% خصم`
                                    : `${promotion.discountValue} ريال خصم`}
                            </div>
                        )}

                        {promotion.endDate && (
                            <div className="rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
                                ينتهي في: {new Date(promotion.endDate).toLocaleDateString('ar-SA')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumb navigation */}
            <nav className="mb-6 flex items-center text-sm">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                    الرئيسية
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="font-medium">{promotion.title}</span>
            </nav>

            {/* Products Grid */}
            <h2 className="mb-6 text-2xl font-bold">منتجات العرض</h2>

            {productsWithPromotion.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productsWithPromotion.map((product, idx) => (
                        <ProductCardAdapter
                            key={product.id}
                            product={product}
                            index={idx}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl bg-muted/20 py-12 text-center">
                    <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-muted p-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        لا توجد منتجات متاحة في هذا العرض حاليًا
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        يرجى التحقق مرة أخرى لاحقًا أو استكشاف عروض أخرى
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/">العودة إلى الرئيسية</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}