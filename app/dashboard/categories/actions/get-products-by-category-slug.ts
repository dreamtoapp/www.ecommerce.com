'use server'

import db from '@/lib/prisma';

/**
 * Fetches products for a given category slug with pagination.
 * @param categorySlug - The slug of the category.
 * @param page - The current page number (default: 1).
 * @param pageSize - The number of products per page (default: 10).
 * @returns An object with success status, category details, products, and pagination details or an error message.
 */
export async function getProductsByCategorySlug(categorySlug: string, page = 1, pageSize = 10) {
  try {
    const category = await db.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    const skip = (page - 1) * pageSize;
    const [rawProducts, totalProducts] = await db.$transaction([
      db.product.findMany({
        where: {
          categoryAssignments: { some: { categoryId: category.id } },
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
          categoryAssignments: { some: { categoryId: category.id } },
          published: true,
        },
      }),
    ]);

    const products = rawProducts.map(product => ({
      ...product,
      details: product.details ?? undefined,
      size: product.size ?? undefined,
      inStock: !product.outOfStock,
    }));

    return {
      success: true,
      category,
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    return { success: false, error: 'Failed to fetch products for this category.' };
  }
}