import React, {
  memo,
  useMemo,
} from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AppDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AppDialog: React.FC<AppDialogProps> = memo(({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className = '',
}) => {
  // Memoize header and footer to avoid unnecessary re-renders
  const header = useMemo(() => (
    (title || description) && (
      <DialogHeader>
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
    )
  ), [title, description]);

  const dialogFooter = useMemo(() => footer ? <DialogFooter>{footer}</DialogFooter> : null, [footer]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        {header}
        {children}
        {dialogFooter}
      </DialogContent>
    </Dialog>
  );
});

AppDialog.displayName = 'AppDialog';

export default AppDialog;
