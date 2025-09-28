import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseConfig } from './FirebaseConfigService';

// Default Firebase configuration from environment variables
const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with default config
let app: FirebaseApp = initializeApp(defaultFirebaseConfig);

// Function to reinitialize Firebase with new config
export const reinitializeFirebase = (config: FirebaseConfig): void => {
  try {
    // Delete the existing app instance
    // Note: Firebase doesn't provide a direct way to delete an app instance
    // We'll create a new instance with the new config
    app = initializeApp(config, 'portfolio-app');
    
    // Reinitialize services
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    
    // Re-enable offline persistence
    enableOfflinePersistence();
    
    console.log('Firebase reinitialized with new configuration');
  } catch (error) {
    console.error('Error reinitializing Firebase:', error);
  }
};

// Initialize Firestore
let db: Firestore = getFirestore(app);

// Initialize Storage
let storage: FirebaseStorage = getStorage(app);

// Initialize Auth
let auth: Auth = getAuth(app);

// Enable offline persistence
async function enableOfflinePersistence() {
  try {
    await enableIndexedDbPersistence(db, { forceOwnership: true });
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

// Call the function to enable offline persistence
enableOfflinePersistence();

export { app, db, storage, auth };