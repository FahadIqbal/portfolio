import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './FirebaseInitializer';
import networkService from './NetworkService';
import { auth } from '../auth/firebase';
import { retryWhenOnline } from '../../utils/networkUtils';

// Types for portfolio data
export interface HeroData {
  pm: {
    title: string;
    subtitle: string;
    description: string;
  };
  dev: {
    title: string;
    subtitle: string;
    description: string;
  };
  socialLinks: {
    linkedin: string;
    github: string;
    email: string;
  };
  certifications: {
    pm: string[];
    dev: string[];
  };
  profileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  imageAdjustments?: {
    scale: number;
    position: {
      x: number;
      y: number;
    };
  };
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  photoUrl: string;
  stats: {
    label: string;
    value: string;
  }[];
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  icon: string;
  highlights: string[];
}

export interface ExperienceData {
  title: string;
  subtitle: string;
  pmTrack: ExperienceItem[];
  devTrack: ExperienceItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: string;
  stats: {
    label: string;
    value: string;
  }[];
  links?: {
    demo?: string;
    github?: string;
    case_study?: string;
  };
}

export interface ProjectsData {
  title: string;
  subtitle: string;
  projects: ProjectItem[];
}

export interface SkillCategory {
  id?: string;
  name: string;
  skills: {
    name: string;
    level: number;
  }[];
}

export interface SkillsData {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
}

export interface ToolTechItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  proficiency: number;
  yearsOfExperience?: number;
  link?: string;
}

export interface ToolsTechnologiesData {
  title: string;
  subtitle: string;
  categories: string[];
  tools: ToolTechItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  verificationUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface AchievementItem {
  id: string;
  text: string;
  icon?: string;
}

export interface CertificationsData {
  title: string;
  subtitle: string;
  certifications: CertificationItem[];
  education?: EducationItem[];
  achievements?: AchievementItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  photoUrl: string;
  text: string;
}

export interface TestimonialsData {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

export interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  location: string;
  formEnabled: boolean;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface TrackType {
  id: string;
  name: string;
  icon?: string;
}

export interface FooterData {
  copyright: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface SettingsData {
  siteTitle: string;
  userName: string;
  siteDescription: string;
  siteKeywords: string;
  primaryColor: string;
  secondaryColor: string;
  activeTrack: string;
  trackTypes: TrackType[];
  showTrackToggle: boolean;
  darkMode: boolean;
  analyticsId?: string;
  customCss?: string;
  logoUrl?: string;
  faviconUrl?: string;
  // Section order for portfolio display
  sectionOrder?: string[];
  // Feature toggles
  features: {
    hero: boolean;
    about: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    tools: boolean;
    certifications: boolean;
    testimonials: boolean;
    newsletter: boolean;
    contact: boolean;
    footer: boolean;
  };
}

// Main data service class
class DataService {
  private isNetworkConnected: boolean = true;
  
  constructor() {
    // Subscribe to network status changes
    networkService.subscribeToNetworkChanges((online) => {
      this.isNetworkConnected = online;
      console.log(`DataService: Network status changed to ${online ? 'online' : 'offline'}`);
    });
  }

  // Tools & Technologies section
  async getToolsTechnologiesData(): Promise<ToolsTechnologiesData> {
    try {
      const docRef = doc(db, 'portfolio', 'toolsTechnologies');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ToolsTechnologiesData;
      } else {
        throw new Error('Tools & Technologies data not found');
      }
    } catch (error) {
      console.error('Error getting tools & technologies data:', error);
      throw error;
    }
  }

  async updateToolsTechnologiesData(data: ToolsTechnologiesData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'toolsTechnologies');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating tools & technologies data:', error);
      throw error;
    }
  }

  async uploadToolImage(toolId: string, file: File): Promise<string> {
    try {
      // Use a timestamp in the filename to avoid cache issues
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `tools/${toolId}/${filename}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading tool image:', error);
      throw error;
    }
  }
  // Hero section
  async getHeroData(): Promise<HeroData> {
    try {
      if (!this.isNetworkConnected) {
        console.warn('Attempting to fetch hero data while offline. Using cached data if available.');
      }
      
      // Use retry functionality for network operations
      return await retryWhenOnline(async () => {
        const docRef = doc(db, 'portfolio', 'hero');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return docSnap.data() as HeroData;
        } else {
          throw new Error('Hero data not found');
        }
      }, { maxRetries: 3, retryInterval: 3000 });
    } catch (error) {
      console.error('Error getting hero data:', error);
      
      // Provide more helpful error message for offline errors
      if (!this.isNetworkConnected && error instanceof Error && 
          (error.message.includes('offline') || error.message.includes('network'))) {
        throw new Error('Unable to fetch hero data because you are offline. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async updateHeroData(data: HeroData, profileImageFile?: File): Promise<void> {
    try {
      // Check if we're offline before attempting the update
      if (!this.isNetworkConnected) {
        throw new Error('Cannot update hero data while offline. Please check your internet connection and try again.');
      }
      
      // Use retry functionality for network operations
      await retryWhenOnline(async () => {
        // If a new profile image is provided, upload it first
        if (profileImageFile) {
          // Use a timestamp in the filename to avoid cache issues
          const timestamp = new Date().getTime();
          const filename = `${timestamp}_${profileImageFile.name}`;
          const storageRef = ref(storage, `hero/profile-image/${filename}`);
          await uploadBytes(storageRef, profileImageFile);
          const imageUrl = await getDownloadURL(storageRef);
          data.profileImageUrl = imageUrl;
        }
        
        const docRef = doc(db, 'portfolio', 'hero');
        await setDoc(docRef, data);
      }, { maxRetries: 3, retryInterval: 3000 });
    } catch (error) {
      console.error('Error updating hero data:', error);
      
      // Check if this is a network-related error
      if (!this.isNetworkConnected || 
          (error instanceof Error && 
           (error.message.includes('network') || 
            error.message.includes('offline') || 
            error.message.includes('internet')))) {
        throw new Error('Failed to update hero data due to network issues. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // About section
  async getAboutData(): Promise<AboutData> {
    try {
      const docRef = doc(db, 'portfolio', 'about');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AboutData;
      } else {
        throw new Error('About data not found');
      }
    } catch (error) {
      console.error('Error getting about data:', error);
      throw error;
    }
  }

  async updateAboutData(data: AboutData, photoFile?: File): Promise<void> {
    try {
      // If a new photo is provided, upload it first
      if (photoFile) {
        // Use a timestamp in the filename to avoid cache issues
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${photoFile.name}`;
        const storageRef = ref(storage, `about/${filename}`);
        await uploadBytes(storageRef, photoFile);
        data.photoUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'portfolio', 'about');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating about data:', error);
      throw error;
    }
  }

  // Experience section
  async getExperienceData(): Promise<ExperienceData> {
    try {
      const docRef = doc(db, 'portfolio', 'experience');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ExperienceData;
      } else {
        throw new Error('Experience data not found');
      }
    } catch (error) {
      console.error('Error getting experience data:', error);
      throw error;
    }
  }

  async updateExperienceData(data: ExperienceData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'experience');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating experience data:', error);
      throw error;
    }
  }

  // Projects section
  async getProjectsData(): Promise<ProjectsData> {
    try {
      const docRef = doc(db, 'portfolio', 'projects');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ProjectsData;
      } else {
        throw new Error('Projects data not found');
      }
    } catch (error) {
      console.error('Error getting projects data:', error);
      throw error;
    }
  }

  async updateProjectsData(data: ProjectsData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'projects');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating projects data:', error);
      throw error;
    }
  }

  async uploadProjectImage(projectId: string, file: File): Promise<string> {
    try {
      // Use a timestamp in the filename to avoid cache issues
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `projects/${projectId}/${filename}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  }

  // Skills section
  async getSkillsData(): Promise<SkillsData> {
    try {
      const docRef = doc(db, 'portfolio', 'skills');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SkillsData;
      } else {
        throw new Error('Skills data not found');
      }
    } catch (error) {
      console.error('Error getting skills data:', error);
      throw error;
    }
  }

  async updateSkillsData(data: SkillsData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'skills');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating skills data:', error);
      throw error;
    }
  }

  // Certifications section
  async getCertificationsData(): Promise<CertificationsData> {
    try {
      const docRef = doc(db, 'portfolio', 'certifications');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as CertificationsData;
      } else {
        throw new Error('Certifications data not found');
      }
    } catch (error) {
      console.error('Error getting certifications data:', error);
      throw error;
    }
  }

  async updateCertificationsData(data: CertificationsData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'certifications');
      // Ensure education array exists before saving
      const dataToSave = {
        ...data,
        education: data.education || []
      };
      await setDoc(docRef, dataToSave);
    } catch (error) {
      console.error('Error updating certifications data:', error);
      throw error;
    }
  }

  async uploadCertificationImage(certId: string, file: File): Promise<string> {
    try {
      // Use a timestamp in the filename to avoid cache issues
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `certifications/${certId}/${filename}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading certification image:', error);
      throw error;
    }
  }

  // Testimonials section
  async getTestimonialsData(): Promise<TestimonialsData> {
    try {
      if (!this.isNetworkConnected) {
        console.warn('Attempting to fetch testimonials data while offline. Using cached data if available.');
      }
      
      // Use retry functionality for network operations
      return await retryWhenOnline(async () => {
        const docRef = doc(db, 'portfolio', 'testimonials');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return docSnap.data() as TestimonialsData;
        } else {
          throw new Error('Testimonials data not found');
        }
      }, { maxRetries: 3, retryInterval: 3000 });
    } catch (error) {
      console.error('Error getting testimonials data:', error);
      
      // Provide more helpful error message for offline errors
      if (!this.isNetworkConnected && error instanceof Error && 
          (error.message.includes('offline') || error.message.includes('network'))) {
        throw new Error('Unable to fetch testimonials data because you are offline. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async updateTestimonialsData(data: TestimonialsData): Promise<void> {
    try {
      // Check network connectivity before attempting to update
      if (!this.isNetworkConnected) {
        throw new Error('Cannot update testimonials data while offline. Please check your internet connection and try again.');
      }
      
      // Use retry functionality for network operations
      await retryWhenOnline(async () => {
        const docRef = doc(db, 'portfolio', 'testimonials');
        await setDoc(docRef, data);
      }, { maxRetries: 3, retryInterval: 3000 });
    } catch (error) {
      console.error('Error updating testimonials data:', error);
      
      // Check if this is a network-related error
      if (!this.isNetworkConnected || 
          (error instanceof Error && 
           (error.message.includes('network') || 
            error.message.includes('offline') || 
            error.message.includes('internet')))) {
        throw new Error('Failed to update testimonials data due to network issues. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async uploadTestimonialPhoto(testimonialId: string, file: File): Promise<string> {
    try {
      // Check network connectivity before attempting to upload
      if (!this.isNetworkConnected) {
        throw new Error('Cannot upload testimonial photo while offline. Please check your internet connection and try again.');
      }
      
      // Use retry functionality for network operations
      return await retryWhenOnline(async () => {
        // Use a timestamp in the filename to avoid cache issues
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `testimonials/${testimonialId}/${filename}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      }, { maxRetries: 3, retryInterval: 3000 });
    } catch (error) {
      console.error('Error uploading testimonial photo:', error);
      
      // Check if this is a network-related error
      if (!this.isNetworkConnected || 
          (error instanceof Error && 
           (error.message.includes('network') || 
            error.message.includes('offline') || 
            error.message.includes('internet')))) {
        throw new Error('Failed to upload testimonial photo due to network issues. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // Contact section
  async getContactData(): Promise<ContactData> {
    try {
      const docRef = doc(db, 'portfolio', 'contact');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ContactData;
      } else {
        throw new Error('Contact data not found');
      }
    } catch (error) {
      console.error('Error getting contact data:', error);
      throw error;
    }
  }

  async updateContactData(data: ContactData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'contact');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating contact data:', error);
      throw error;
    }
  }



  // Settings
  async getSettingsData(): Promise<SettingsData> {
    try {
      const docRef = doc(db, 'portfolio', 'settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SettingsData;
      } else {
        throw new Error('Settings data not found');
      }
    } catch (error) {
      console.error('Error getting settings data:', error);
      throw error;
    }
  }

  async updateSettingsData(data: SettingsData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'settings');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating settings data:', error);
      throw error;
    }
  }

  // Footer section
  async getFooterData(): Promise<FooterData> {
    try {
      if (!this.isNetworkConnected) {
        console.warn('Attempting to fetch footer data while offline. Using cached data if available.');
      }
      
      // Use retry functionality for network operations
      return await retryWhenOnline(async () => {
        const docRef = doc(db, 'portfolio', 'footer');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return docSnap.data() as FooterData;
        } else {
          throw new Error('Footer data not found');
        }
      });
    } catch (error) {
      console.error('Error getting footer data:', error);
      throw error;
    }
  }

  async updateFooterData(data: FooterData): Promise<void> {
    try {
      const docRef = doc(db, 'portfolio', 'footer');
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error updating footer data:', error);
      throw error;
    }
  }

  async uploadSiteImage(type: 'logo' | 'favicon', file: File): Promise<string> {
    try {
      // Use a timestamp in the filename to avoid cache issues
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `site/${type}/${filename}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(`Error uploading site ${type}:`, error);
      throw error;
    }
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    try {
      const portfolioRef = collection(db, 'portfolio');
      const snapshot = await getDocs(portfolioRef);
      
      if (snapshot.empty) {
        // Create default data for all sections
        const defaultHeroData: HeroData = {
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
          },
          profileImageUrl: "/profile-photo.jpg"
        };

        await setDoc(doc(db, 'portfolio', 'hero'), defaultHeroData);

        // Default tools & technologies data
        const defaultToolsTechnologiesData: ToolsTechnologiesData = {
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
        
        await setDoc(doc(db, 'portfolio', 'toolsTechnologies'), defaultToolsTechnologiesData);

        // Initialize other sections with default data
        // ... (similar code for other sections)

        console.log('Default portfolio data initialized');
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();