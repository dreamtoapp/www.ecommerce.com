"use client";

import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'floating' | 'gradient';
  icon?: 'arrow' | 'chevron';
  showLabel?: boolean;
  fallbackUrl?: string;
}

export default function BackButton({
  label = "الرجوع",
  className = "",
  variant = 'default',
  icon = 'arrow',
  showLabel = true,
  fallbackUrl = "/dashboard"
}: BackButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = async () => {
    setIsLoading(true);

    try {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push(fallbackUrl);
    } finally {
      // Reset loading state after a short delay to prevent flickering
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const IconComponent = icon === 'chevron' ? ChevronLeft : ArrowLeft;

  const variants = {
    default: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 transition-all duration-300 ease-in-out bg-background hover:bg-muted border border-border hover:border-primary/20 btn-professional btn-cancel-outline",

    minimal: "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/60 transition-all duration-200 ease-in-out text-muted-foreground hover:text-foreground btn-cancel-outline",

    floating: "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/60 transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 card-hover-effect btn-cancel-outline",

    gradient: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white/60 transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 btn-professional"
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleBack}
      disabled={isLoading}
      className={cn(
        variants[variant],
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={label}
    >
      <IconComponent
        className={cn(
          "w-4 h-4 rtl:rotate-180 icon-enhanced transition-transform duration-200",
          isLoading && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className={cn(
          "hidden xs:inline-block transition-opacity duration-200",
          isLoading && "opacity-50"
        )}>
          {isLoading ? "جاري التحميل..." : label}
        </span>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
        </div>
      )}
    </Button>
  );
}
