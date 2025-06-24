"use server";

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { checkIsLogin } from '@/lib/check-is-login';

// Types for cart with items and products
export type CartItemWithProduct = Awaited<ReturnType<typeof db.cartItem.findFirst>> & { product?: Awaited<ReturnType<typeof db.product.findFirst>> };
export type CartWithItems = Awaited<ReturnType<typeof db.cart.findFirst>> & { items?: CartItemWithProduct[] };

// Helper: get cart ID from cookie
async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value;
}

// Helper: set cart ID cookie
async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

// Helper: clear cart ID cookie
async function clearCartIdCookie() {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', '', { maxAge: -1 });
}

// Helper: create a new guest cart
async function createGuestCart(): Promise<CartWithItems> {
  const newCart = await db.cart.create({
    data: {},
    include: {
      items: { include: { product: true } },
    },
  });
  return newCart;
}

// Get the current user's or guest's cart
export async function getCart(): Promise<CartWithItems | null> {
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  // Logged-in user
  if (user) {
    let userCart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    // Merge guest cart if present
    if (localCartId) {
      const localCart = await db.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      });
      if (localCart && localCart.items.length > 0) {
        if (userCart) {
          await db.$transaction(async (tx) => {
            for (const item of localCart.items) {
              if (!userCart) throw new Error('userCart is unexpectedly null');
              const existingItem = userCart.items.find(
                (i: typeof item) => i.productId === item.productId
              );
              if (existingItem) {
                await tx.cartItem.update({
                  where: { id: existingItem.id },
                  data: { quantity: existingItem.quantity + item.quantity },
                });
              } else {
                await tx.cartItem.create({
                  data: {
                    cartId: userCart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                  },
                });
              }
            }
          });
          await db.cart.delete({ where: { id: localCartId } });
        } else {
          await db.cart.update({
            where: { id: localCartId },
            data: { userId: user.id },
          });
        }
        userCart = await db.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        });
        await clearCartIdCookie();
      }
    }
    return userCart;
  }

  // Guest
  if (localCartId) {
    return await db.cart.findUnique({
      where: { id: localCartId },
      include: { items: { include: { product: true } } },
    });
  }
  return null;
}

// Add item to cart (guest or user)
export async function addItem(productId: string, quantity: number = 1): Promise<void> {
  const user = await checkIsLogin();
  let cart: CartWithItems | null = null;
  let cartId: string | undefined = await getCartIdFromCookie();

  if (user) {
    cart = await db.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await db.cart.create({ data: { userId: user.id } });
    }
    cartId = cart.id;
  } else {
    if (cartId) {
      cart = await db.cart.findUnique({ where: { id: cartId } });
    }
    if (!cart) {
      cart = await createGuestCart();
      cartId = cart.id;
      if (cartId) await setCartIdCookie(cartId);
    }
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cartId, productId },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cartId!,
        productId,
        quantity,
      },
    });
  }
  revalidatePath('/cart');
}

// Update quantity of a cart item
export async function updateItemQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity > 0) {
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  } else {
    await db.cartItem.delete({ where: { id: itemId } });
  }
  revalidatePath('/cart');
}

// Remove item from cart
export async function removeItem(itemId: string): Promise<void> {
  await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/cart');
}

// Merge guest cart into user cart on login
export async function mergeGuestCartOnLogin(guestCartId: string, userId: string): Promise<void> {
  const guestCart = await db.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });
  let userCart = await db.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await db.cart.create({ data: { userId } });
  }
  if (guestCart && guestCart.items.length > 0) {
    await db.$transaction(async (tx) => {
      for (const item of guestCart.items) {
        if (!userCart) throw new Error('userCart is unexpectedly null');
        const existingItem = await tx.cartItem.findFirst({
          where: { cartId: userCart.id, productId: item.productId },
        });
        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
    });
    await db.cart.delete({ where: { id: guestCartId } });
  }
}

// Get the total number of items in the cart (for header badge)
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
} 