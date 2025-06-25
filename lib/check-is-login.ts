// lib/check-is-login.ts
'use server';

import { auth } from '@/auth';
import { User } from '@/types/databaseTypes';

export const checkIsLogin = async (): Promise<User | null> => {
  try {
    const session = await auth();
    console.log('checkIsLogin: session', session);
    if (!session?.user) return null;
    return session.user as User;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return null;
  }
};
