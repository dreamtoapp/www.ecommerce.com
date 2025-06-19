import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import db from './lib/prisma';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { phone, password } = credentials as {
          phone: string;
          password: string;
        };

        if (!phone || !password) {
          throw new Error('Invalid credentials');
        }

        const user = await db.user.findFirst({
          where: { phone },
        });

        if (!user) throw new Error('User not found');
        if (user.password !== password) throw new Error('Invalid password');

        return {
          id: user.id,
          name: user.name || undefined,
          email: user.email || undefined,
          role: user.role || '',
          phone: user.phone || '',
          address: user.address || '',
          latitude: user.latitude?.toString() || '0',
          longitude: user.longitude?.toString() || '0',
          image: user.image || null,
          emailVerified: user.emailVerified?.toISOString() || null,
          isOauth: user.isOauth || false,
          isOtp: user.isOtp || false,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
