"use server";
import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';

export async function getDrivers() {
  try {
    const drivers = await db.driver.findMany();
    return drivers;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب قائمة السائقين من قاعدة البيانات.' };
    throw err;
  }
}
