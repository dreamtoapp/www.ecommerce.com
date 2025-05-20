'use server'

import prisma from '@/lib/prisma';

/**
 * Fetches a single category by its slug, including parent, children, and assigned products.
 * @param slug - The slug of the category to fetch.
 * @returns An object with success status and the category data or an error message.
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        productAssignments: {
          include: {
            product: true, // Fetch full product details for category pages
          },
        },
      },
    })
    if (!category) {
      return { success: false, error: 'Category not found.' }
    }
    return { success: true, category }
  } catch (error: unknown) {
    console.error(`Error fetching category by slug "${slug}":`, error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}