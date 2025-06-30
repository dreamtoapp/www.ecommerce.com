import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
};

export default function Spinner({ size = 'md', className, text }: SpinnerProps) {
    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <svg
                className={cn(
                    'animate-spin text-current',
                    sizeClasses[size]
                )}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                role='status'
                aria-label='Loading'
            >
                <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                />
                <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                />
            </svg>
            {text && <span className="text-sm">{text}</span>}
        </div>
    );
} 