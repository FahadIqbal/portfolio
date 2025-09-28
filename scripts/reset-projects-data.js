// Reset Projects Data Script
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

// Default projects data with the correct structure
const defaultProjectsData = {
  title: "Projects",
  subtitle: "My recent work",
  projects: [
    {
      id: "project1",
      title: "Enterprise Resource Planning System",
      description: "Led the implementation of a comprehensive ERP system for a manufacturing client, integrating inventory, production, and financial modules.",
      imageUrl: "",
      technologies: ["SAP", "Oracle", "Microsoft Azure", "Power BI"],
      category: "Project Management",
      stats: [
        { label: "Duration", value: "18 months" },
        { label: "Team Size", value: "12" },
        { label: "Budget", value: "$1.5M" }
      ],
      links: {
        demo: "https://example.com/project1",
        github: "https://github.com/yourusername/project1",
        case_study: "https://example.com/case-study1"
      }
    },
    {
      id: "project2",
      title: "Mobile Banking Application",
      description: "Developed a secure mobile banking application with biometric authentication, real-time transaction processing, and personalized financial insights.",
      imageUrl: "",
      technologies: ["React Native", "Node.js", "MongoDB", "AWS"],
      category: "Development",
      stats: [
        { label: "Users", value: "50K+" },
        { label: "Rating", value: "4.8/5" },
        { label: "Transactions", value: "$10M+/month" }
      ],
      links: {
        demo: "https://example.com/project2",
        github: "https://github.com/yourusername/project2"
      }
    },
    {
      id: "project3",
      title: "E-commerce Platform",
      description: "Built a scalable e-commerce platform with advanced search capabilities, recommendation engine, and seamless payment processing.",
      imageUrl: "",
      technologies: ["React", "Express", "PostgreSQL", "Stripe API"],
      category: "Development",
      stats: [
        { label: "Products", value: "10,000+" },
        { label: "Conversion Rate", value: "3.2%" },
        { label: "Revenue", value: "$2M/year" }
      ],
      links: {
        demo: "https://example.com/project3",
        github: "https://github.com/yourusername/project3",
        case_study: "https://example.com/case-study3"
      }
    }
  ]
};

async function resetProjectsData() {
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
    
    // Delete existing projects data
    const projectsDocRef = doc(db, 'portfolio', 'projects');
    await deleteDoc(projectsDocRef);
    console.log('Existing projects data deleted');
    
    // Set new projects data with correct structure
    await setDoc(projectsDocRef, defaultProjectsData);
    console.log('New projects data initialized with correct structure');
    
  } catch (error) {
    console.error('Error resetting projects data:', error);
  }
}

// Run the reset function
resetProjectsData();