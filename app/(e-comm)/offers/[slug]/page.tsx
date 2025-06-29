import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { ProductCardAdapter } from '@/components/product/cards';

import db from '@/lib/prisma';
import { PageProps } from '@/types/commonTypes';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const offer = await db.offer.findUnique({ where: { slug } });
    if (!offer) {
        return { title: 'العرض غير موجود' };
    }
    return {
        title: offer.name,
        description: offer.description || `تصفح المنتجات ضمن عرض ${offer.name}`,
        openGraph: {
            title: offer.name,
            description: offer.description || `تصفح المنتجات ضمن عرض ${offer.name}`,
            images: offer.bannerImage ? [{ url: offer.bannerImage, alt: offer.name }] : [],
        },
    };
}

export default async function OfferPage({ params }: PageProps<{ slug: string }>) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const offer = await db.offer.findUnique({
        where: { slug },
        include: {
            productAssignments: {
                include: { product: true },
            },
        },
    });
    if (!offer) notFound();

    const products = offer.productAssignments.map((op: any) => op.product);

    return (
        <div className="container mx-auto bg-background px-4 py-8 text-foreground">
            <BackButton variant="default" />
            <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow mt-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        {offer.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        {offer.bannerImage && (
                            <div className="relative w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden">
                                <Image
                                    src={offer.bannerImage}
                                    alt={offer.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority
                                />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col gap-2">
                            {offer.header && <h2 className="text-2xl font-bold">{offer.header}</h2>}
                            {offer.subheader && <p className="text-muted-foreground">{offer.subheader}</p>}
                            {offer.description && <p className="mt-2">{offer.description}</p>}
                            <div className="flex items-center gap-4 mt-2">
                                {offer.hasDiscount && offer.discountPercentage ? (
                                    <span className="rounded bg-feature-commerce-soft px-3 py-1 text-feature-commerce font-semibold">
                                        خصم {offer.discountPercentage}%
                                    </span>
                                ) : (
                                    <span className="rounded bg-muted px-3 py-1 text-muted-foreground">بدون خصم</span>
                                )}
                                <span className={`rounded px-3 py-1 font-semibold ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {offer.isActive ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">ترتيب العرض: {offer.displayOrder}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="mt-12 mb-2 text-2xl font-bold">المنتجات ضمن العرض</h2>
            <div className="mb-6 text-muted-foreground text-sm font-medium">عدد المنتجات: {products.length}</div>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCardAdapter
                            key={product.id}
                            product={product}
                            discountPercentage={offer.hasDiscount && offer.discountPercentage !== null ? offer.discountPercentage : undefined}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-12">لا توجد منتجات مرتبطة بهذا العرض حالياً.</div>
            )}
        </div>
    );
} 