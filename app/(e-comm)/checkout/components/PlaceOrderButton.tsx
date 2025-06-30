import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { createDraftOrder } from "../actions/orderActions";

interface Address {
    id: string;
    latitude?: string | null;
    longitude?: string | null;
    isDefault?: boolean;
}

interface Shift {
    id: string;
    startTime: string;
    endTime: string;
}

interface User {
    id: string;
    fullName?: string | null;
    phone?: string | null;
    email?: string | null;
}

interface PlaceOrderButtonProps {
    defaultAddress?: Address;
    defaultShift?: Shift;
    user?: User;
}

export default function PlaceOrderButton({ defaultAddress, defaultShift, user }: PlaceOrderButtonProps) {
    // Check if we have the minimum required data
    const hasRequiredData = defaultAddress?.id && defaultShift?.id && user?.id;

    if (!hasRequiredData) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        {!defaultAddress?.id && "• يجب اختيار عنوان للتوصيل"}
                        {!defaultShift?.id && "• يجب اختيار وقت التوصيل"}
                        {!user?.id && "• يجب تسجيل الدخول"}
                    </p>
                </div>
                <Button disabled className="w-full h-12">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    إكمال البيانات المطلوبة
                </Button>
            </div>
        );
    }

    return (
        <form action={createDraftOrder} className="space-y-4">
            {/* Hidden fields with real data */}
            <input type="hidden" name="shiftId" value={defaultShift.id} />
            <input type="hidden" name="addressId" value={defaultAddress.id} />
            <input type="hidden" name="fullName" value={user?.fullName || ""} />
            <input type="hidden" name="phone" value={user?.phone || ""} />
            <input type="hidden" name="paymentMethod" value="cash" />
            <input type="hidden" name="termsAccepted" value="true" />

            <Button type="submit" className="w-full h-12 bg-feature-commerce hover:bg-feature-commerce/90">
                <ShoppingCart className="mr-2 h-4 w-4" />
                تنفيذ الطلب
            </Button>

            <p className="text-xs text-muted-foreground text-center">
                بالضغط على هذا الزر، أنت توافق على شروط وأحكام الموقع
            </p>
        </form>
    );
} 