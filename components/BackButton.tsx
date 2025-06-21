"use client";

import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BackButtonProps {
  label?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'floating' | 'gradient';
  icon?: 'arrow' | 'chevron';
  showLabel?: boolean;
  fallbackUrl?: string;
}

function BackButton({
  label = "الرجوع",
  className = "",
  variant = 'default',
  icon = 'arrow',
  showLabel = true,
  fallbackUrl = "/dashboard"
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    try {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push(fallbackUrl);
    }
  };

  const IconComponent = icon === 'chevron' ? ChevronLeft : ArrowLeft;

  // Professional, minimal, safe classes
  const baseClasses = "inline-flex items-center justify-center select-none";
  const variantClasses = {
    default: "gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
    minimal: "gap-1 px-2 py-1 text-sm rounded-md text-muted-foreground hover:bg-muted",
    floating: "gap-2 px-3 py-2 text-sm font-medium rounded-full bg-background/80 border border-border/50 hover:bg-muted",
    gradient: "gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90"
  };
  const iconSizeClasses = {
    default: "w-4 h-4",
    minimal: "w-3 h-3",
    floating: "w-4 h-4",
    gradient: "w-4 h-4"
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      aria-label={label}
    >
      <IconComponent className={iconSizeClasses[variant]} />
      {showLabel && <span>{label}</span>}
    </button>
  );
}

// Wrapper to prevent hydration scroll jump
export default function BackButtonWrapper(props: BackButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a plain skeleton with the same size as the default BackButton
    return <div style={{ height: 40, width: 96, borderRadius: 8, background: '#eee' }} />;
  }
  return <BackButton {...props} />;
}
