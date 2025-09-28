// Reset Experience Data Script
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

// Default experience data with the correct structure
const defaultExperienceData = {
  title: "Experience",
  subtitle: "My professional journey",
  pmTrack: [
    {
      id: "pm1",
      company: "Enterprise Solutions Inc.",
      role: "Senior Project Manager",
      period: "2018 - Present",
      location: "San Francisco, CA",
      icon: "building",
      highlights: [
        "Lead digital transformation initiatives for Fortune 500 clients",
        "Manage cross-functional teams of 15+ members",
        "Oversee budgets exceeding $2M"
      ]
    },
    {
      id: "pm2",
      company: "Fintech Innovations",
      role: "Agile Coach & Scrum Master",
      period: "2015 - 2018",
      location: "New York, NY",
      icon: "chart-line",
      highlights: [
        "Implemented agile methodologies across 5 product teams",
        "Reduced time-to-market by 40%",
        "Improved sprint velocity by 35%"
      ]
    },
    {
      id: "pm3",
      company: "Tech Solutions Group",
      role: "Project Coordinator",
      period: "2012 - 2015",
      location: "Boston, MA",
      icon: "laptop-code",
      highlights: [
        "Coordinated software development projects from inception to delivery",
        "Ensured on-time completion within budget constraints",
        "Facilitated communication between stakeholders and development teams"
      ]
    }
  ],
  devTrack: [
    {
      id: "dev1",
      company: "Mobile Innovations Inc.",
      role: "Lead Mobile Developer",
      period: "2018 - Present",
      location: "San Francisco, CA",
      icon: "mobile-alt",
      highlights: [
        "Architect and develop cross-platform mobile applications",
        "Use React Native, Flutter, and native iOS/Android technologies",
        "Build solutions for clients in fintech and healthcare sectors"
      ]
    },
    {
      id: "dev2",
      company: "Web Solutions Ltd.",
      role: "Full Stack Developer",
      period: "2015 - 2018",
      location: "Seattle, WA",
      icon: "code",
      highlights: [
        "Developed and maintained scalable web applications",
        "Used React, Node.js, and AWS technologies",
        "Served 100K+ daily active users"
      ]
    },
    {
      id: "dev3",
      company: "App Studio",
      role: "iOS Developer",
      period: "2012 - 2015",
      location: "Austin, TX",
      icon: "apple",
      highlights: [
        "Created native iOS applications with Swift and Objective-C",
        "Focused on performance optimization",
        "Designed intuitive user experiences"
      ]
    }
  ]
};

// Function to reset experience data
async function resetExperienceData() {
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
    
    // Delete the existing experience data
    try {
      await deleteDoc(doc(db, 'portfolio', 'experience'));
      console.log('Existing experience data deleted successfully');
    } catch (error) {
      console.error('Error deleting experience data:', error);
    }
    
    // Set the new experience data with the correct structure
    await setDoc(doc(db, 'portfolio', 'experience'), defaultExperienceData);
    console.log('Experience data reset successfully with the correct structure');
    
  } catch (error) {
    console.error('Error resetting experience data:', error);
  }
}

// Run the reset function
resetExperienceData().then(() => {
  console.log('Experience data reset process completed');
});