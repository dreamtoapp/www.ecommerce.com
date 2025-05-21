import db from '@/lib/prisma';
import { Product } from '@/types/databaseTypes';;

// Extract real ID from slug-format URL parameter
function extractIdFromParam(param: string): string {
  // Match the ObjectId format at the end of the string (24 hex characters)
  const match = param.match(/[a-f0-9]{24}$/i);
  return match ? match[0] : param;
}

export async function getPromotionPageData(promotionIdOrSlug: string) {
  // Try to find promotion by slug first
  let promotion = await db.promotion.findFirst({
    where: { slug: promotionIdOrSlug }
  });

  // If not found, try to extract and use ID as fallback
  if (!promotion) {
    const extractedId = extractIdFromParam(promotionIdOrSlug);
    promotion = await db.promotion.findUnique({
      where: { id: extractedId }
    });
  }

  if (!promotion || !promotion.active) {
    return null;
  }

  // Check if promotion is valid based on dates
  const now = new Date();
  if (
    (promotion.startDate && new Date(promotion.startDate) > now) ||
    (promotion.endDate && new Date(promotion.endDate) < now)
  ) {
    return null;
  }

  // Fetch products for this promotion
  const products: Product[] = await db.product.findMany({
    where: {
      id: { in: promotion.productIds },
      published: true
    },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      costPrice: true,
      details: true,
      size: true,
      published: true,
      outOfStock: true,
      imageUrl: true,
      images: true,
      type: true,
      stockQuantity: true,
      manageInventory: true,
      productCode: true,
      gtin: true,
      brand: true,
      material: true,
      color: true,
      dimensions: true,
      weight: true,
      features: true,
      requiresShipping: true,
      shippingDays: true,
      returnPeriodDays: true,
      hasQualityGuarantee: true,
      careInstructions: true,
      tags: true,
      rating: true,
      reviewCount: true,
      supplierId: true,
      createdAt: true,
      updatedAt: true,
      supplier: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          email: true,
          phone: true,
          address: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      reviews: { take: 5 },
      _count: { select: { reviews: true } }
    }
  });

  return { promotion, products };
}