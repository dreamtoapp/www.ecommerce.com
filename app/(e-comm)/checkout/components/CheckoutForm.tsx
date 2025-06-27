"use client";

import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDraftOrder } from "../actions/orderActions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

const checkoutSchema = z.object({
    fullName: z.string().min(2, "الاسم مطلوب"),
    phone: z.string().min(6, "الهاتف مطلوب"),
    city: z.string().min(2, "المدينة مطلوبة"),
    street: z.string().min(2, "الشارع مطلوب"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = (data: CheckoutFormValues) => {
        startTransition(async () => {
            try {
                const form = new FormData();
                Object.entries(data).forEach(([k, v]) => form.append(k, v));
                await createDraftOrder(form);
                // createDraftOrder will redirect on success
            } catch (e) {
                console.error(e);
                toast.error("فشل إنشاء الطلب، حاول مرة أخرى");
            }
        });
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    تفاصيل العنوان
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input placeholder="الاسم الكامل" {...register("fullName")} />
                        {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="رقم الهاتف" {...register("phone")} />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="المدينة" {...register("city")} />
                        {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="الشارع" {...register("street")} />
                        {errors.street && <p className="text-destructive text-xs mt-1">{errors.street.message}</p>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center gap-4">
                <BackButton variant="default" />
                <Button className="btn-save" disabled={isPending} onClick={handleSubmit(onSubmit)}>
                    تأكيد الطلب
                </Button>
            </CardFooter>
        </Card>
    );
} 