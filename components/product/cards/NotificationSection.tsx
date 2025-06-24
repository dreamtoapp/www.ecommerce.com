import { memo } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { iconVariants } from '@/lib/utils';

interface NotificationProps {
    show: boolean;
    type?: 'add' | 'remove';
    message?: string;
}

const Notification = ({ show, type = 'add', message }: NotificationProps) => {
    console.log('Notification rendered. show:', show, 'type:', type);
    if (!show) return null;

    const isAddType = type === 'add';
    const isRemoveType = type === 'remove';

    const getNotificationStyles = () => {
        if (isAddType) {
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        }
        if (isRemoveType) {
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    const getIcon = () => {
        if (isAddType) {
            return <Check className={iconVariants({ size: 'xs', className: 'text-green-600 dark:text-green-400' })} />;
        }
        if (isRemoveType) {
            return <Trash2 className={iconVariants({ size: 'xs', className: 'text-red-600 dark:text-red-400' })} />;
        }
        return <X className={iconVariants({ size: 'xs', className: 'text-blue-600 dark:text-blue-400' })} />;
    };

    const getMessage = () => {
        if (message) return message;
        if (isAddType) return 'تمت الإضافة!';
        if (isRemoveType) return 'تمت الإزالة!';
        return 'تم التنفيذ!';
    };

    return (
        <div
            className={`absolute left-0 right-0 top-0 z-30 flex animate-slideUp items-center justify-between px-4 py-2 ${getNotificationStyles()}`}
            style={{
                willChange: 'transform, opacity',
                contain: 'content',
            }}
        >
            <span className='text-sm font-medium'>{getMessage()}</span>
            {getIcon()}
        </div>
    );
};

export default memo(Notification);
Notification.displayName = 'Notification'; 