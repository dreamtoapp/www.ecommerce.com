'use server'

import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';

/**
 * Removes a product from a category.
 * @param productId - The ID of the product.
 * @param categoryId - The ID of the category.
 * @returns An object with success status or an error message.
 */
export async function removeProductFromCategory(productId: string, categoryId: string) {
  try {
    await db.categoryProduct.delete({
      where: {
        categoryId_productId: { categoryId, productId },
      },
    })
    revalidatePath(`/dashboard/products/edit/${productId}`)
    revalidatePath(`/dashboard/categories/edit/${categoryId}`)
    return { success: true }
  } catch (error: unknown) {
    let errorMessage = 'فشل إزالة ربط المنتج من الصنف.';
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2025') {
        errorMessage = 'ربط المنتج بالصنف غير موجود.';
      } else {
        console.error('Error removing product from category:', error);
      }
    } else {
      console.error('Error removing product from category:', error);
    }
    return { success: false, error: errorMessage };
  }
}