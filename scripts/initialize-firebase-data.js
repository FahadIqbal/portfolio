// Initialize Firebase Data Script
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
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

// Default data for portfolio sections
const defaultHeroData = {
  pm: {
    title: "Certified Project Manager & Scrum Master",
    subtitle: "14+ Years Leading Agile Teams & Digital Transformation",
    description: "PMP, CSM, PSM certified professional specializing in cross-functional team leadership, stakeholder management, and delivering complex projects in fintech and enterprise environments."
  },
  dev: {
    title: "Senior Full Stack Mobile Developer",
    subtitle: "14+ Years Building Scalable Mobile & Web Solutions",
    description: "Expert in iOS, Android, and full-stack development with extensive experience in AI-powered applications, CI/CD pipelines, and large-scale system architecture."
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    email: "your.email@example.com"
  },
  certifications: {
    pm: ["PMP Certified", "CSM", "PSM", "ITIL-4"],
    dev: ["iOS Expert", "Android", "Flutter", "AI/ML"]
  }
};

const defaultAboutData = {
  pm: {
    headline: "Experienced Project Manager & Agile Coach",
    bio: "I'm a certified project management professional with over 14 years of experience leading cross-functional teams and delivering complex projects. My expertise spans agile methodologies, digital transformation, and stakeholder management.",
    photoUrl: ""
  },
  dev: {
    headline: "Full Stack Mobile Developer & System Architect",
    bio: "I'm a senior developer with 14+ years of experience building scalable mobile and web applications. I specialize in iOS, Android, React Native, and full-stack development with a focus on performance optimization and clean architecture.",
    photoUrl: ""
  }
};

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

const defaultSkillsData = {
  categories: [
    {
      name: "Project Management",
      skills: [
        { name: "Agile Methodologies", level: 95 },
        { name: "Scrum", level: 90 },
        { name: "Kanban", level: 85 },
        { name: "Budgeting", level: 80 },
        { name: "Risk Management", level: 85 }
      ]
    },
    {
      name: "Development",
      skills: [
        { name: "iOS (Swift)", level: 90 },
        { name: "Android (Kotlin)", level: 85 },
        { name: "React Native", level: 80 },
        { name: "JavaScript/TypeScript", level: 85 },
        { name: "Node.js", level: 80 }
      ]
    },
    {
      name: "Tools & Technologies",
      skills: [
        { name: "JIRA", level: 90 },
        { name: "Git", level: 85 },
        { name: "AWS", level: 75 },
        { name: "Docker", level: 70 },
        { name: "CI/CD", level: 80 }
      ]
    }
  ]
};

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
    {
      id: "cert3",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2019",
      imageUrl: "",
      verificationUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert4",
      name: "iOS Development Certification",
      issuer: "Apple Developer Academy",
      date: "2016",
      imageUrl: "",
      verificationUrl: "https://developer.apple.com/programs/"
    }
  ]
};

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
    contact: true,
    footer: true
  }
};

// Function to initialize default data
async function initializeDefaultData() {
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
    
    // Check if portfolio collection exists and has data
    const portfolioRef = collection(db, 'portfolio');
    const snapshot = await getDocs(portfolioRef);
    
    if (!snapshot.empty) {
      console.log('Portfolio data already exists. Skipping initialization.');
      return;
    }
    
    // Initialize all sections with default data
    await setDoc(doc(db, 'portfolio', 'hero'), defaultHeroData);
    await setDoc(doc(db, 'portfolio', 'about'), defaultAboutData);
    await setDoc(doc(db, 'portfolio', 'experience'), defaultExperienceData);
    await setDoc(doc(db, 'portfolio', 'projects'), defaultProjectsData);
    await setDoc(doc(db, 'portfolio', 'skills'), defaultSkillsData);
    await setDoc(doc(db, 'portfolio', 'toolsTechnologies'), defaultToolsTechnologiesData);
    await setDoc(doc(db, 'portfolio', 'certifications'), defaultCertificationsData);
    await setDoc(doc(db, 'portfolio', 'testimonials'), defaultTestimonialsData);
    await setDoc(doc(db, 'portfolio', 'contact'), defaultContactData);
    await setDoc(doc(db, 'portfolio', 'footer'), defaultFooterData);
    await setDoc(doc(db, 'portfolio', 'settings'), defaultSettingsData);
    
    console.log('Default portfolio data initialized successfully!');
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

// Run the initialization
initializeDefaultData()
  .then(() => {
    console.log('Firebase setup complete!');
    // Use 0 for success
    process.exit(0);
  })
  .catch((error) => {
    console.error('Firebase setup failed:', error);
    // Use non-zero for failure
    process.exit(1);
  });