import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
    return (
        <Card className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl hover:shadow-2xl border border-border/50 hover:border-primary/20 min-h-[420px] sm:min-h-[520px] w-full max-w-sm mx-auto flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer">
            {/* Image Section Skeleton */}
            <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl bg-muted/30">
                <Skeleton className="absolute inset-0 w-full h-full" />
                {/* Rating badge skeleton */}
                <div className="absolute top-3 right-3 z-20">
                    <Skeleton className="h-6 w-14 rounded-lg" />
                </div>
                {/* Wishlist button skeleton */}
                <div className="absolute bottom-3 right-3 z-20">
                    <Skeleton className="h-11 w-11 rounded-full" />
                </div>
            </div>

            {/* Content Section Skeleton */}
            <div className="flex-1 flex flex-col p-3 sm:p-5 gap-2 sm:gap-3">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16 rounded" />
                        <Skeleton className="h-4 w-12 rounded" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <div className="flex items-center justify-between gap-2 py-2">
                    <Skeleton className="h-8 w-24 rounded" />
                    <Skeleton className="h-8 w-20 rounded" />
                </div>
            </div>

            {/* Controls Section Skeleton */}
            <div className="flex flex-col gap-3 mt-auto p-3 sm:p-5 pt-0">
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-12 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="w-full h-12 rounded-full" />
            </div>
        </Card>
    );
} 