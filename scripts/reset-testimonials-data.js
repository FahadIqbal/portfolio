// Reset Testimonials Data Script
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

// Default testimonials data with the correct structure
const defaultTestimonialsData = {
  title: "Testimonials",
  subtitle: "What people say about my work",
  testimonials: [
    {
      id: "testimonial1",
      name: "Sarah Johnson",
      role: "CTO",
      company: "Enterprise Solutions",
      photoUrl: "",
      text: "An exceptional project manager who consistently delivers results. Their strategic approach and leadership skills have been instrumental in the success of our digital transformation initiatives."
    },
    {
      id: "testimonial2",
      name: "Michael Chen",
      role: "Product Director",
      company: "Mobile Innovations",
      photoUrl: "",
      text: "A talented developer with a keen eye for detail and user experience. Their technical expertise and problem-solving abilities have significantly improved our mobile application's performance and user satisfaction."
    },
    {
      id: "testimonial3",
      name: "Emily Rodriguez",
      role: "VP of Engineering",
      company: "Tech Solutions",
      photoUrl: "",
      text: "A versatile professional who excels in both technical implementation and project management. Their ability to bridge the gap between business requirements and technical solutions is truly remarkable."
    }
  ]
};

// Function to reset testimonials data
async function resetTestimonialsData() {
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

    // Delete existing testimonials data
    await deleteDoc(doc(db, 'portfolio', 'testimonials'));
    console.log('Existing testimonials data deleted');

    // Set new testimonials data
    await setDoc(doc(db, 'portfolio', 'testimonials'), defaultTestimonialsData);
    console.log('New testimonials data initialized successfully');

    return 'Testimonials data reset completed';
  } catch (error) {
    console.error('Error resetting testimonials data:', error);
    throw error;
  }
}

// Execute the reset function
resetTestimonialsData()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to reset testimonials data:', error);
    process.exit(1);
  });