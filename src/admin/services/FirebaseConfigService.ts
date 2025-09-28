import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './FirebaseInitializer';
import { retryWhenOnline } from '../../utils/networkUtils';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface AdminConfig {
  adminEmail: string;
  adminPassword: string;
}

export interface SaasConfig {
  firebase: FirebaseConfig;
  admin: AdminConfig;
  initialized: boolean;
}

const DEFAULT_CONFIG: SaasConfig = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
  },
  admin: {
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL || '',
    adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || ''
  },
  initialized: false
};

class FirebaseConfigService {
  private isNetworkConnected: boolean = true;
  
  constructor() {
    // This will be initialized by the NetworkService subscription
  }

  setNetworkStatus(isConnected: boolean) {
    this.isNetworkConnected = isConnected;
  }

  async getFirebaseConfig(): Promise<SaasConfig> {
    return await retryWhenOnline(async () => {
      try {
        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('User not authenticated when trying to get Firebase config');
          console.log('Auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
          throw new Error('Authentication required to access Firebase configuration');
        }

        console.log('Attempting to fetch Firebase config with user:', currentUser.email);
        const docRef = doc(db, 'config', 'firebase');
        
        try {
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            console.log('Firebase config loaded successfully');
            return docSnap.data() as SaasConfig;
          } else {
            // If no config exists, create one with default values
            console.log('No Firebase config found, creating default config');
            await this.saveFirebaseConfig(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
          }
        } catch (firestoreError) {
          console.error('Firestore error when getting config:', firestoreError);
          if (firestoreError instanceof Error && firestoreError.message.includes('permission-denied')) {
            throw new Error('Permission denied: Check Firestore security rules for config collection');
          }
          throw firestoreError;
        }
      } catch (error) {
        console.error('Error getting Firebase config:', error);
        throw error;
      }
    }, { maxRetries: 5, retryInterval: 3000, timeout: 90000 });
  }

  async saveFirebaseConfig(config: SaasConfig): Promise<void> {
    return await retryWhenOnline(async () => {
      try {
        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('User not authenticated when trying to save Firebase config');
          console.log('Auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
          throw new Error('Authentication required to save Firebase configuration');
        }

        console.log('Attempting to save Firebase config with user:', currentUser.email);
        const docRef = doc(db, 'config', 'firebase');
        
        try {
          await setDoc(docRef, config);
          console.log('Firebase config saved successfully');
        } catch (firestoreError) {
          console.error('Firestore error when saving config:', firestoreError);
          if (firestoreError instanceof Error && firestoreError.message.includes('permission-denied')) {
            throw new Error('Permission denied: Check Firestore security rules for config collection');
          }
          throw firestoreError;
        }
      } catch (error) {
        console.error('Error saving Firebase config:', error);
        throw error;
      }
    }, { maxRetries: 5, retryInterval: 3000, timeout: 90000 });
  }

  async initializeConfig(): Promise<void> {
    try {
      const config = await this.getFirebaseConfig();
      
      if (!config.initialized) {
        // Set initialized to true and save
        config.initialized = true;
        await this.saveFirebaseConfig(config);
      }
    } catch (error) {
      console.error('Error initializing config:', error);
      throw error;
    }
  }
}

const firebaseConfigService = new FirebaseConfigService();
export default firebaseConfigService;