import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackIcon?: string;
  showSpinner?: boolean;
  spinnerSize?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackIcon = '🖼️',
  showSpinner = true,
  spinnerSize = 'md',
  draggable = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false);
    onError?.();
  };

  const getSpinnerSize = () => {
    switch (spinnerSize) {
      case 'sm': return 'w-4 h-4 border-2';
      case 'md': return 'w-8 h-8 border-2';
      case 'lg': return 'w-12 h-12 border-4';
      default: return 'w-8 h-8 border-2';
    }
  };

  return (
    <div className="relative inline-block">
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && showSpinner && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center ${className}`} style={style}>
          <div className={`${getSpinnerSize()} border-gray-300 border-t-gray-600 rounded-full animate-spin`}></div>
        </div>
      )}
      
      {/* Error state */}
      {imageError && (
        <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 ${className}`} style={style}>
          <span className="text-2xl">{fallbackIcon}</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={style}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        draggable={draggable}
      />
    </div>
  );
};

export default OptimizedImage;