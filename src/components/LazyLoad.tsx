import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

type LazyLoadProps = {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
};

/**
 * LazyLoad component for code splitting
 * @param component The component to lazy load
 * @param fallback Optional fallback UI while loading
 * @param props Props to pass to the loaded component
 */
export function LazyLoad({ component, fallback, props = {} }: LazyLoadProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex h-full w-full items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
}