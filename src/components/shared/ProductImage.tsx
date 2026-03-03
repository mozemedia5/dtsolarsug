import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function ProductImage({ src, alt, className = '', fallbackIcon }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleLoad = () => {
    setImageError(false);
    setImageLoaded(true);
  };

  // Show fallback if no src or error
  if (!src || imageError) {
    return (
      <div className={`flex items-center justify-center bg-slate-700 ${className}`}>
        {fallbackIcon || (
          <div className="text-slate-500 text-4xl">📦</div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 animate-pulse">
          <div className="text-slate-500">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}
