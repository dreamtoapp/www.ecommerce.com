// lib/check-is-login.ts
'use server';

import { auth } from '@/auth';
import { User } from '@/types/databaseTypes';

export const checkIsLogin = async (): Promise<User | null> => {
  try {
    const session = await auth();
    // Removed console.log for cleaner build output
    if (!session?.user) return null;
    return session.user as User;
  } catch (error) {
    // Removed console.error for cleaner build output
    return null;
  }
};
