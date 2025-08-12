import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  lines = 1,
  animated = true
}) => {
  const baseClasses = 'bg-muted rounded-md';
  
  const variants = {
    default: 'h-4 w-full',
    card: 'h-32 w-full',
    text: 'h-4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24'
  };

  const animationClasses = animated ? 'animate-pulse' : '';

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              animationClasses,
              index === lines - 1 && 'w-3/4' // Last line shorter
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        animationClasses,
        className
      )}
    />
  );
};

interface DashboardSkeletonProps {
  type?: 'client' | 'admin';
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ type = 'client' }) => {
  return (
    <div className="space-y-6 mobile-container">
      {/* Header Skeleton */}
      <Card className="bg-gradient-to-r from-gray-200/20 to-gray-300/20 backdrop-blur-lg border-gray-500/30">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex gap-2">
              <Skeleton variant="button" />
              <Skeleton variant="button" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="mobile-dashboard-grid gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 border-gray-500/30">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton variant="avatar" className="h-8 w-8" />
                </div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
                <div className="mt-3">
                  <Skeleton className="h-1 w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton variant="button" className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Skeleton variant="avatar" className="h-8 w-8" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Skeleton */}
        <div className="md:hidden space-y-3 p-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="mobile-table-card bg-accent/20">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton variant="avatar" className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, lineIndex) => (
                  <div key={lineIndex} className="flex justify-between items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Loading states for specific components
export const StatsCardSkeleton: React.FC = () => (
  <Card className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 border-gray-500/30">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton variant="avatar" className="h-8 w-8" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-16" />
      <div className="mt-3">
        <Skeleton className="h-1 w-full" />
      </div>
    </CardContent>
  </Card>
);

export const ActionButtonsSkeleton: React.FC = () => (
  <Card className="bg-white/10 backdrop-blur-lg border-white/20">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);
