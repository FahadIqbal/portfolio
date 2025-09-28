import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatusIndicator from './components/NetworkStatusIndicator';
import MetaUpdater from './components/MetaUpdater';
import StructuredData from './components/StructuredData';
import AboutPage from './components/AboutPage';
import PortfolioPage from './components/PortfolioPage';
import BlogSection from './components/BlogSection';
import BlogPost from './components/BlogPost';
import NewsletterSection from './components/NewsletterSection';
import LyroChat from './components/LyroChat';

import { AuthProvider } from './admin/auth/AuthContext';
import { DataProvider, useData } from './admin/context/DataContext';
import AdminRoute from './admin/AdminRoute';
import { useImagePreloader, useDataImagePreloader } from './hooks/useImagePreloader';

// Analytics and Performance Monitoring
import { trackPageView, trackTrackSwitch, setAnalyticsUserProperties } from './utils/analytics';
import { performanceMonitor, trackRouteChange } from './utils/performanceMonitoring';

// Lazy-loaded components
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const ToolsTechnologies = lazy(() => import('./components/ToolsTechnologies'));
const Certifications = lazy(() => import('./components/Certifications'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center py-8" style={{ position: 'relative', zIndex: 1, visibility: 'visible' }}>
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

// Analytics tracking hook
const useAnalyticsTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    trackPageView(location.pathname, document.title);
    
    // Set user properties for better segmentation
    setAnalyticsUserProperties({
      user_type: 'portfolio_visitor',
      page_type: location.pathname === '/' ? 'homepage' : location.pathname.slice(1)
    });
  }, [location]);
};

// Main portfolio component
const Portfolio = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTrack, setActiveTrackState] = useState<string>('pm');
  const { settingsData, updateSettingsData } = useData();
  
  // Initialize analytics tracking
  useAnalyticsTracking();
  
  // Preload critical images for better performance
  useImagePreloader();
  
  // Track performance metrics
  useEffect(() => {
    // Analyze resource timing after page load
    const timer = setTimeout(() => {
      performanceMonitor.analyzeResourceTiming();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set active track from URL or default to first track type
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackParam = params.get('track');
    
    if (trackParam && settingsData?.trackTypes && settingsData.trackTypes.some(t => t.id === trackParam)) {
      setActiveTrackState(trackParam);
    } else if (settingsData?.trackTypes && settingsData.trackTypes.length > 0 && settingsData.trackTypes[0]?.id) {
      setActiveTrackState(settingsData.trackTypes[0].id);
    }
  }, [settingsData]);
  
  // Function to update activeTrack in settings
  const setActiveTrack = (track: string) => {
    const previousTrack = activeTrack;
    setActiveTrackState(track);
    
    // Track portfolio track switching for analytics
    if (previousTrack !== track) {
      trackTrackSwitch(previousTrack, track);
      
      // Update the URL with the new track
      const url = new URL(window.location.href);
      url.searchParams.set('track', track);
      window.history.pushState({}, '', url);
    }
    
    // Update settings data
    if (settingsData && updateSettingsData) {
      updateSettingsData({
        ...settingsData,
        activeTrack: track
      });
    }
  };
  
  const features = settingsData?.features || {
    hero: true,
    about: true,
    experience: true,
    projects: true,
    skills: true,
    tools: true,
    certifications: true,
    testimonials: true,
    newsletter: true,
    contact: true,
    footer: true
  };
  
  // Default section order if not specified in settings
  const defaultSectionOrder = [
    'hero',
    'about',
    'experience',
    'projects',
    'skills',
    'tools',
    'certifications',
    'testimonials',
    'newsletter',
    'contact'
  ];
  
  // Use section order from settings or default
  const sectionOrder = settingsData?.sectionOrder || defaultSectionOrder;
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply dark mode class based on settings
  useEffect(() => {
    if (settingsData?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settingsData?.darkMode]);

  // Function to render a section based on its ID
  const renderSection = (sectionId: string) => {
    // Ensure features is defined
    if (!features) return null;
    
    // Log section rendering for debugging
    console.log(`Rendering section: ${sectionId}`);
    
    // Common wrapper style for all sections to ensure visibility
    const sectionStyle = {
      display: 'block',
      visibility: 'visible' as const,
      opacity: 1,
      position: 'relative' as const,
      zIndex: 1
    };
    
    switch (sectionId) {
      case 'hero':
        return features.hero ? <div style={sectionStyle}><Hero activeTrack={activeTrack} /></div> : null;
      case 'about':
        return features.about ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <About activeTrack={activeTrack} />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'experience':
        return features.experience ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Experience activeTrack={activeTrack} />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'projects':
        return features.projects ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Projects />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'skills':
        return features.skills ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Skills />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'tools':
        return features.tools ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <ToolsTechnologies />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'certifications':
        return features.certifications ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Certifications />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'testimonials':
        return features.testimonials ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Testimonials />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'newsletter':
        return features.newsletter ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <NewsletterSection />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      case 'contact':
        return features.contact ? (
          <div style={sectionStyle}>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative" style={{ overflow: 'visible' }}>
      <Header activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
      
      {/* Main content */}
      <div className="sections-wrapper" style={{ position: 'relative', zIndex: 2, paddingTop: '0', overflow: 'visible', height: 'auto' }}>
        {/* Render sections based on the order defined in settings */}
        {sectionOrder.map((sectionId, index) => (
          <div 
            key={sectionId} 
            className="section-container mb-4 md:mb-0" 
            style={{ 
              position: 'relative', 
              zIndex: 5, 
              minHeight: '100px', 
              marginBottom: '10px',
              display: 'block',
              visibility: 'visible' as const,
              opacity: 1,
              overflow: 'visible',
              height: 'auto'
            }}
            id={`section-container-${sectionId}`}
          >
            {renderSection(sectionId)}
          </div>
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-5">
        <div 
          className="h-full bg-gray-800 dark:bg-gray-400 transition-all duration-300 ease-out"
          style={{ width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
        ></div>
      </div>
      
      {features.footer && <Footer />}
    </div>
  );
};

function App() {
  const [activeTrack, setActiveTrack] = useState<string>('pm');

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Network status indicator will show when offline */}
            <NetworkStatusIndicator />
            {/* Meta updater component to update document title, favicon, and meta tags */}
            <MetaUpdater />
            {/* Structured data for SEO */}
            <StructuredData />
            <Header activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/blog" element={<BlogSection />} />
                <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin/*" element={<AdminRoute />} />
            </Routes>
            <LyroChat publicKey="7oqqsqvttcicxf9u7hazqmnjoqvk1m51" />
    
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;