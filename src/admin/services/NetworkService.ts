import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getApp } from 'firebase/app';

class NetworkService {
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    // Initialize network listeners
    window.addEventListener('online', this.handleNetworkChange.bind(this));
    window.addEventListener('offline', this.handleNetworkChange.bind(this));
  }

  /**
   * Enable Firebase offline persistence
   */
  async enableOfflinePersistence(): Promise<void> {
    try {
      const db = getFirestore(getApp());
      
      // Enable offline persistence with unlimited cache size
      await enableIndexedDbPersistence(db, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      });
      
      console.log('Firebase offline persistence enabled successfully');
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firebase persistence failed: Multiple tabs open');
      } else if (error.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firebase persistence not supported in this browser');
      } else {
        console.error('Error enabling Firebase persistence:', error);
      }
    }
  }

  /**
   * Check if the application is currently online
   */
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to network status changes
   */
  subscribeToNetworkChanges(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current status
    callback(this.isOnline);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Handle network status changes
   */
  private handleNetworkChange(): void {
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;
    
    // Only notify if status actually changed
    if (wasOnline !== this.isOnline) {
      console.log(`Network status changed: ${this.isOnline ? 'online' : 'offline'}`);
      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners of network status change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }
}

// Create singleton instance
const networkService = new NetworkService();

export default networkService;