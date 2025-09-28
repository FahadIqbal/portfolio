// Reset Certifications Data Script
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

// Default certifications data with the correct structure
const defaultCertificationsData = {
  title: "Certifications",
  subtitle: "My professional credentials",
  certifications: [
    {
      id: "cert1",
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      date: "2018",
      imageUrl: "",
      verificationUrl: "https://www.pmi.org/certifications/verify"
    },
    {
      id: "cert2",
      name: "Certified Scrum Master (CSM)",
      issuer: "Scrum Alliance",
      date: "2017",
      imageUrl: "",
      verificationUrl: "https://www.scrumalliance.org/community/profile/verify-certification"
    },
    
  ],
  education: [
    {
      id: "edu1",
      degree: "Master of Science in Computer Science",
      institution: "University of Technology",
      year: "2012",
      description: "Specialized in Software Engineering and System Architecture"
    },
    {
      id: "edu2",
      degree: "MSc Information Technology (Software Engineering)",
      institution: "International University",
      year: "2010",
      description: "Focus on Advanced Software Development and Project Management"
    }
  ],
  achievements: [
    {
      id: "ach1",
      text: "14+ years of professional experience",
      icon: "Calendar"
    },
    {
      id: "ach2",
      text: "50+ successful project deliveries",
      icon: "CheckCircle"
    },
    {
      id: "ach3",
      text: "Led teams across 3 continents",
      icon: "Award"
    },
    {
      id: "ach4",
      text: "Published 5+ technical articles",
      icon: "Star"
    }
  ]
};

// Function to reset certifications data
async function resetCertificationsData() {
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

    // Delete existing certifications data
    await deleteDoc(doc(db, 'portfolio', 'certifications'));
    console.log('Existing certifications data deleted');

    // Set new certifications data
    await setDoc(doc(db, 'portfolio', 'certifications'), defaultCertificationsData);
    console.log('New certifications data initialized successfully');

    return 'Certifications data reset completed';
  } catch (error) {
    console.error('Error resetting certifications data:', error);
    throw error;
  }
}

// Execute the reset function
resetCertificationsData()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to reset certifications data:', error);
    process.exit(1);
  });