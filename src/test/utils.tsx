import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock functions for common use cases
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
  
  vi.stubGlobal('IntersectionObserver', vi.fn(() => mockObserver));
  return mockObserver;
};

export const mockScrollTo = () => {
  const mockScrollTo = vi.fn();
  vi.stubGlobal('scrollTo', mockScrollTo);
  return mockScrollTo;
};

// Helper to create mock props
export const createMockProps = <T extends Record<string, any>>(overrides: Partial<T> = {}): T => {
  return {
    ...overrides,
  } as T;
};

// Helper to wait for animations
export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 100));

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };