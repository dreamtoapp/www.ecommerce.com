"use client";

import { useState, useTransition, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    CheckCircle,
    User,
    Phone,
    FileText,
    LogIn
} from "lucide-react";

import { createDraftOrder } from "../actions/orderActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/BackButton";
import { ShiftSelector } from "./ShiftSelector";
import TermsDialog from "./TermsDialog";

// Enhanced validation schema matching backend
const checkoutSchema = z.object({
    fullName: z.string()
        .min(2, "الاسم يجب أن يكون حرفين على الأقل")
        .max(50, "الاسم طويل جداً"),
    phone: z.string()
        .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
        .regex(/^[+]?[0-9\s\-\(\)]+$/, "رقم الهاتف غير صحيح"),
    city: z.string().min(2, "اسم المدينة مطلوب"),
    street: z.string().min(5, "عنوان الشارع يجب أن يكون 5 أحرف على الأقل"),
    district: z.string().min(2, "اسم الحي مطلوب"),
    postalCode: z.string()
        .min(5, "الرمز البريدي مطلوب")
        .regex(/^[0-9]+$/, "الرمز البريدي يجب أن يحتوي على أرقام فقط"),
    buildingNumber: z.string().min(1, "رقم المبنى مطلوب"),
    floor: z.string().optional(),
    apartmentNumber: z.string().optional(),
    landmark: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    shiftId: z.string().min(1, "يرجى اختيار وقت التوصيل"),
    paymentMethod: z.enum(["CASH", "CARD", "WALLET"]),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "يجب الموافقة على الشروط والأحكام"
    })
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const STEPS = [
    { id: 1, title: "معلومات التوصيل", icon: User },
    { id: 2, title: "طريقة الدفع والتوصيل", icon: CreditCard },
    { id: 3, title: "مراجعة الطلب", icon: CheckCircle }
];

interface UserData {
    id: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
}

export default function CheckoutForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [authError, setAuthError] = useState<string>('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: "CASH",
            termsAccepted: false
        }
    });

    const watchedValues = watch();

    // Check authentication and load user data
    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                setIsLoadingUser(true);
                setAuthError('');

                // Check if user is authenticated by calling a protected endpoint
                const response = await fetch('/api/user/profile');

                if (!response.ok) {
                    if (response.status === 401) {
                        setAuthError('يجب تسجيل الدخول أولاً لإتمام الطلب');
                        return;
                    }
                    throw new Error('فشل في تحميل بيانات المستخدم');
                }

                const userData = await response.json();
                setUser(userData);

                // Pre-fill form with user data
                if (userData) {
                    if (userData.name) {
                        setValue('fullName', userData.name);
                    }
                    if (userData.phone) {
                        setValue('phone', userData.phone);
                    }

                    // Parse address if available
                    if (userData.address) {
                        const addressParts = userData.address.split(', ');
                        // Try to extract city, district, street from the address
                        // This is a simple parsing - you might want to improve this
                        if (addressParts.length >= 3) {
                            setValue('street', addressParts[0] || '');
                            setValue('district', addressParts[1] || '');
                            setValue('city', addressParts[2] || '');
                        }
                    }
                }

            } catch (error) {
                console.error('Auth check error:', error);
                setAuthError('حدث خطأ في التحقق من صحة المستخدم');
            } finally {
                setIsLoadingUser(false);
            }
        };

        checkUserAuth();
    }, [setValue]);

    const onSubmit = (data: CheckoutFormValues) => {
        startTransition(async () => {
            try {
                const form = new FormData();
                Object.entries(data).forEach(([k, v]) => {
                    form.append(k, String(v));
                });
                await createDraftOrder(form);
            } catch (e: any) {
                console.error(e);
                toast.error(e.message || "فشل إنشاء الطلب، حاول مرة أخرى");
            }
        });
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof CheckoutFormValues)[] = [];

        switch (currentStep) {
            case 1:
                fieldsToValidate = ["fullName", "phone", "city", "street", "district", "postalCode", "buildingNumber"];
                break;
            case 2:
                fieldsToValidate = ["shiftId", "paymentMethod"];
                break;
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleLoginRedirect = () => {
        // Use URL parameters for redirect
        router.push('/auth/login?redirect=/checkout');
    };

    const handleRegisterRedirect = () => {
        // Use URL parameters for redirect  
        router.push('/auth/register?redirect=/checkout');
    };

    const progress = (currentStep / STEPS.length) * 100;

    // Loading state
    if (isLoadingUser) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg border-l-4 border-feature-commerce">
                    <CardHeader className="pb-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                            <div className="h-2 bg-muted rounded mb-4"></div>
                            <div className="flex justify-between">
                                {[1, 2, 3, 4, 5].map((step) => (
                                    <div key={step} className="h-8 w-8 bg-muted rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 animate-pulse">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Authentication error state
    if (authError) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg border-l-4 border-red-500">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl text-red-600">
                            <LogIn className="h-5 w-5" />
                            مطلوب تسجيل الدخول
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert variant="destructive">
                            <LogIn className="h-4 w-4" />
                            <AlertDescription>{authError}</AlertDescription>
                        </Alert>

                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                يجب تسجيل الدخول أو إنشاء حساب جديد لإتمام عملية الشراء
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={handleLoginRedirect}
                                    className="btn-save"
                                >
                                    <LogIn className="h-4 w-4 ml-2" />
                                    تسجيل الدخول
                                </Button>

                                <Button
                                    onClick={handleRegisterRedirect}
                                    variant="outline"
                                    className="border-feature-commerce text-feature-commerce hover:bg-feature-commerce hover:text-white"
                                >
                                    <User className="h-4 w-4 ml-2" />
                                    إنشاء حساب جديد
                                </Button>
                            </div>

                            <div className="mt-6">
                                <BackButton variant="minimal" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <Card className="shadow-lg border-l-4 border-feature-commerce mb-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-feature-commerce" />
                        إتمام الطلب
                        {user && (
                            <span className="text-sm text-muted-foreground font-normal">
                                - مرحباً {user.name || 'عزيزي العميل'}
                            </span>
                        )}
                    </CardTitle>
                    <div className="space-y-3 mt-4">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            {STEPS.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.id}
                                        className={`flex flex-col items-center gap-1 ${step.id === currentStep ? 'text-feature-commerce' :
                                            step.id < currentStep ? 'text-green-600' : 'text-gray-400'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:block text-xs">{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Form Steps */}
            <Card className="shadow-lg">
                <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 1: Delivery Information (Combined Personal + Address) */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="h-5 w-5 text-feature-commerce" />
                                        <h3 className="text-lg font-semibold">معلومات التوصيل</h3>
                                    </div>

                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">المعلومات الشخصية</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <Label htmlFor="fullName">الاسم الكامل *</Label>
                                                <Input
                                                    id="fullName"
                                                    placeholder="أدخل اسمك الكامل"
                                                    className="mt-1 h-12"
                                                    {...register("fullName")}
                                                />
                                                {errors.fullName && (
                                                    <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="phone">رقم الهاتف *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="05xxxxxxxx"
                                                    className="mt-1 h-12"
                                                    {...register("phone")}
                                                />
                                                {errors.phone && (
                                                    <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Address Information */}
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">عنوان التوصيل</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="city">المدينة *</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="الرياض، جدة، الدمام..."
                                                    className="mt-1 h-12"
                                                    {...register("city")}
                                                />
                                                {errors.city && (
                                                    <p className="text-destructive text-xs mt-1">{errors.city.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="district">الحي *</Label>
                                                <Input
                                                    id="district"
                                                    placeholder="اسم الحي"
                                                    className="mt-1 h-12"
                                                    {...register("district")}
                                                />
                                                {errors.district && (
                                                    <p className="text-destructive text-xs mt-1">{errors.district.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="postalCode">الرمز البريدي *</Label>
                                                <Input
                                                    id="postalCode"
                                                    placeholder="12345"
                                                    className="mt-1 h-12"
                                                    {...register("postalCode")}
                                                />
                                                {errors.postalCode && (
                                                    <p className="text-destructive text-xs mt-1">{errors.postalCode.message}</p>
                                                )}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <Label htmlFor="street">الشارع *</Label>
                                                <Input
                                                    id="street"
                                                    placeholder="اسم الشارع والتفاصيل"
                                                    className="mt-1 h-12"
                                                    {...register("street")}
                                                />
                                                {errors.street && (
                                                    <p className="text-destructive text-xs mt-1">{errors.street.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="buildingNumber">رقم المبنى *</Label>
                                                <Input
                                                    id="buildingNumber"
                                                    placeholder="123"
                                                    className="mt-1 h-12"
                                                    {...register("buildingNumber")}
                                                />
                                                {errors.buildingNumber && (
                                                    <p className="text-destructive text-xs mt-1">{errors.buildingNumber.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="floor">الطابق (اختياري)</Label>
                                                <Input
                                                    id="floor"
                                                    placeholder="الطابق الأول"
                                                    className="mt-1 h-12"
                                                    {...register("floor")}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="apartmentNumber">رقم الشقة (اختياري)</Label>
                                                <Input
                                                    id="apartmentNumber"
                                                    placeholder="12"
                                                    className="mt-1 h-12"
                                                    {...register("apartmentNumber")}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="landmark">علامة مميزة (اختياري)</Label>
                                                <Input
                                                    id="landmark"
                                                    placeholder="بجانب البنك الأهلي"
                                                    className="mt-1 h-12"
                                                    {...register("landmark")}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <Label htmlFor="deliveryInstructions">تعليمات التوصيل (اختياري)</Label>
                                                <Textarea
                                                    id="deliveryInstructions"
                                                    placeholder="أي تعليمات خاصة للتوصيل..."
                                                    className="mt-1 min-h-20"
                                                    {...register("deliveryInstructions")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment & Delivery Time (Combined) */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="h-5 w-5 text-feature-commerce" />
                                        <h3 className="text-lg font-semibold">طريقة الدفع والتوصيل</h3>
                                    </div>

                                    {/* Delivery Time */}
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">وقت التوصيل</h4>
                                        <Label>اختر وقت التوصيل المناسب *</Label>
                                        <div className="mt-2">
                                            <ShiftSelector
                                                selectedShiftId={watchedValues.shiftId || ""}
                                                onShiftSelect={(shiftId) => setValue("shiftId", shiftId)}
                                            />
                                        </div>
                                        {errors.shiftId && (
                                            <p className="text-destructive text-xs mt-1">{errors.shiftId.message}</p>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Payment Method */}
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">طريقة الدفع</h4>
                                        <RadioGroup
                                            value={watchedValues.paymentMethod}
                                            onValueChange={(value) => setValue("paymentMethod", value as any)}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                    <RadioGroupItem value="CASH" id="cash" />
                                                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                                        <div className="font-medium">الدفع عند الاستلام</div>
                                                        <div className="text-sm text-muted-foreground">ادفع نقداً عند وصول الطلب</div>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20 border-dashed cursor-not-allowed relative">
                                                    <RadioGroupItem value="CARD" id="card" disabled className="opacity-50" />
                                                    <Label htmlFor="card" className="flex-1 opacity-60 cursor-not-allowed">
                                                        <div className="font-medium flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" />
                                                            البطاقة الائتمانية
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">قريباً</span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">فيزا، ماستركارد، مدى</div>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20 border-dashed cursor-not-allowed relative">
                                                    <RadioGroupItem value="WALLET" id="wallet" disabled className="opacity-50" />
                                                    <Label htmlFor="wallet" className="flex-1 opacity-60 cursor-not-allowed">
                                                        <div className="font-medium flex items-center gap-2">
                                                            <Phone className="h-4 w-4" />
                                                            المحفظة الرقمية
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">قريباً</span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">Apple Pay، STC Pay</div>
                                                    </Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                        {errors.paymentMethod && (
                                            <p className="text-destructive text-xs mt-1">{errors.paymentMethod.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review Order (Same as before) */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle className="h-5 w-5 text-feature-commerce" />
                                        <h3 className="text-lg font-semibold">مراجعة الطلب</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Order Summary */}
                                        <div className="bg-muted/30 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">تفاصيل الطلب</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>العميل:</span>
                                                    <span>{watchedValues.fullName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>الهاتف:</span>
                                                    <span>{watchedValues.phone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>العنوان:</span>
                                                    <span className="text-right max-w-48">
                                                        {[watchedValues.street, watchedValues.district, watchedValues.city].filter(Boolean).join(", ")}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>طريقة الدفع:</span>
                                                    <span>
                                                        {watchedValues.paymentMethod === "CASH" ? "الدفع عند الاستلام" :
                                                            watchedValues.paymentMethod === "CARD" ? "البطاقة الائتمانية" :
                                                                "المحفظة الرقمية"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Terms Acceptance */}
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="terms"
                                                checked={watchedValues.termsAccepted}
                                                onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean)}
                                            />
                                            <Label htmlFor="terms" className="text-sm">
                                                أوافق على <TermsDialog /> وسياسة الخصوصية
                                            </Label>
                                        </div>
                                        {errors.termsAccepted && (
                                            <p className="text-destructive text-xs">{errors.termsAccepted.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between p-6 border-t bg-muted/20">
                    <div className="flex items-center gap-3">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="h-12 px-6"
                            >
                                <ChevronRight className="h-4 w-4 ml-2" />
                                السابق
                            </Button>
                        )}
                        {currentStep === 1 && <BackButton variant="minimal" />}
                    </div>

                    <div className="flex items-center gap-3">
                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="btn-save h-12 px-8"
                            >
                                التالي
                                <ChevronLeft className="h-4 w-4 mr-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isPending || !watchedValues.termsAccepted}
                                className="btn-save h-12 px-8"
                            >
                                {isPending ? "جاري الإرسال..." : "تأكيد الطلب"}
                                <CheckCircle className="h-4 w-4 mr-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
} 