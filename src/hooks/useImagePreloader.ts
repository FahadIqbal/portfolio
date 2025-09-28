import { useEffect } from 'react';
import { preloadImagesWithPriority } from '../utils/imagePreloader';

/**
 * Hook to preload critical images on app startup
 */
export const useImagePreloader = () => {
  useEffect(() => {
    // Define critical images that should be preloaded immediately
    const criticalImages = [
      '/placeholder-profile.jpg',
      '/profile-photo.jpg',
    ];

    // Define less critical images that can be preloaded after critical ones
    const secondaryImages: string[] = [
      // Add project images, testimonial images, etc. here if needed
    ];

    // Preload images with priority
    preloadImagesWithPriority(criticalImages, secondaryImages);
  }, []);
};

/**
 * Hook to preload images from data context
 */
export const useDataImagePreloader = (heroData?: any, projectsData?: any, testimonialsData?: any) => {
  useEffect(() => {
    const imagesToPreload: string[] = [];

    // Add hero profile image
    if (heroData?.profileImageUrl) {
      imagesToPreload.push(heroData.profileImageUrl);
    }

    // Add project images
    if (projectsData?.length > 0) {
      projectsData.forEach((project: any) => {
        if (project.image) {
          imagesToPreload.push(project.image);
        }
      });
    }

    // Add testimonial images
    if (testimonialsData?.length > 0) {
      testimonialsData.forEach((testimonial: any) => {
        if (testimonial.image) {
          imagesToPreload.push(testimonial.image);
        }
      });
    }

    // Preload all collected images
    if (imagesToPreload.length > 0) {
      preloadImagesWithPriority(imagesToPreload.slice(0, 3), imagesToPreload.slice(3));
    }
  }, [heroData, projectsData, testimonialsData]);
};