'use server'

import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';

/**
 * Assigns a product to a category.
 * @param productId - The ID of the product.
 * @param categoryId - The ID of the category.
 * @returns An object with success status and the assignment or an error message.
 */
export async function assignProductToCategory(productId: string, categoryId: string) {
  try {
    const assignment = await db.categoryProduct.create({
      data: { productId, categoryId },
    })
    revalidatePath(`/dashboard/products/edit/${productId}`)
    revalidatePath(`/dashboard/categories/edit/${categoryId}`)
    return { success: true, assignment }
  } catch (error: unknown) {
    let errorMessage = 'فشل ربط المنتج بالصنف.';
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2002') {
        errorMessage = 'المنتج مرتبط بالفعل بهذا الصنف.';
      } else {
        console.error('Error assigning product to category:', error);
      }
    } else {
      console.error('Error assigning product to category:', error);
    }
    return { success: false, error: errorMessage };
  }
}