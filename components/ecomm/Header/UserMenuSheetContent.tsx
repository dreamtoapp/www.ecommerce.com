import React, { useState } from 'react';
import {
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, MoreHorizontal, ChevronUp, ChevronDown, Crown, Power, ChevronLeft, Bell, Search, MapPin } from 'lucide-react';
import UserMenuAdminSection from './UserMenuAdminSection';
import UserMenuStats from './UserMenuStats';
import { UserRole } from '@/constant/enums';
import Link from 'next/link';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface UserMenuSheetContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    } | null;
    alerts: any[];
    isMobile: boolean;
}

const UserMenuSheetContent: React.FC<UserMenuSheetContentProps> = ({ user, isMobile }) => {
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
    const [userStats] = useState({
        totalOrders: 12,
        totalSpent: 2450,
        loyaltyPoints: 850,
        memberSince: "2023",
    });
    // You may want to pass in or fetch userStats in the future
    const name = user?.name;
    const image = user?.image;
    const role = user?.role;

    // navLinks logic (copy from UserMenu)
    const navLinks = [
        {
            href: `/user/profile?id=${user?.id}`,
            label: "  الملف الشخصي",
            icon: <User className="w-5 h-5" />,
            description: "إدارة معلوماتك الشخصية",
            variant: "default" as const,
            badge: null,
        },
        {
            href: `/user/statement?id=${user?.id}`,
            label: "الحركات المالية",
            icon: <User className="w-5 h-5" />,
            description: "عرض تاريخ المعاملات المالية",
            variant: "success" as const,
            badge: "جديد",
        },
        {
            href: `/user/purchase-history`,
            label: "سجل المشتريات",
            icon: <User className="w-5 h-5" />,
            description: "تصفح مشترياتك السابقة",
            variant: "secondary" as const,
            badge: userStats.totalOrders.toString(),
        },
        {
            href: `/user/ratings`,
            label: "تقييماتي",
            icon: <User className="w-5 h-5" />,
            description: "إدارة تقييماتك ومراجعاتك",
            variant: "warning" as const,
            badge: null,
        },
        {
            href: `/user/wishlist`,
            label: "المفضلة",
            icon: <User className="w-5 h-5" />,
            description: "قائمة المنتجات المفضلة",
            variant: "destructive" as const,
            badge: "5",
        },
        {
            href: `/user/setting`,
            label: "الإعدادات",
            icon: <User className="w-5 h-5" />,
            description: "تخصيص إعدادات حسابك",
            variant: "outline" as const,
            badge: null,
        },
    ];

    const getVariantStyles = (variant: string) => {
        const styles = {
            default: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30",
            success:
                "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20 hover:border-green-500/30",
            secondary:
                "bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:border-violet-500/30",
            warning:
                "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500/30",
            destructive:
                "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:border-rose-500/30",
            outline:
                "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border hover:border-muted-foreground/30",
        };
        return styles[variant as keyof typeof styles] || styles.default;
    };

    return (
        <SheetContent
            side={isMobile ? "bottom" : "right"}
            className={
                isMobile
                    ? "w-full max-w-full h-[90vh] rounded-t-2xl p-0 bg-background border-border overflow-y-auto"
                    : "w-[420px] p-0 bg-background border-border"
            }
        >
            <SheetTitle className="sr-only">قائمة المستخدم</SheetTitle>
            <div className={isMobile ? "p-4 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b border-border" : "p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b border-border"}>
                <Collapsible open={isHeaderExpanded} onOpenChange={setIsHeaderExpanded}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    حسابي
                                    <Badge variant="secondary" className="text-xs">
                                        متصل
                                    </Badge>
                                </SheetTitle>
                                <SheetDescription className="text-muted-foreground font-medium">
                                    مركز إدارة الحساب الشخصي
                                </SheetDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Bell className="w-4 h-4 mr-2" />
                                        الإشعارات
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Search className="w-4 h-4 mr-2" />
                                        البحث السريع
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <MapPin className="w-4 h-4 mr-2" />
                                        تغيير الموقع
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                                >
                                    {isHeaderExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-primary transition-transform duration-200" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-primary transition-transform duration-200" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    <CollapsibleContent className="space-y-4 overflow-hidden transition-all duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top">
                        <UserMenuStats userStats={userStats} />
                        <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-lg">
                                        <AvatarImage
                                            src={image || "/default-avatar.png"}
                                            alt={name || "User"}
                                        />
                                        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xl">
                                            {name?.[0]?.toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-foreground">أهلاً وسهلاً، {name}</h3>
                                        <p className="text-sm text-muted-foreground">نتمنى لك تجربة تسوق ممتعة</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Progress value={75} className="flex-1 h-2" />
                                            <span className="text-xs text-muted-foreground">75% مكتمل</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {role === UserRole.ADMIN && <UserMenuAdminSection />}
                    </CollapsibleContent>
                    {!isHeaderExpanded && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/50 animate-in slide-in-from-top duration-300">
                            <Avatar className="h-10 w-10 border border-primary/30">
                                <AvatarImage src={image || "/default-avatar.png"} alt={name || "User"} />
                                <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                                    {name?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-foreground">{name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {userStats.totalOrders} طلب • {userStats.loyaltyPoints} نقطة
                                </p>
                            </div>
                            {role === UserRole.ADMIN && (
                                <Badge variant="secondary" className="text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    مدير
                                </Badge>
                            )}
                        </div>
                    )}
                </Collapsible>
            </div>
            <ScrollArea
                className={
                    isMobile
                        ? `${isHeaderExpanded ? "h-[calc(90vh-200px)]" : "h-[calc(90vh-120px)]"} transition-all duration-300`
                        : `${isHeaderExpanded ? "h-[calc(100vh-400px)]" : "h-[calc(100vh-200px)]"} transition-all duration-300`
                }
            >
                <div className={isMobile ? "p-4 space-y-3" : "p-6 space-y-3"}>
                    {navLinks.map(({ href, label, icon, description, variant, badge }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border ${getVariantStyles(variant)} text-base min-h-[56px]`}
                        >
                            <div className="p-3 rounded-xl bg-current/10 group-hover:scale-110 transition-transform duration-300">
                                {icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                                    {label}
                                    {badge && (
                                        <Badge variant="secondary" className="text-xs">
                                            {badge}
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs opacity-80 mt-1">{description}</div>
                            </div>
                            <ChevronLeft className="w-5 h-5 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300" />
                        </Link>
                    ))}
                    <Separator className="my-6" />
                    {/* Cart Actions (dynamically loaded) */}
                    {/* You may want to pass the correct props for cart actions here */}
                    {/* <UserMenuCartActions onClearCart={handleClearCart} isClearingCart={isClearingCart} getTotalItems={getTotalItems} /> */}
                    {/* Logout Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className={`group flex w-full items-center gap-4 rounded-xl p-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 hover:border-destructive/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-auto ${isMobile ? "text-base min-h-[56px]" : ""}`}
                            >
                                <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors duration-300">
                                    <Power className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex-1 text-right">
                                    <div className="font-semibold">تسجيل الخروج</div>
                                    <div className="text-xs opacity-80 mt-1">إنهاء جلسة العمل الحالية</div>
                                </div>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
                                <AlertDialogDescription>
                                    هل تريد تسجيل الخروج من حسابك؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                    // onClick={logOut}
                                    // disabled={isLoggingOut}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {/* {isLoggingOut ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            جاري الخروج...
                                        </>
                                    ) : ( */}
                                    نعم، سجل الخروج
                                    {/* )} */}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </ScrollArea>
        </SheetContent>
    );
};

export default UserMenuSheetContent; 