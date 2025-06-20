'use client';

import { Plus, Users, Package, BarChart3, Zap } from 'lucide-react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickActions = [
    {
        title: 'منتج جديد',
        href: '/dashboard/management-products/new',
        icon: Package,
        color: 'feature-products',
        shortcut: 'Ctrl+N',
    },
    {
        title: 'عرض جديد',
        href: '/dashboard/management-offer/new',
        icon: Plus,
        color: 'feature-commerce',
        shortcut: 'Ctrl+O',
    },
    {
        title: 'تقرير سريع',
        href: '/dashboard/management-reports',
        icon: BarChart3,
        color: 'feature-analytics',
        shortcut: 'Ctrl+R',
    },
    {
        title: 'إضافة مستخدم',
        href: '/dashboard/management-users/customer',
        icon: Users,
        color: 'feature-users',
        shortcut: 'Ctrl+U',
    },
];

const recentPages = [
    { title: 'إدارة المنتجات', href: '/dashboard/management-products', visits: 15 },
    { title: 'الطلبات الجديدة', href: '/dashboard/orders-management', visits: 8 },
    { title: 'تقارير المبيعات', href: '/dashboard/management-reports/sales', visits: 5 },
    { title: 'إعدادات النظام', href: '/dashboard/settings', visits: 3 },
];

export default function QuickActions() {
    return (
        <div className="flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="btn-professional hover:bg-feature-commerce-soft">
                        <Zap className="h-4 w-4 text-feature-commerce" />
                        <span className="hidden md:inline mr-1">إجراءات سريعة</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                    <DropdownMenuLabel className="text-base font-bold mb-2">
                        الإجراءات السريعة
                    </DropdownMenuLabel>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Card className={`card-hover-effect cursor-pointer hover:bg-${action.color}-soft transition-all duration-200 p-0`}>
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <action.icon className={`h-4 w-4 text-${action.color} icon-enhanced`} />
                                            <span className="text-sm font-semibold">{action.title}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {action.shortcut}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-sm font-medium text-muted-foreground mb-2">
                        الصفحات الأخيرة
                    </DropdownMenuLabel>

                    {recentPages.map((page) => (
                        <DropdownMenuItem key={page.href} asChild>
                            <Link href={page.href} className="flex items-center justify-between">
                                <span className="text-sm">{page.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {page.visits}
                                </Badge>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 