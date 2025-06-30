"use server";

import db from "@/lib/prisma";
import { checkIsLogin } from "@/lib/check-is-login";
import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { generateOrderNumber } from "../helpers/orderNumber";

// No validation, just save order as-is
export async function createDraftOrder(formData: FormData) {
  try {
    const user = await checkIsLogin();
    const cart = await getCart();

    // Ensure user is authenticated
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get real data from form
    const fullName = formData.get("fullName")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const addressId = formData.get("addressId")?.toString() || "";
    const shiftId = formData.get("shiftId")?.toString() || "";
    const paymentMethod = formData.get("paymentMethod")?.toString() || "CASH";
    const termsAccepted = formData.get("termsAccepted")?.toString() === "true";

    // Log the received data for debugging
    console.log("Order creation - Received data:", {
      userId: user.id,
      fullName,
      phone,
      addressId,
      shiftId,
      paymentMethod,
      termsAccepted,
      cartItemsCount: cart?.items?.length || 0
    });

    // Validate that we have the minimum required data
    if (!addressId || !shiftId) {
      throw new Error("Missing required data: addressId or shiftId");
    }

    // Generate proper order number
    const orderNumber = await generateOrderNumber();

    // Create order directly
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        addressId,
        shiftId,
        paymentMethod: paymentMethod.toUpperCase(),
        status: "PENDING",
        amount: 0, // Will be calculated from items
        deliveryInstructions: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Order created successfully:", order.id);

    // Create order items from cart
    if (cart?.items && cart.items.length > 0) {
      const orderItems = await Promise.all(
        cart.items.map(async (item) => {
          if (!item.product?.id) {
            console.warn("Skipping item without product ID:", item);
            return null;
          }

          return db.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.product.id,
              quantity: item.quantity || 1,
              price: (item.product.price || 0) * (item.quantity || 1), // Total price for this item
            },
          });
        })
      );

      // Filter out null items and calculate total
      const validItems = orderItems.filter(item => item !== null);
      const totalAmount = validItems.reduce((sum, item) => sum + (item?.price || 0), 0);

      // Update order with total amount
      await db.order.update({
        where: { id: order.id },
        data: { amount: totalAmount },
      });

      console.log(`Created ${validItems.length} order items, total: ${totalAmount}`);
    }

    // Revalidate cache
    revalidateTag("cart");
    revalidateTag("orders");

    console.log("Order creation completed successfully, redirecting to happyorder");

    // Redirect to success page with order number
    // Note: Don't clear cart here - let the happyorder page handle it
    redirect(`/happyorder?orderid=${orderNumber}`);

  } catch (error) {
    // Don't catch NEXT_REDIRECT errors - let them pass through
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors
    }

    console.error("Order creation error (no validation phase):", error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    
    throw new Error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى");
  }
} 