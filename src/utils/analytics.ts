import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Custom event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Track page views
export const trackPageView = (pageName: string, pageTitle?: string) => {
  logEvent(analytics, 'page_view', {
    page_title: pageTitle || pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
    custom_page_name: pageName
  });
};

// Track user interactions
export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  logEvent(analytics, action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Track portfolio track switching
export const trackTrackSwitch = (fromTrack: string, toTrack: string) => {
  logEvent(analytics, 'track_switch', {
    from_track: fromTrack,
    to_track: toTrack,
    event_category: 'portfolio_navigation'
  });
};

// Track project views
export const trackProjectView = (projectName: string, projectCategory: string) => {
  logEvent(analytics, 'project_view', {
    project_name: projectName,
    project_category: projectCategory,
    event_category: 'portfolio_engagement'
  });
};

// Track contact form interactions
export const trackContactFormEvent = (action: 'start' | 'submit' | 'error', formType?: string) => {
  logEvent(analytics, 'contact_form', {
    form_action: action,
    form_type: formType || 'general',
    event_category: 'lead_generation'
  });
};

// Track blog interactions
export const trackBlogEvent = (action: 'view' | 'share' | 'comment', postTitle?: string) => {
  logEvent(analytics, 'blog_interaction', {
    blog_action: action,
    post_title: postTitle,
    event_category: 'content_engagement'
  });
};

// Track skill/technology clicks
export const trackSkillClick = (skillName: string, skillCategory: string) => {
  logEvent(analytics, 'skill_click', {
    skill_name: skillName,
    skill_category: skillCategory,
    event_category: 'portfolio_engagement'
  });
};

// Track download events (resume, etc.)
export const trackDownload = (fileName: string, fileType: string) => {
  logEvent(analytics, 'file_download', {
    file_name: fileName,
    file_type: fileType,
    event_category: 'resource_access'
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string, action: 'profile_visit' | 'share') => {
  logEvent(analytics, 'social_interaction', {
    social_platform: platform,
    social_action: action,
    event_category: 'social_engagement'
  });
};

// Track newsletter subscription
export const trackNewsletterEvent = (action: 'subscribe' | 'unsubscribe' | 'error') => {
  logEvent(analytics, 'newsletter', {
    newsletter_action: action,
    event_category: 'lead_generation'
  });
};

// Track admin panel usage (for portfolio owner)
export const trackAdminEvent = (action: string, section?: string) => {
  logEvent(analytics, 'admin_action', {
    admin_action: action,
    admin_section: section,
    event_category: 'admin_usage'
  });
};

// Set user properties for better segmentation
export const setAnalyticsUserProperties = (properties: Record<string, string>) => {
  setUserProperties(analytics, properties);
};

// Track performance metrics
export const trackPerformanceMetric = (metricName: string, value: number, unit?: string) => {
  logEvent(analytics, 'performance_metric', {
    metric_name: metricName,
    metric_value: value,
    metric_unit: unit || 'ms',
    event_category: 'performance'
  });
};

// Track error events
export const trackError = (errorType: string, errorMessage: string, component?: string) => {
  logEvent(analytics, 'error_event', {
    error_type: errorType,
    error_message: errorMessage,
    error_component: component,
    event_category: 'errors'
  });
};

// Enhanced ecommerce tracking for potential future use
export const trackPurchase = (transactionId: string, value: number, currency: string = 'USD') => {
  logEvent(analytics, 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    event_category: 'ecommerce'
  });
};
