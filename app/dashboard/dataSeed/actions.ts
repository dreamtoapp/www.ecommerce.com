'use server';

import { seedAll } from '@/utils/actionSeedData';
import { revalidatePath } from 'next/cache';

export type SeedingProgress = {
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
};

let progressUpdates: SeedingProgress[] = [];

export async function startSeeding(config: { shouldCleanup: boolean }) {
  try {
    // Start seeding in the background
    seedAll(config.shouldCleanup).then((results) => {
      // Update progress for each step
      if (results.drivers) {
        progressUpdates.push({
          step: 'السائقين',
          status: 'completed',
          message: `تم إنشاء ${results.drivers.filter(r => r.success).length} سائق`,
        });
      }
      if (results.users) {
        progressUpdates.push({
          step: 'المستخدمين',
          status: 'completed',
          message: `تم إنشاء ${results.users.filter(r => r.success).length} مستخدم`,
        });
      }
      if (results.suppliers) {
        progressUpdates.push({
          step: 'الموردين',
          status: 'completed',
          message: `تم إنشاء ${results.suppliers.filter(r => r.success).length} مورد`,
        });
      }
      if (results.categories) {
        progressUpdates.push({
          step: 'الأصناف',
          status: 'completed',
          message: `تم إنشاء ${results.categories.filter(r => r.success).length} صنف`,
        });
      }
      if (results.products) {
        progressUpdates.push({
          step: 'المنتجات',
          status: 'completed',
          message: `تم إنشاء ${results.products.filter(r => r.success).length} منتج`,
        });
      }
      if (results.orders) {
        progressUpdates.push({
          step: 'الطلبات',
          status: 'completed',
          message: `تم إنشاء ${results.orders.filter(r => r.success).length} طلب`,
        });
      }
      if (results.reviews) {
        progressUpdates.push({
          step: 'التقييمات',
          status: 'completed',
          message: `تم إنشاء ${results.reviews.filter(r => r.success).length} تقييم`,
        });
      }
      if (results.wishlist) {
        progressUpdates.push({
          step: 'المفضلة',
          status: 'completed',
          message: `تم إنشاء ${results.wishlist.filter(r => r.success).length} عنصر مفضل`,
        });
      }
      if (results.slider) {
        progressUpdates.push({
          step: 'صور السلايدر',
          status: 'completed',
          message: `تم إنشاء ${results.slider.filter(r => r.success).length} صورة سلايدر`,
        });
      }
    }).catch((error) => {
      progressUpdates.push({
        step: 'خطأ',
        status: 'error',
        message: error.message,
      });
    });

    revalidatePath('/dashboard/dataSeed');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to start seeding process' };
  }
}

export async function getProgress() {
  const updates = [...progressUpdates];
  progressUpdates = []; // Clear updates after sending
  return updates;
} 