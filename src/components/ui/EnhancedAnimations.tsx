import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enhanced fade-in animation with stagger
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for multiple children
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          key={index}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Enhanced hover card with micro-interactions
interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  glowEffect?: boolean;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  hoverRotate = 0,
  glowEffect = false
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        rotate: hoverRotate,
        boxShadow: glowEffect ? '0 0 20px rgba(59, 130, 246, 0.3)' : undefined
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </motion.div>
  );
};

// Floating action button with pulse animation
interface FloatingButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  color = 'primary'
}) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const colors = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        positions[position],
        colors[color],
        'w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={label}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="group-hover:scale-110 transition-transform"
      >
        {icon}
      </motion.div>
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
};

// Progress bar with animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  color = 'blue',
  height = 'md',
  showLabel = false,
  className
}) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn('bg-muted rounded-full overflow-hidden', heights[height])}>
        <motion.div
          className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Notification badge with bounce animation
interface NotificationBadgeProps {
  count: number;
  max?: number;
  color?: 'red' | 'blue' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  color = 'red',
  size = 'md',
  className
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  const colors = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-black'
  };

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[16px] h-4',
    md: 'text-xs px-2 py-1 min-w-[20px] h-5',
    lg: 'text-sm px-2.5 py-1 min-w-[24px] h-6'
  };

  if (count === 0) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        colors[color],
        sizes[size],
        className
      )}
    >
      <motion.span
        key={count} // Re-animate when count changes
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {displayCount}
      </motion.span>
    </motion.span>
  );
};

// Ripple effect for buttons
export const useRipple = () => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = React.useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  }, []);

  const RippleContainer = React.useCallback(() => (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-4 h-4 bg-white/30 rounded-full"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  ), [ripples]);

  return { addRipple, RippleContainer };
};
