/**
 * Utility functions for handling network connectivity
 */

/**
 * Checks if the browser is currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Waits for network connectivity to be restored
 * @param checkInterval - How often to check for connectivity (in ms)
 * @param timeout - Maximum time to wait before giving up (in ms)
 * @returns Promise that resolves when online or rejects on timeout
 */
export const waitForOnline = (
  checkInterval: number = 2000,
  timeout: number = 60000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already online, resolve immediately
    if (navigator.onLine) {
      return resolve();
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout waiting for network connection'));
    }, timeout);

    // Set up online event listener
    const onlineHandler = () => {
      cleanup();
      resolve();
    };

    // Set up interval check as a backup
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        cleanup();
        resolve();
      }
    }, checkInterval);

    // Add event listener
    window.addEventListener('online', onlineHandler);

    // Cleanup function
    const cleanup = () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('online', onlineHandler);
    };
  });
};

/**
 * Retries a function when network connectivity is restored
 * @param fn - The function to retry
 * @param retryOptions - Options for retrying
 * @returns Promise that resolves with the function result
 */
export const retryWhenOnline = async <T>(
  fn: () => Promise<T>,
  retryOptions: {
    maxRetries?: number;
    retryInterval?: number;
    timeout?: number;
  } = {}
): Promise<T> => {
  const { maxRetries = 3, retryInterval = 5000, timeout = 60000 } = retryOptions;
  
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      // If we've reached max retries or we're online, don't retry
      if (retries > maxRetries || navigator.onLine) {
        throw error;
      }
      
      console.log(`Network operation failed, waiting for connectivity (attempt ${retries}/${maxRetries})`);
      
      // Wait for network to be restored
      try {
        await waitForOnline(retryInterval, timeout);
        console.log('Network connectivity restored, retrying operation');
      } catch (timeoutError) {
        console.error('Timed out waiting for network connection');
        throw error; // Throw the original error
      }
    }
  }
  
  // This should never be reached due to the throw in the loop
  throw new Error('Failed to execute operation after maximum retries');
};