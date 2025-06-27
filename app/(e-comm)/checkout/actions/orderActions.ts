"use server";

import db from "@/lib/prisma";
import { checkIsLogin } from "@/lib/check-is-login";
import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  city: z.string().min(2),
  street: z.string().min(2),
});

export async function createDraftOrder(formData: FormData) {
  const user = await checkIsLogin();
  const cart = await getCart();
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  // Ensure user is authenticated
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Parse and validate address input
  addressSchema.parse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    street: formData.get("street"),
  });

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  // Get or create a default shift (simplified for now)
  let shift = await db.shift.findFirst();
  if (!shift) {
    shift = await db.shift.create({
      data: {
        name: "Default Shift",
        startTime: "09:00",
        endTime: "17:00",
      },
    });
  }

  // Create order
  const order = await db.order.create({
    data: {
      orderNumber: Date.now().toString(),
      customerId: user.id,
      status: "PENDING",
      amount: total,
      paymentMethod: "CASH",
      shiftId: shift.id,
      items: {
        createMany: {
          data: cart.items.map((ci) => ({
            productId: ci.productId,
            quantity: ci.quantity ?? 1,
            price: ci.product?.price ?? 0,
          })),
        },
      },
    },
  });

  // Clear cart
  for (const item of cart.items) {
    await db.cartItem.delete({ where: { id: item.id } });
  }
  revalidateTag("cart");

  redirect(`/order/${order.id}`);
} 