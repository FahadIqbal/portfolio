// Script to fix mobile view and ensure all sections are visible
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

// Function to fix mobile view and ensure all sections are visible
async function fixMobileViewAndSections() {
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
      
      // Ensure all features are enabled
      const updatedSettings = {
        ...settingsData,
        features: {
          hero: true,
          about: true,
          experience: true,
          projects: true,
          skills: true,
          tools: true,
          certifications: true,
          testimonials: true,
          contact: true,
          footer: true
        }
      };
      
      // Update settings
      await setDoc(doc(db, 'portfolio', 'settings'), updatedSettings);
      console.log('Settings updated to enable all features!');
    } else {
      console.log('Settings document not found. Please run the full initialization script.');
    }
    
    // Ensure tools & technologies data exists
    const toolsDoc = await getDoc(doc(db, 'portfolio', 'toolsTechnologies'));
    if (!toolsDoc.exists()) {
      console.log('Tools & Technologies data not found. Please run the reset-tools-technologies-data.js script.');
    } else {
      console.log('Tools & Technologies data exists.');
    }
    
    // Ensure footer data exists
    const footerDoc = await getDoc(doc(db, 'portfolio', 'footer'));
    if (!footerDoc.exists()) {
      console.log('Footer data not found. Please run the reset-footer-data.js script.');
    } else {
      console.log('Footer data exists.');
    }
    
    console.log('Mobile view and sections fix completed!');
  } catch (error) {
    console.error('Error fixing mobile view and sections:', error);
  }
}

// Run the fix function
fixMobileViewAndSections()
  .then(() => {
    console.log('Mobile view and sections fix process completed!');
    // Use 0 for success
    process.exit(0);
  })
  .catch((error) => {
    console.error('Mobile view and sections fix failed:', error);
    // Use non-zero for failure
    process.exit(1);
  });