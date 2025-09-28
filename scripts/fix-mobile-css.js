// Script to fix mobile CSS issues
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';

// Initialize environment variables
dotenv.config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Custom CSS to fix mobile view issues
const customCss = `
/* Fix for mobile view */
@media (max-width: 768px) {
  section, .section-container {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 10 !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
  }
  
  #tools, #footer {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .sections-wrapper {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 5 !important;
    overflow: visible !important;
  }
}
`;

// Function to fix mobile CSS issues
async function fixMobileCss() {
  try {
    // Check if admin user exists, if not create one
    const adminEmail = process.env.VITE_ADMIN_EMAIL;
    const adminPassword = process.env.VITE_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not found in environment variables');
      return;
    }
    
    try {
      // Try to sign in with admin credentials
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Successfully authenticated as admin');
    } catch (error) {
      console.error('Error authenticating admin:', error);
      console.log('Please create an admin user in the Firebase console');
      return;
    }
    
    // Get current settings
    const settingsDoc = await getDoc(doc(db, 'portfolio', 'settings'));
    if (settingsDoc.exists()) {
      const settingsData = settingsDoc.data();
      
      // Update custom CSS in settings
      const updatedSettings = {
        ...settingsData,
        customCss: (settingsData.customCss || '') + customCss
      };
      
      // Update settings
      await setDoc(doc(db, 'portfolio', 'settings'), updatedSettings);
      console.log('Settings updated with custom CSS for mobile view!');
    } else {
      console.log('Settings document not found. Please run the full initialization script.');
    }
    
    console.log('Mobile CSS fix completed!');
  } catch (error) {
    console.error('Error fixing mobile CSS:', error);
  }
}

// Run the fix function
fixMobileCss()
  .then(() => {
    console.log('Mobile CSS fix process completed!');
    // Use 0 for success
    process.exit(0);
  })
  .catch((error) => {
    console.error('Mobile CSS fix failed:', error);
    // Use non-zero for failure
    process.exit(1);
  });