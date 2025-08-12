import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'default' | 'lg' | 'mobile';
  mobileOptimized?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', size = 'default', mobileOptimized = false, ...props }, ref) => {
    const baseClasses = 'flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';

    const variants = {
      default: 'border-input',
      error: 'border-red-500 focus-visible:ring-red-500',
      success: 'border-green-500 focus-visible:ring-green-500'
    };

    const sizes = {
      sm: 'h-8 px-2 text-xs',
      default: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
      mobile: 'h-12 px-4 text-base min-h-touch' // Mobile-optimized size
    };

    // Mobile-specific optimizations
    const mobileClasses = mobileOptimized ? 'text-base min-h-touch' : '';
    
    return (
      <input
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

Input.displayName = 'Input';

export { Input };