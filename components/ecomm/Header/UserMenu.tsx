"use client"

import {
  useEffect,
  useState,
} from 'react';

import {
  Activity,
  Award,
  Bell,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Cog,
  Crown,
  Loader2,
  LogIn,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  Power,
  Search,
  Shield,
  Star,
  Trash2,
  User,
  UserCircle,
} from 'lucide-react';
import type { Session } from 'next-auth';

import Link from '@/components/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserRole } from '@/constant/enums';
import { iconVariants } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

import { userLogOut } from '../../../app/(e-comm)/auth/action';

interface UserMenuProps {
  session: Session | null
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isClearingCart, setIsClearingCart] = useState(false)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)
  const [userStats, _setUserStats] = useState({
    totalOrders: 12,
    totalSpent: 2450,
    loyaltyPoints: 850,
    memberSince: "2023",
  }) //TODO get all user data from backend
  const { clearCart, getTotalItems } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="hidden sm:block space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true)
      clearCart()
      await new Promise((res) => setTimeout(res, 500))
    } finally {
      setIsClearingCart(false)
    }
  }

  const logOut = async () => {
    try {
      setIsLoggingOut(true)
      await userLogOut()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!session) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              asChild
              className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:border-primary/40 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Link href="/auth/login" className="flex items-center gap-3 px-6 py-3">
                <div className="relative">
                  <LogIn
                    className={iconVariants({
                      size: "sm",
                      className: "text-primary group-hover:scale-110 transition-transform duration-300",
                    })}
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                </div>
                <span className="font-semibold text-primary">دخول</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>تسجيل الدخول إلى حسابك</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const navLinks = [
    {
      href: `/user/profile?id=${session.user.id}`,
      label: "الملف الشخصي",
      icon: <UserCircle className={iconVariants({ size: "sm" })} />,
      description: "إدارة معلوماتك الشخصية",
      variant: "default" as const,
      badge: null,
    },
    {
      href: `/user/statement?id=${session.user.id}`,
      label: "الحركات المالية",
      icon: <Activity className={iconVariants({ size: "sm" })} />,
      description: "عرض تاريخ المعاملات المالية",
      variant: "success" as const,
      badge: "جديد",
    },
    {
      href: `/user/purchase-history`,
      label: "سجل المشتريات",
      icon: <Package className={iconVariants({ size: "sm" })} />,
      description: "تصفح مشترياتك السابقة",
      variant: "secondary" as const,
      badge: userStats.totalOrders.toString(),
    },
    {
      href: `/user/ratings`,
      label: "تقييماتي",
      icon: <Award className={iconVariants({ size: "sm" })} />,
      description: "إدارة تقييماتك ومراجعاتك",
      variant: "warning" as const,
      badge: null,
    },
    {
      href: `/user/wishlist`,
      label: "المفضلة",
      icon: <Bookmark className={iconVariants({ size: "sm" })} />,
      description: "قائمة المنتجات المفضلة",
      variant: "destructive" as const,
      badge: "5",
    },
    {
      href: `/user/setting`,
      label: "الإعدادات",
      icon: <Cog className={iconVariants({ size: "sm" })} />,
      description: "تخصيص إعدادات حسابك",
      variant: "outline" as const,
      badge: null,
    },
  ]

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
    }
    return styles[variant as keyof typeof styles] || styles.default
  }

  return (
    <TooltipProvider>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <AvatarImage
                  src={session.user.image || "/default-avatar.png"}
                  alt={session.user.name || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-muted-foreground font-bold text-lg">
                  {session.user.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              {session.user.role === UserRole.ADMIN && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1 shadow-lg">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {session.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {session.user.role === UserRole.ADMIN ? "مدير النظام" : "عضو مميز"}
              </span>
            </div>
            <Menu className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[420px] p-0 bg-background border-border">
          {/* Collapsible Enhanced Header */}
          <div className="p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b border-border">
            <Collapsible open={isHeaderExpanded} onOpenChange={setIsHeaderExpanded}>
              {/* Header Title - Always Visible with Collapse Button */}
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

              {/* Collapsible Content */}
              <CollapsibleContent className="space-y-4 overflow-hidden transition-all duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top">
                {/* User Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Package className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الطلبات</p>
                          <p className="text-lg font-bold text-foreground">{userStats.totalOrders}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Star className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">النقاط</p>
                          <p className="text-lg font-bold text-foreground">{userStats.loyaltyPoints}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Info Card */}
                <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-lg">
                        <AvatarImage
                          src={session.user.image || "/default-avatar.png"}
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xl">
                          {session.user.name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">أهلاً وسهلاً، {session.user.name}</h3>
                        <p className="text-sm text-muted-foreground">نتمنى لك تجربة تسوق ممتعة</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={75} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">75% مكتمل</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Dashboard Quick Access */}
                {session.user.role === UserRole.ADMIN && (
                  <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-300">
                    <CardContent className="p-4">
                      <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-lg bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                          <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-violet-600 dark:text-violet-400">لوحة التحكم</span>
                          <p className="text-xs text-violet-500/80">إدارة النظام والمحتوى</p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </CollapsibleContent>

              {/* Compact User Info when Collapsed */}
              {!isHeaderExpanded && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/50 animate-in slide-in-from-top duration-300">
                  <Avatar className="h-10 w-10 border border-primary/30">
                    <AvatarImage src={session.user.image || "/default-avatar.png"} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                      {session.user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userStats.totalOrders} طلب • {userStats.loyaltyPoints} نقطة
                    </p>
                  </div>
                  {session.user.role === UserRole.ADMIN && (
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
            className={`${isHeaderExpanded ? "h-[calc(100vh-400px)]" : "h-[calc(100vh-200px)]"} transition-all duration-300`}
          >
            <div className="p-6 space-y-3">
              {navLinks.map(({ href, label, icon, description, variant, badge }) => (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={`group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border ${getVariantStyles(variant)}`}
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
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              <Separator className="my-6" />

              {/* Cart Actions */}
              {getTotalItems() > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="group flex w-full items-center gap-4 rounded-xl p-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 hover:border-destructive/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-auto"
                    >
                      <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors duration-300">
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-semibold">إفراغ سلة التسوق</div>
                        <div className="text-xs opacity-80 mt-1">{getTotalItems()} عنصر في السلة</div>
                      </div>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف جميع العناصر من سلة التسوق. لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearCart}
                        disabled={isClearingCart}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isClearingCart ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            جاري الحذف...
                          </>
                        ) : (
                          "نعم، احذف الكل"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group flex w-full items-center gap-4 rounded-xl p-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 hover:border-destructive/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-auto"
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
                      onClick={logOut}
                      disabled={isLoggingOut}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isLoggingOut ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          جاري الخروج...
                        </>
                      ) : (
                        "نعم، سجل الخروج"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      {/* Separate HoverCard for user info - positioned after the Sheet */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            <User className="w-4 h-4" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="bottom">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={session.user.image || "/default-avatar.png"} />
              <AvatarFallback>{session.user.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-semibold">{session.user.name}</h4>
              <p className="text-sm text-muted-foreground">
                عضو منذ {userStats.memberSince} • {userStats.loyaltyPoints} نقطة ولاء
              </p>
              <div className="flex items-center pt-2">
                <Calendar className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">آخر تسجيل دخول: اليوم</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </TooltipProvider>
  )
}
