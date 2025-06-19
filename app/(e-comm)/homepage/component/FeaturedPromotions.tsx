'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Promotion {
    id: string;
    name: string; // Changed from title to name to match Offer model
    description?: string | null;
    imageUrl?: string | null;
    discountPercentage?: number | null; // Changed to match Offer model
    isActive: boolean; // Changed to match Offer model
}

interface FeaturedPromotionsProps {
    promotions: Promotion[];
}

export default function FeaturedPromotions({ promotions }: FeaturedPromotionsProps) {
    // Only show active offers
    const activePromotions = promotions.filter(offer =>
        offer.isActive
    );

    if (activePromotions.length === 0) return null;

    return (
        <section className="my-8">
            <h2 className="mb-4 text-2xl font-bold">العروض المميزة</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activePromotions.map((offer, index) => (
                    <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
                    >
                        {/* Offer Image */}
                        <div className="relative aspect-video overflow-hidden">
                            {offer.imageUrl ? (
                                <Image
                                    src={offer.imageUrl}
                                    alt={offer.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-r from-primary/30 to-primary/10" />
                            )}

                            {/* Discount Badge */}
                            {offer.discountPercentage && (
                                <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                                    {offer.discountPercentage}% خصم
                                </div>
                            )}
                        </div>

                        {/* Offer Details */}
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold">{offer.name}</h3>
                            {offer.description && (
                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                    {offer.description}
                                </p>
                            )}

                            {/* View Products Button */}
                            <Link
                                href={`/offers/${encodeURIComponent(offer.name.toLowerCase().replace(/ /g, '-'))}-${offer.id}`}
                                className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                تصفح المنتجات
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}