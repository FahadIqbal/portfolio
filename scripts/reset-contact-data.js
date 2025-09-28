// Reset Contact Data Script
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure dotenv to load environment variables
dotenv.config();

// Get the directory path for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Default contact data with the correct structure
const defaultContactData = {
  title: "Contact Me",
  subtitle: "Let's work together",
  email: "contact@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  formEnabled: true,
  socialLinks: {
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourhandle"
  }
};

// Function to reset contact data
async function resetContactData() {
  try {
    // Get admin credentials from environment variables
    const adminEmail = process.env.VITE_ADMIN_EMAIL;
    const adminPassword = process.env.VITE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin credentials not found in environment variables');
    }

    // Sign in with admin credentials
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('Admin authenticated successfully');

    // Delete existing contact data
    await deleteDoc(doc(db, 'portfolio', 'contact'));
    console.log('Existing contact data deleted');

    // Set new contact data
    await setDoc(doc(db, 'portfolio', 'contact'), defaultContactData);
    console.log('New contact data initialized successfully');

    return 'Contact data reset completed';
  } catch (error) {
    console.error('Error resetting contact data:', error);
    throw error;
  }
}

// Execute the reset function
resetContactData()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to reset contact data:', error);
    process.exit(1);
  });