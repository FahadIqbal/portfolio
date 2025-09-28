import { useEffect, useContext } from 'react';
import { DataContext } from '../admin/context/DataContext';

const MetaUpdater = () => {
  const { settingsData } = useContext(DataContext) || {};

  useEffect(() => {
    if (!settingsData) return;

    // Get the current domain
    const domain = window.location.origin;

    // Update document title
    if (settingsData.siteTitle) {
      document.title = settingsData.siteTitle;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (settingsData.siteDescription) {
      if (metaDescription) {
        metaDescription.setAttribute('content', settingsData.siteDescription);
      } else {
        const newMetaDescription = document.createElement('meta');
        newMetaDescription.setAttribute('name', 'description');
        newMetaDescription.setAttribute('content', settingsData.siteDescription);
        document.head.appendChild(newMetaDescription);
      }
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (settingsData.siteKeywords) {
      if (metaKeywords) {
        metaKeywords.setAttribute('content', settingsData.siteKeywords);
      } else {
        const newMetaKeywords = document.createElement('meta');
        newMetaKeywords.setAttribute('name', 'keywords');
        newMetaKeywords.setAttribute('content', settingsData.siteKeywords);
        document.head.appendChild(newMetaKeywords);
      }
    }

    // Update Open Graph meta tags
    updateMetaTag('og:title', 'property', settingsData.siteTitle || 'Portfolio');
    updateMetaTag('og:description', 'property', settingsData.siteDescription || 'Professional portfolio');
    updateMetaTag('og:url', 'property', domain);
    
    // Update Twitter Card meta tags
    updateMetaTag('twitter:title', 'name', settingsData.siteTitle || 'Portfolio');
    updateMetaTag('twitter:description', 'name', settingsData.siteDescription || 'Professional portfolio');
    updateMetaTag('twitter:url', 'name', domain);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', domain);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', domain);
      document.head.appendChild(canonicalLink);
    }

    // Update favicon
    if (settingsData.faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]');
      
      // Determine if this is a data URL (SVG) or a regular URL
      const isDataUrl = settingsData.faviconUrl.startsWith('data:');
      
      if (favicon) {
        favicon.setAttribute('href', settingsData.faviconUrl);
        
        // If it's a data URL, set the type attribute to image/svg+xml
        if (isDataUrl && settingsData.faviconUrl.includes('svg')) {
          favicon.setAttribute('type', 'image/svg+xml');
        } else {
          // Remove type attribute if it exists and it's not an SVG
          if (favicon.hasAttribute('type') && !settingsData.faviconUrl.includes('svg')) {
            favicon.removeAttribute('type');
          }
        }
      } else {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        favicon.setAttribute('href', settingsData.faviconUrl);
        
        // Set the type attribute if it's an SVG
        if (isDataUrl && settingsData.faviconUrl.includes('svg')) {
          favicon.setAttribute('type', 'image/svg+xml');
        }
        
        document.head.appendChild(favicon);
      }
      
      // Also update apple-touch-icon if favicon is available
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleTouchIcon) {
        appleTouchIcon.setAttribute('href', settingsData.faviconUrl);
      } else {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
        appleTouchIcon.setAttribute('href', settingsData.faviconUrl);
        document.head.appendChild(appleTouchIcon);
      }
    }
    
    // Update Open Graph and Twitter image if logo is available
    if (settingsData.logoUrl) {
      updateMetaTag('og:image', 'property', settingsData.logoUrl);
      updateMetaTag('twitter:image', 'name', settingsData.logoUrl);
    }
  }, [settingsData]);
  
  // Helper function to update or create meta tags
  const updateMetaTag = (name: string, attributeName: 'name' | 'property', content: string) => {
    const selector = `meta[${attributeName}="${name}"]`;
    const metaTag = document.querySelector(selector);
    
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.setAttribute(attributeName, name);
      newMetaTag.setAttribute('content', content);
      document.head.appendChild(newMetaTag);
    }
  };

  // This component doesn't render anything
  return null;
};

export default MetaUpdater;