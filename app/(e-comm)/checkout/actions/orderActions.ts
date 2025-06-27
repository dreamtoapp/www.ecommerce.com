"use server";

import db from "@/lib/prisma";
import { checkIsLogin } from "@/lib/check-is-login";
import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { z } from "zod";

// Enhanced validation schema working with existing user info
const checkoutSchema = z.object({
  // Personal information (will update user profile if needed)
  fullName: z.string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم طويل جداً")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u0020-\u007E]+$/, "يرجى إدخال اسم صحيح"),
  
  phone: z.string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .max(15, "رقم الهاتف طويل جداً")
    .regex(/^[+]?[0-9\s\-\(\)]+$/, "رقم الهاتف غير صحيح")
    .transform(phone => phone.replace(/\s/g, '')), // Remove spaces
  
  // Address information (will be stored as formatted address string)
  city: z.string()
    .min(2, "اسم المدينة مطلوب")
    .max(30, "اسم المدينة طويل جداً")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/, "يرجى إدخال اسم مدينة صحيح"),
  
  street: z.string()
    .min(5, "عنوان الشارع يجب أن يكون 5 أحرف على الأقل")
    .max(100, "عنوان الشارع طويل جداً"),
  
  district: z.string()
    .min(2, "اسم الحي مطلوب")
    .max(30, "اسم الحي طويل جداً"),
  
  postalCode: z.string()
    .min(5, "الرمز البريدي مطلوب")
    .max(10, "الرمز البريدي غير صحيح")
    .regex(/^[0-9]+$/, "الرمز البريدي يجب أن يحتوي على أرقام فقط"),
  
  buildingNumber: z.string()
    .min(1, "رقم المبنى مطلوب")
    .max(10, "رقم المبنى طويل جداً"),
  
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  
  // Delivery and payment options
  shiftId: z.string().min(1, "يرجى اختيار وقت التوصيل"),
  paymentMethod: z.enum(["CASH", "CARD", "WALLET"], {
    errorMap: () => ({ message: "يرجى اختيار طريقة الدفع" })
  }),
  
  // Terms acceptance
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام"
  })
});

export async function createDraftOrder(formData: FormData) {
  try {
    const user = await checkIsLogin();
    const cart = await getCart();
    
    if (!cart || !cart.items || cart.items.length === 0) {
      redirect("/cart");
    }

    // Ensure user is authenticated
    if (!user?.id) {
      redirect("/auth/login");
    }

    // Parse and validate all form data
    const validatedData = checkoutSchema.parse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      street: formData.get("street"),
      district: formData.get("district"),
      postalCode: formData.get("postalCode"),
      buildingNumber: formData.get("buildingNumber"),
      floor: formData.get("floor"),
      apartmentNumber: formData.get("apartmentNumber"),
      landmark: formData.get("landmark"),
      deliveryInstructions: formData.get("deliveryInstructions"),
      shiftId: formData.get("shiftId"),
      paymentMethod: formData.get("paymentMethod"),
      termsAccepted: formData.get("termsAccepted") === "true"
    });

    // Update user information if it's different from what's stored
    const updateUserData: any = {};
    if (user.name !== validatedData.fullName) {
      updateUserData.name = validatedData.fullName;
    }
    if (user.phone !== validatedData.phone) {
      updateUserData.phone = validatedData.phone;
    }
    
    // Create comprehensive address string for existing address field
    const fullAddress = [
      validatedData.street,
      validatedData.district,
      validatedData.city,
      validatedData.postalCode,
      validatedData.buildingNumber && `مبنى ${validatedData.buildingNumber}`,
      validatedData.floor && `الطابق ${validatedData.floor}`,
      validatedData.apartmentNumber && `شقة ${validatedData.apartmentNumber}`,
      validatedData.landmark && `علامة مميزة: ${validatedData.landmark}`,
      validatedData.deliveryInstructions && `تعليمات: ${validatedData.deliveryInstructions}`
    ].filter(Boolean).join(", ");
    
    updateUserData.address = fullAddress;

    // Update user information if needed
    if (Object.keys(updateUserData).length > 0) {
      await db.user.update({
        where: { id: user.id },
        data: updateUserData
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    
    const deliveryFee = subtotal >= 200 ? 0 : 25; // Free delivery over 200 SAR
    const taxRate = 0.15;
    const taxAmount = (subtotal + deliveryFee) * taxRate;
    const total = subtotal + deliveryFee + taxAmount;

    // Verify shift exists and is available
    const shift = await db.shift.findUnique({
      where: { id: validatedData.shiftId }
    });

    if (!shift) {
      throw new Error("وقت التوصيل المحدد غير متاح");
    }

    // Create order with existing schema
    const order = await db.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerId: user.id,
        status: "PENDING",
        amount: total, // Store total amount in existing amount field
        paymentMethod: validatedData.paymentMethod,
        shiftId: validatedData.shiftId,
        
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
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Clear cart after successful order creation
    for (const item of cart.items) {
      await db.cartItem.delete({ where: { id: item.id } });
    }
    revalidateTag("cart");

    // Create notification for admin
    await db.userNotification.create({
      data: {
        title: 'طلب جديد',
        body: `طلب جديد #${order.orderNumber} بقيمة ${total.toFixed(2)} ر.س من ${validatedData.fullName}`,
        type: 'ORDER',
        read: false,
        userId: user.id,
      },
    });

    redirect(`/happyorder?orderid=${order.orderNumber}`);
    
  } catch (error) {
    console.error("Order creation error:", error);
    
    if (error instanceof z.ZodError) {
      // Return validation errors to the client
      const errorMessage = error.errors.map(err => err.message).join(", ");
      throw new Error(errorMessage);
    }
    
    throw new Error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى");
  }
} 