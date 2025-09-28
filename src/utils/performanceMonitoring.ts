import { trackPerformanceMetric, trackError } from './analytics';

// Performance monitoring interface
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

// Web Vitals thresholds
const THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 800, poor: 1800 }
};

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.trackNavigationTiming();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('fid', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.reportMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }
  }

  private trackNavigationTiming() {
    // Wait for page load to complete
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          // Time to First Byte (TTFB)
          const ttfb = navigation.responseStart - navigation.requestStart;
          this.metrics.ttfb = ttfb;
          this.reportMetric('ttfb', ttfb);

          // First Contentful Paint (FCP)
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
            this.reportMetric('fcp', fcpEntry.startTime);
          }

          // Additional timing metrics
          this.reportMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          this.reportMetric('page_load_time', navigation.loadEventEnd - navigation.navigationStart);
          this.reportMetric('dns_lookup_time', navigation.domainLookupEnd - navigation.domainLookupStart);
          this.reportMetric('tcp_connection_time', navigation.connectEnd - navigation.connectStart);
        }
      }, 0);
    });
  }

  private reportMetric(metricName: string, value: number) {
    // Track in analytics
    trackPerformanceMetric(metricName, value);

    // Get threshold status
    const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
    let status = 'unknown';
    
    if (threshold) {
      if (value <= threshold.good) {
        status = 'good';
      } else if (value <= threshold.poor) {
        status = 'needs_improvement';
      } else {
        status = 'poor';
      }
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Performance Metric - ${metricName}: ${value.toFixed(2)}ms (${status})`);
    }

    // Report poor performance as errors
    if (status === 'poor') {
      trackError('performance', `Poor ${metricName}: ${value.toFixed(2)}ms`, 'PerformanceMonitor');
    }
  }

  // Get current metrics snapshot
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Manual performance measurement
  public measureFunction<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    try {
      const result = fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      trackPerformanceMetric(`function_${name}`, duration);
      
      if (import.meta.env.DEV) {
        console.log(`Function ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      trackError('function_error', `Error in ${name} after ${duration.toFixed(2)}ms`, name);
      throw error;
    }
  }

  // Measure async function performance
  public async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      trackPerformanceMetric(`async_function_${name}`, duration);
      
      if (import.meta.env.DEV) {
        console.log(`Async function ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      trackError('async_function_error', `Error in ${name} after ${duration.toFixed(2)}ms`, name);
      throw error;
    }
  }

  // Resource timing analysis
  public analyzeResourceTiming() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const analysis = {
      totalResources: resources.length,
      slowResources: [] as Array<{ name: string; duration: number; size?: number }>,
      largeResources: [] as Array<{ name: string; size: number; duration: number }>,
      totalTransferSize: 0,
      totalEncodedSize: 0
    };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.requestStart;
      const transferSize = (resource as any).transferSize || 0;
      const encodedSize = (resource as any).encodedBodySize || 0;

      analysis.totalTransferSize += transferSize;
      analysis.totalEncodedSize += encodedSize;

      // Flag slow resources (>1s)
      if (duration > 1000) {
        analysis.slowResources.push({
          name: resource.name,
          duration,
          size: transferSize
        });
      }

      // Flag large resources (>500KB)
      if (transferSize > 500000) {
        analysis.largeResources.push({
          name: resource.name,
          size: transferSize,
          duration
        });
      }
    });

    // Report analysis
    trackPerformanceMetric('total_resources', analysis.totalResources);
    trackPerformanceMetric('total_transfer_size', analysis.totalTransferSize);
    trackPerformanceMetric('slow_resources_count', analysis.slowResources.length);
    trackPerformanceMetric('large_resources_count', analysis.largeResources.length);

    if (import.meta.env.DEV) {
      console.log('Resource Timing Analysis:', analysis);
    }

    return analysis;
  }

  // Cleanup observers
  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for manual tracking
export const measurePerformance = (name: string, fn: () => any) => 
  performanceMonitor.measureFunction(name, fn);

export const measureAsyncPerformance = (name: string, fn: () => Promise<any>) => 
  performanceMonitor.measureAsyncFunction(name, fn);

// Track component render times
export const trackComponentRender = (componentName: string, renderTime: number) => {
  trackPerformanceMetric(`component_render_${componentName}`, renderTime);
};

// Track route changes
export const trackRouteChange = (fromRoute: string, toRoute: string, loadTime: number) => {
  trackPerformanceMetric('route_change_time', loadTime);
  trackPerformanceMetric(`route_${toRoute.replace('/', '_')}_load`, loadTime);
};
