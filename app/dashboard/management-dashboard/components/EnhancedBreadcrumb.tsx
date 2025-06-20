'use client';

import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { menuGroups } from '../helpers/mainMenu';

interface BreadcrumbItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
}

function normalizePath(path: string): string {
    return path.replace(/\/$/, '');
}

export default function EnhancedBreadcrumb() {
    const pathname = usePathname();
    const router = useRouter();

    // Find current menu item and build breadcrumb
    const buildBreadcrumb = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [
            {
                label: 'الرئيسية',
                href: '/dashboard',
                icon: Home,
            },
        ];

        // Find the current item in menu groups
        let currentItem = null;
        let parentGroup = null;

        for (const group of menuGroups) {
            for (const item of group.items) {
                if (normalizePath(item.url) === normalizePath(pathname)) {
                    currentItem = item;
                    parentGroup = group;
                    break;
                }

                // Check children
                if (item.children) {
                    for (const child of item.children) {
                        if (normalizePath(child.url) === normalizePath(pathname)) {
                            currentItem = child;
                            parentGroup = group;
                            // Add parent item to breadcrumb
                            if (item.url !== '/dashboard') {
                                breadcrumbs.push({
                                    label: item.title,
                                    href: item.url,
                                    icon: item.icon,
                                });
                            }
                            break;
                        }
                    }
                }
            }
            if (currentItem) break;
        }

        // Add current page if not dashboard
        if (currentItem && normalizePath(pathname) !== '/dashboard') {
            breadcrumbs.push({
                label: currentItem.title,
                href: pathname,
                icon: currentItem.icon,
                isActive: true,
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = buildBreadcrumb();
    const currentPage = breadcrumbs[breadcrumbs.length - 1];

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left Side - Back Button + Breadcrumb */}
            <div className="flex items-center gap-4">
                {/* Enhanced Back Button */}
                {breadcrumbs.length > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="btn-professional hover:bg-feature-analytics-soft hover:border-feature-analytics transition-all"
                    >
                        <ArrowLeft className="h-4 w-4 text-feature-analytics" />
                        <span className="hidden md:inline mr-1">رجوع</span>
                    </Button>
                )}

                {/* Enhanced Breadcrumb */}
                <nav className="flex items-center gap-2" aria-label="breadcrumb">
                    {breadcrumbs.map((item, index) => (
                        <React.Fragment key={item.href}>
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                            )}

                            <div className="flex items-center gap-2">
                                {item.isActive ? (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-feature-analytics-soft border border-feature-analytics/30">
                                        {item.icon && (
                                            <item.icon className="h-4 w-4 text-feature-analytics icon-enhanced" />
                                        )}
                                        <span className="font-semibold text-feature-analytics text-sm">
                                            {item.label}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            الحالية
                                        </Badge>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Right Side - Page Actions */}
            <div className="flex items-center gap-2">
                {/* Quick Page Info */}
                <div className="hidden lg:flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>آخر زيارة:</span>
                        <Badge variant="outline" className="text-xs">
                            منذ 5 دقائق
                        </Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                        <span>المستوى:</span>
                        <Badge
                            variant="outline"
                            className={`text-xs ${breadcrumbs.length === 1 ? 'border-feature-analytics text-feature-analytics' :
                                    breadcrumbs.length === 2 ? 'border-feature-users text-feature-users' :
                                        'border-feature-products text-feature-products'
                                }`}
                        >
                            {breadcrumbs.length === 1 ? 'رئيسي' :
                                breadcrumbs.length === 2 ? 'قسم' : 'صفحة فرعية'}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
} 