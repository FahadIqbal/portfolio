// Reset Tools & Technologies Data Script
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

// Default tools & technologies data with the correct structure
const defaultToolsTechnologiesData = {
  title: "Tools & Technologies",
  subtitle: "My technical toolkit",
  categories: [
    "Frontend",
    "Backend",
    "Mobile",
    "DevOps",
    "Project Management"
  ],
  tools: [
    {
      id: "tool1",
      name: "React",
      description: "A JavaScript library for building user interfaces",
      imageUrl: "",
      category: "Frontend",
      proficiency: 90,
      yearsOfExperience: 4,
      link: "https://reactjs.org"
    },
    {
      id: "tool2",
      name: "Node.js",
      description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
      imageUrl: "",
      category: "Backend",
      proficiency: 85,
      yearsOfExperience: 5,
      link: "https://nodejs.org"
    },
    {
      id: "tool3",
      name: "React Native",
      description: "Framework for building native apps using React",
      imageUrl: "",
      category: "Mobile",
      proficiency: 80,
      yearsOfExperience: 3,
      link: "https://reactnative.dev"
    },
    {
      id: "tool4",
      name: "Docker",
      description: "Platform for developing, shipping, and running applications",
      imageUrl: "",
      category: "DevOps",
      proficiency: 75,
      yearsOfExperience: 3,
      link: "https://www.docker.com"
    },
    {
      id: "tool5",
      name: "JIRA",
      description: "Issue tracking and project management tool",
      imageUrl: "",
      category: "Project Management",
      proficiency: 95,
      yearsOfExperience: 6,
      link: "https://www.atlassian.com/software/jira"
    }
  ]
};

// Function to reset tools & technologies data
async function resetToolsTechnologiesData() {
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

    // Delete existing tools & technologies data
    await deleteDoc(doc(db, 'portfolio', 'toolsTechnologies'));
    console.log('Existing tools & technologies data deleted');

    // Set new tools & technologies data
    await setDoc(doc(db, 'portfolio', 'toolsTechnologies'), defaultToolsTechnologiesData);
    console.log('New tools & technologies data initialized successfully');

    return 'Tools & technologies data reset completed';
  } catch (error) {
    console.error('Error resetting tools & technologies data:', error);
    throw error;
  }
}

// Execute the reset function
resetToolsTechnologiesData()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to reset tools & technologies data:', error);
    process.exit(1);
  });