import { isOnline, waitForOnline, retryWhenOnline } from './networkUtils';

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  get: jest.fn(),
});

describe('Network Utilities', () => {
  describe('isOnline', () => {
    it('should return true when navigator.onLine is true', () => {
      // Mock navigator.onLine to return true
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      expect(isOnline()).toBe(true);
    });

    it('should return false when navigator.onLine is false', () => {
      // Mock navigator.onLine to return false
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      expect(isOnline()).toBe(false);
    });
  });

  describe('waitForOnline', () => {
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should resolve immediately if already online', async () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      const promise = waitForOnline();
      await expect(promise).resolves.toBeUndefined();
    });

    it('should wait for online event and resolve', async () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const promise = waitForOnline(1000, 5000);

      // Simulate coming online
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      const onlineHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'online'
      )?.[1] as EventListener;

      if (onlineHandler) {
        onlineHandler(new Event('online'));
      }

      await expect(promise).resolves.toBeUndefined();
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('should resolve when interval check detects online', async () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const promise = waitForOnline(1000, 5000);

      // Fast-forward time and simulate coming online
      jest.advanceTimersByTime(1000);
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      jest.advanceTimersByTime(1000);

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject on timeout', async () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const promise = waitForOnline(1000, 5000);

      // Fast-forward past the timeout
      jest.advanceTimersByTime(6000);

      await expect(promise).rejects.toThrow('Timeout waiting for network connection');
    });
  });

  describe('retryWhenOnline', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should execute function successfully on first try', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

      const result = await retryWhenOnline(mockFn);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry when offline and succeed when back online', async () => {
      // First call fails, second succeeds
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('success');

      // Start offline
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const promise = retryWhenOnline(mockFn, { retryInterval: 1000 });

      // After first failure, simulate coming back online
      jest.advanceTimersByTime(1000);
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

      // Resolve any pending promises
      await Promise.resolve();

      const result = await promise;
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should give up after max retries', async () => {
      const mockError = new Error('Network error');
      const mockFn = jest.fn().mockRejectedValue(mockError);
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const promise = retryWhenOnline(mockFn, { maxRetries: 2, retryInterval: 1000 });

      // Advance time for all retries
      jest.advanceTimersByTime(3000);

      // Resolve any pending promises
      await Promise.resolve();

      await expect(promise).rejects.toThrow(mockError);
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });
});