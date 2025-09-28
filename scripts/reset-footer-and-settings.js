// Script to reset footer data and ensure footer feature is enabled in Firebase
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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

// Default footer data
const defaultFooterData = {
  copyright: "© All rights reserved",
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "your.email@example.com",
    twitter: "https://twitter.com/yourusername",
    instagram: "https://instagram.com/yourusername",
    facebook: "https://facebook.com/yourusername"
  }
};

// Function to reset footer data and ensure footer feature is enabled
async function resetFooterAndSettings() {
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
    
    // Reset footer data
    await setDoc(doc(db, 'portfolio', 'footer'), defaultFooterData);
    console.log('Footer data reset successfully!');
    
    // Get current settings
    const settingsDoc = await getDoc(doc(db, 'portfolio', 'settings'));
    if (settingsDoc.exists()) {
      const settingsData = settingsDoc.data();
      
      // Ensure footer feature is enabled
      if (!settingsData.features || settingsData.features.footer !== true) {
        const updatedSettings = {
          ...settingsData,
          features: {
            ...(settingsData.features || {}),
            footer: true
          }
        };
        
        // Update settings
        await setDoc(doc(db, 'portfolio', 'settings'), updatedSettings);
        console.log('Settings updated to enable footer feature!');
      } else {
        console.log('Footer feature is already enabled in settings.');
      }
    } else {
      console.log('Settings document not found. Please run the full initialization script.');
    }
  } catch (error) {
    console.error('Error resetting footer data and settings:', error);
  }
}

// Run the reset function
resetFooterAndSettings()
  .then(() => {
    console.log('Footer data and settings reset complete!');
    // Use 0 for success
    process.exit(0);
  })
  .catch((error) => {
    console.error('Footer data and settings reset failed:', error);
    // Use non-zero for failure
    process.exit(1);
  });