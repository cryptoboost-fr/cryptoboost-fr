import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: string;
  lazy?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  placeholder,
  lazy = true,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy);

  // Optimize image URL based on requirements
  const optimizeImageUrl = (url: string): string => {
    // For external images (Unsplash, etc.), add optimization parameters
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      params.set('fm', 'webp');
      params.set('fit', 'crop');
      return `${url}&${params.toString()}`;
    }
    
    // For other external images, try to add basic optimization
    if (url.startsWith('http') && !url.includes(window.location.origin)) {
      // Add webp format if supported
      if (supportsWebP()) {
        return url; // Return as-is for now, could implement image proxy
      }
    }
    
    return url;
  };

  // Check WebP support
  const supportsWebP = (): boolean => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const optimizedSrc = optimizeImageUrl(src);
    
    // Preload image
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
      onError?.();
      
      // Fallback to original src if optimization failed
      if (optimizedSrc !== src) {
        img.src = src;
      }
    };
    
    img.src = optimizedSrc;
  }, [isInView, src, width, height, quality, onLoad, onError]);

  // Generate responsive srcSet for better performance
  const generateSrcSet = (): string => {
    if (!width || !src.includes('unsplash.com')) return '';
    
    const sizes = [width, width * 1.5, width * 2];
    return sizes
      .map(size => `${optimizeImageUrl(src.replace(/w=\d+/, `w=${Math.round(size)}`))} ${size}w`)
      .join(', ');
  };

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && 'bg-muted animate-pulse',
        className
      )}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm"
          style={{ width, height }}
        >
          Image non disponible
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          srcSet={generateSrcSet()}
          sizes={width ? `(max-width: 768px) 100vw, ${width}px` : undefined}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            'object-cover w-full h-full'
          )}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

// Preload critical images
export const preloadCriticalImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Image compression utility (for user uploads)
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Progressive image loading component
export const ProgressiveImage: React.FC<{
  src: string;
  placeholderSrc: string;
  alt: string;
  className?: string;
}> = ({ src, placeholderSrc, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(
        'transition-all duration-500',
        isLoaded ? 'blur-0' : 'blur-sm',
        className
      )}
    />
  );
};

// WebP support detection
export const detectWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Initialize image optimizations
export const initializeImageOptimizations = async () => {
  // Detect WebP support and store in localStorage
  const supportsWebP = await detectWebPSupport();
  localStorage.setItem('webp-support', supportsWebP.toString());
  
  // Preload critical images
  const criticalImages = [
    '/favicon.svg',
    // Add other critical images here
  ];
  
  preloadCriticalImages(criticalImages);
};
