"use server";
import db from '@/lib/prisma';

export async function deleteDriver(driverId: string) {
  try {
    await db.user.delete({
      where: { id: driverId },
    });
    return { msg: 'تم حذف السائق بنجاح' };
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw new Error('Failed to delete driver');
  }
}
