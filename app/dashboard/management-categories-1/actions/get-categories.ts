'use server'

import db from '@/lib/prisma';

/**
 * Fetches all categories, including counts for children and product assignments.
 * @returns An object with success status and the list of categories or an error message.
 */
export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { productAssignments: true },
        },
      },
    })
    return { success: true, categories }
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}