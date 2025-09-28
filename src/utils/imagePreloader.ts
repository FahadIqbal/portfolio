/**
 * Image preloader utility to improve loading performance
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Preload a single image
 */
export const preloadImage = (src: string, options: PreloadOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (sources: string[], options: PreloadOptions = {}): Promise<void> => {
  try {
    await Promise.all(sources.map(src => preloadImage(src, options)));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

/**
 * Preload images with priority (high priority images load first)
 */
export const preloadImagesWithPriority = async (
  highPrioritySources: string[],
  lowPrioritySources: string[] = []
): Promise<void> => {
  try {
    // Preload high priority images first
    await preloadImages(highPrioritySources, { priority: 'high' });
    
    // Then preload low priority images
    if (lowPrioritySources.length > 0) {
      // Use setTimeout to avoid blocking
      setTimeout(() => {
        preloadImages(lowPrioritySources, { priority: 'low' });
      }, 100);
    }
  } catch (error) {
    console.warn('Failed to preload high priority images:', error);
  }
};

/**
 * Create a link element for preloading (uses browser's native preloading)
 */
export const createPreloadLink = (src: string, as: 'image' = 'image'): HTMLLinkElement => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  return link;
};

/**
 * Add preload links to document head
 */
export const addPreloadLinks = (sources: string[]): void => {
  const head = document.head;
  sources.forEach(src => {
    const link = createPreloadLink(src);
    head.appendChild(link);
  });
};

/**
 * Remove preload links from document head
 */
export const removePreloadLinks = (): void => {
  const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
  preloadLinks.forEach(link => link.remove());
};