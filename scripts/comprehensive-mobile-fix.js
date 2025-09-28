// Comprehensive script to fix mobile view and admin data reflection issues
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

// Enhanced CSS to fix mobile view issues and ensure data visibility
const enhancedMobileCss = `
/* Enhanced Mobile View Fix */
@media (max-width: 768px) {
  /* Force visibility for all sections */
  section, .section-container, #tools, #footer, .sections-wrapper {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 10 !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    transform: none !important;
    clip: none !important;
    clip-path: none !important;
  }
  
  /* Ensure proper spacing */
  .section-container {
    margin-bottom: 2rem !important;
    padding: 1rem !important;
  }
  
  /* Fix for lazy loading components */
  [data-lazy], .lazy-load {
    display: block !important;
    visibility: visible !important;
  }
  
  /* Fix for tools and technologies section */
  #tools-technologies, .tools-technologies {
    display: block !important;
    visibility: visible !important;
  }
  
  /* Fix for footer */
  footer, .footer {
    display: block !important;
    visibility: visible !important;
    margin-top: 2rem !important;
  }
  
  /* Ensure grid layouts work on mobile */
  .grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }
  
  /* Fix for any hidden elements */
  .hidden {
    display: block !important;
  }
  
  /* Force refresh styles */
  body {
    overflow-x: hidden;
  }
  
  /* Ensure proper text visibility */
  h1, h2, h3, h4, h5, h6, p, span, div {
    color: inherit !important;
  }
}

/* Force refresh animation */
@keyframes forceRefresh {
  0% { opacity: 0.99; }
  100% { opacity: 1; }
}

.force-refresh {
  animation: forceRefresh 0.1s ease-in-out;
}
`;

// Function to comprehensively fix mobile view and data issues
async function comprehensiveMobileFix() {
  try {
    // Authenticate admin
    const adminEmail = process.env.VITE_ADMIN_EMAIL;
    const adminPassword = process.env.VITE_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not found in environment variables');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Successfully authenticated as admin');
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return;
    }
    
    // Get current settings
    const settingsDoc = await getDoc(doc(db, 'portfolio', 'settings'));
    if (settingsDoc.exists()) {
      const settingsData = settingsDoc.data();
      
      // Update settings with comprehensive fixes
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
        },
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
        customCss: enhancedMobileCss,
        // Force refresh timestamp
        lastUpdated: new Date().toISOString(),
        mobileOptimized: true
      };
      
      // Update settings
      await setDoc(doc(db, 'portfolio', 'settings'), updatedSettings);
      console.log('Settings updated with comprehensive mobile fixes!');
    } else {
      console.log('Settings document not found. Creating new settings...');
      
      // Create new settings document
      const newSettings = {
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
        },
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
        customCss: enhancedMobileCss,
        lastUpdated: new Date().toISOString(),
        mobileOptimized: true,
        siteTitle: 'Portfolio',
        siteDescription: 'Professional Portfolio',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        darkMode: false
      };
      
      await setDoc(doc(db, 'portfolio', 'settings'), newSettings);
      console.log('New settings created with mobile optimizations!');
    }
    
    // Verify and fix tools & technologies data
    const toolsDoc = await getDoc(doc(db, 'portfolio', 'toolsTechnologies'));
    if (!toolsDoc.exists()) {
      console.log('Tools & Technologies data not found. Please run reset-tools-technologies-data.js');
    } else {
      console.log('Tools & Technologies data verified.');
      
      // Force update timestamp to trigger refresh
      const toolsData = toolsDoc.data();
      await setDoc(doc(db, 'portfolio', 'toolsTechnologies'), {
        ...toolsData,
        lastUpdated: new Date().toISOString()
      });
      console.log('Tools & Technologies data refreshed.');
    }
    
    // Verify and fix footer data
    const footerDoc = await getDoc(doc(db, 'portfolio', 'footer'));
    if (!footerDoc.exists()) {
      console.log('Footer data not found. Please run reset-footer-data.js');
    } else {
      console.log('Footer data verified.');
      
      // Force update timestamp to trigger refresh
      const footerData = footerDoc.data();
      await setDoc(doc(db, 'portfolio', 'footer'), {
        ...footerData,
        lastUpdated: new Date().toISOString()
      });
      console.log('Footer data refreshed.');
    }
    
    console.log('Comprehensive mobile fix completed!');
    console.log('Please refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('Error in comprehensive mobile fix:', error);
  }
}

// Run the comprehensive fix
comprehensiveMobileFix()
  .then(() => {
    console.log('Comprehensive mobile fix process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Comprehensive mobile fix failed:', error);
    process.exit(1);
  });