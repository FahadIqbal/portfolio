// Reset Settings Data Script
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

// Default settings data with the correct structure
const defaultSettingsData = {
  siteTitle: "Professional Portfolio | Project Manager & Developer",
  siteDescription: "Experienced project manager and developer with expertise in agile methodologies, mobile development, and enterprise solutions.",
  siteKeywords: "project manager, developer, agile, mobile, portfolio",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  activeTrack: "pm",
  trackTypes: [
    { id: "pm", name: "Project Manager", icon: "Briefcase" },
    { id: "dev", name: "Developer", icon: "Code" }
  ],
  showTrackToggle: true,
  analyticsId: "",
  customCss: "",
  // Default section order
  sectionOrder: [
    'hero',
    'about',
    'experience',
    'projects',
    'skills',
    'tools',
    'certifications',
    'testimonials',
    'contact'
  ],
  // All features enabled by default
  features: {
    hero: true,
    about: true,
    experience: true,
    projects: true,
    skills: true,
    tools: true,
    certifications: true,
    testimonials: true,
    contact: true
  }
};

// Function to reset settings data
async function resetSettingsData() {
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

    // Delete existing settings data
    await deleteDoc(doc(db, 'portfolio', 'settings'));
    console.log('Existing settings data deleted');

    // Set new settings data
    await setDoc(doc(db, 'portfolio', 'settings'), defaultSettingsData);
    console.log('New settings data initialized successfully');

    return 'Settings data reset completed';
  } catch (error) {
    console.error('Error resetting settings data:', error);
    throw error;
  }
}

// Execute the reset function
resetSettingsData()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to reset settings data:', error);
    process.exit(1);
  });