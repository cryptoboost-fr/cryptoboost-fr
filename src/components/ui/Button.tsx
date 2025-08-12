import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'mobile';
  children: React.ReactNode;
  mobileOptimized?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', mobileOptimized = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none';

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-md px-8 text-base',
      icon: 'h-10 w-10',
      mobile: 'h-12 px-6 py-3 text-base min-h-touch' // Mobile-optimized size
    };

    // Mobile-specific optimizations
    const mobileClasses = mobileOptimized ? 'min-h-touch text-base active:scale-95' : '';
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          mobileClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };