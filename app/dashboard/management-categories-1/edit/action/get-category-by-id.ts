'use server'

import db from '@/lib/prisma';

/**
 * Fetches a single category by its ID, including parent, children, and product assignments.
 * @param id - The ID of the category to fetch.
 * @returns An object with success status and the category data or an error message.
 */
export async function getCategoryById(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id }
    });

    if (!category) {
      return { success: false, error: 'Category not found.' }
    }
    return category
  } catch (error: unknown) {
    console.error('Error fetching category by ID:', error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}