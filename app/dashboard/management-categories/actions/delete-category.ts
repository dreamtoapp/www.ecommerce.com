'use server'

import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';

/**
 * Deletes a category.
 * @param id - The ID of the category to delete.
 * @returns An object with success status or an error message.
 */
export async function deleteCategory(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id },
    })

    if (!category) {
      return { success: false, error: 'Category not found.' }
    }

    const deletedCategory = await db.category.delete({ where: { id } })
    revalidatePath('/dashboard/categories')
    revalidatePath(`/categories/${deletedCategory.slug}`) // In case it was accessible
    revalidatePath('/')
    return { success: true, category: deletedCategory }
  } catch (error: unknown) {
    let errorMessage = 'فشل حذف الصنف. يرجى مراجعة سجلات الخادم.';
    if (error instanceof Error && 'code' in error && 'meta' in error) {
      const prismaError = error as { code: string; meta?: { field_name?: string } };
      if (prismaError.code === 'P2003' && prismaError.meta?.field_name?.includes('parentId')) {
        errorMessage = 'لا يمكن حذف هذا الصنف لأنه أب لأصناف أخرى. يرجى معالجة الأصناف الفرعية أولاً.';
      } else if (prismaError.code === 'P2014') { // More generic relation constraint
        errorMessage = 'لا يمكن حذف هذا الصنف بسبب وجود ارتباطات قائمة. يرجى إزالة هذه الارتباطات أولاً.';
      } else {
        console.error('Error deleting category:', error);
      }
    } else {
      console.error('Error deleting category:', error);
    }
    return { success: false, error: errorMessage };
  }
}