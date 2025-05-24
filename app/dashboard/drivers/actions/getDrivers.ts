"use server";
import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getDrivers() {
  try {
    const drivers = await db.user.findMany({ where: { role: UserRole.DRIVER } });
    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw new Error('Failed to fetch drivers.');
  }
}
