'use server';

import db from '@/lib/prisma';
import { Product } from '@/types/product';
import { PromotionType } from '@prisma/client';

export interface DiscountedProduct extends Product {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  promotionId?: string;
  promotionTitle?: string;
  inStock: boolean;
}

// Define allowed product promotion types
const PRODUCT_PROMO_TYPES = ['PERCENTAGE_PRODUCT', 'FIXED_PRODUCT'] as const;
type ProductPromotionType = typeof PRODUCT_PROMO_TYPES[number];

/**
 * Apply the best applicable promotion to each product and return updated pricing info.
 */
export async function applyPromotionsToProducts(products: Product[]): Promise<DiscountedProduct[]> {
  const now = new Date();

  // Fetch all active promotions
  const activePromotions = await db.promotion.findMany({
    where: {
      active: true,
      OR: [{ endDate: null }, { endDate: { gte: now } }],
      AND: [{ startDate: null }, { startDate: { lte: now } }],
    },
  });

  return products.map((product) => {
    const originalPrice = product.price;

    // Filter promotions that apply to this product and are of the correct type
    const applicablePromos = activePromotions.filter(
      (promo): promo is typeof promo & { type: ProductPromotionType } =>
        promo.productIds.includes(product.id) && PRODUCT_PROMO_TYPES.includes(promo.type as ProductPromotionType)
    );

    if (applicablePromos.length === 0) {
      return {
        ...product,
        originalPrice,
        discountedPrice: originalPrice,
        discountPercentage: 0,
        inStock: !product.outOfStock,
      };
    }

    // Select the promotion with the highest discount
    const bestPromo = applicablePromos.reduce((best, current) => {
      const discount = getDiscountAmount(current, originalPrice);
      const bestDiscount = getDiscountAmount(best, originalPrice);
      return discount > bestDiscount ? current : best;
    });

    const discountAmount = getDiscountAmount(bestPromo, originalPrice);
    const discountedPrice = Math.max(0, originalPrice - discountAmount);
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

    return {
      ...product,
      originalPrice,
      discountedPrice,
      discountPercentage,
      promotionId: bestPromo.id,
      promotionTitle: bestPromo.title,
      inStock: !product.outOfStock,
    };
  });
}

/**
 * Utility to calculate discount amount based on promotion type.
 */
function getDiscountAmount(promo: { type: PromotionType; discountValue: number | null }, price: number): number {
  if (promo.discountValue === null || promo.discountValue === undefined) return 0;

  switch (promo.type) {
    case 'PERCENTAGE_PRODUCT':
      return price * (promo.discountValue / 100);
    case 'FIXED_PRODUCT':
      return promo.discountValue;
    default:
      return 0;
  }
}
