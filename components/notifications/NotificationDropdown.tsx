'use client';

import { useState } from 'react';
import { Bell, MapPinOff, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Alert = {
    id: string;
    type: 'warning' | 'destructive';
    title: string;
    description: string;
    href: string;
};

interface NotificationDropdownProps {
    alerts: Alert[];
    children: React.ReactNode;
}

const iconMap = {
    warning: MapPinOff,
    destructive: ShieldAlert,
};

const colorMap = {
    warning: 'text-yellow-500',
    destructive: 'text-destructive',
};

export function NotificationDropdown({
    alerts,
    children,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasAlerts = alerts.length > 0;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className='relative'>
                    {children}
                    {hasAlerts && (
                        <div className='absolute -top-1 -right-1 flex h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-destructive'></span>
                        </div>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-0' align='end'>
                <div className='p-4'>
                    <h4 className='text-lg font-medium leading-none'>الإشعارات</h4>
                </div>
                {hasAlerts ? (
                    <div className='border-t border-border'>
                        {alerts.map((alert) => {
                            const Icon = iconMap[alert.type];
                            const textColor = colorMap[alert.type];
                            return (
                                <Link key={alert.id} href={alert.href} legacyBehavior>
                                    <a className='block p-4 hover:bg-muted/50 transition-colors' onClick={() => setIsOpen(false)}>
                                        <div className='flex items-start gap-3'>
                                            <Icon className={`h-6 w-6 flex-shrink-0 ${textColor}`} />
                                            <div className='space-y-1'>
                                                <p className={`font-semibold ${textColor}`}>
                                                    {alert.title}
                                                </p>
                                                <p className='text-sm text-muted-foreground'>
                                                    {alert.description}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className='border-t border-border p-4 text-center text-muted-foreground'>
                        <Bell className='mx-auto h-10 w-10 text-muted/30' />
                        <p className='mt-2'>لا توجد إشعارات جديدة</p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
} 