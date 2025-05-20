'use server'

import db from '@/lib/prisma';

/**
 * Fetches products for a given category ID with pagination.
 * @param categoryId - The ID of the category.
 * @param page - The current page number (default: 1).
 * @param pageSize - The number of products per page (default: 10).
 * @returns An object with success status, products, and pagination details or an error message.
 */
export async function getProductsByCategoryId(categoryId: string, page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize
    const [rawProducts, totalProducts] = await db.$transaction([
      db.product.findMany({
        where: {
          categoryAssignments: { some: { categoryId } },
          published: true,
        },
        include: {
          supplier: true, // Include the full supplier object
          reviews: { take: 5, orderBy: { createdAt: 'desc' } },
          _count: { select: { reviews: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({
        where: {
          categoryAssignments: { some: { categoryId } },
          published: true,
        },
      }),
    ]);

    const products = rawProducts.map(product => ({
      ...product,
      inStock: !product.outOfStock,
    }));

    return {
      success: true,
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
    }
  } catch (error) {
    console.error('Error fetching products by category ID:', error)
    return { success: false, error: 'Failed to fetch products for this category.' };
  }
}