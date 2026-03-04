import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

/**
 * Returns a proxy URL for images that fail to load due to CORS.
 * Uses weserv.nl which is a free, reliable image proxy.
 */
function getProxyUrl(url: string): string {
  if (!url || !url.startsWith('http')) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg&q=85`;
}

/**
 * Check if a URL is a data URL (base64 encoded image uploaded from admin)
 */
function isDataUrl(url: string): boolean {
  return url.startsWith('data:');
}

/**
 * Normalise an image URL:
 * - Data URLs are returned as-is
 * - Relative paths are returned as-is  
 * - External URLs are returned with a proxy attempt
 */
function resolveImageSrc(src: string): string {
  if (!src) return '';
  if (isDataUrl(src)) return src;         // base64 upload from admin
  if (src.startsWith('/')) return src;    // local public asset
  return src;                             // external – try direct first
}

export function ProductImage({ src, alt, className = '', fallbackIcon }: ProductImageProps) {
  const [triedProxy, setTriedProxy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    if (!triedProxy && src && src.startsWith('http') && !src.includes('weserv.nl')) {
      // First error: retry with weserv proxy
      setTriedProxy(true);
      // imageError stays false so it will re-render with proxy src
    } else {
      // Proxy also failed – show fallback
      setImageError(true);
      setImageLoaded(false);
    }
  };

  const handleLoad = () => {
    setImageError(false);
    setImageLoaded(true);
  };

  // Show fallback if no src or final error
  if (!src || imageError) {
    return (
      <div className={`flex items-center justify-center bg-slate-700 ${className}`}>
        {fallbackIcon || (
          <div className="text-slate-500 text-4xl">📦</div>
        )}
      </div>
    );
  }

  // Decide which src to use
  const displaySrc = triedProxy ? getProxyUrl(src) : resolveImageSrc(src);

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 animate-pulse">
          <div className="text-slate-500 text-sm">Loading...</div>
        </div>
      )}
      <img
        key={displaySrc} // force re-mount when src changes to proxy
        src={displaySrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        crossOrigin="anonymous"
      />
    </div>
  );
}
