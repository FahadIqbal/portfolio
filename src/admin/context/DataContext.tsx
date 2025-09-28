import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService, HeroData, AboutData, ExperienceData, ProjectsData, SkillsData, CertificationsData, TestimonialsData, ContactData, SettingsData, ToolsTechnologiesData, FooterData } from '../services/DataService';
import networkService from '../services/NetworkService';
import { isOnline } from '../../utils/networkUtils';

interface DataContextType {
  // Data states
  heroData: HeroData | null;
  aboutData: AboutData | null;
  experienceData: ExperienceData | null;
  projectsData: ProjectsData | null;
  skillsData: SkillsData | null;
  toolsTechnologiesData: ToolsTechnologiesData | null;
  certificationsData: CertificationsData | null;
  testimonialsData: TestimonialsData | null;
  contactData: ContactData | null;
  footerData: FooterData | null;
  settingsData: SettingsData | null;
  
  // Network state
  isOnline: boolean;
  
  // Loading states
  isLoading: {
    hero: boolean;
    about: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    toolsTechnologies: boolean;
    certifications: boolean;
    testimonials: boolean;
    newsletter: boolean;
    contact: boolean;
    footer: boolean;
    settings: boolean;
  };
  
  // Error states
  errors: {
    hero: string | null;
    about: string | null;
    experience: string | null;
    projects: string | null;
    skills: string | null;
    toolsTechnologies: string | null;
    certifications: string | null;
    testimonials: string | null;
    newsletter: string | null;
    contact: string | null;
    footer: string | null;
    settings: string | null;
  };
  
  // Update methods
  updateHeroData: (data: HeroData, profileImageFile?: File) => Promise<void>;
  updateAboutData: (data: AboutData, photoFile?: File) => Promise<void>;
  updateExperienceData: (data: ExperienceData) => Promise<void>;
  updateProjectsData: (data: ProjectsData) => Promise<void>;
  uploadProjectImage: (projectId: string, file: File) => Promise<string>;
  updateSkillsData: (data: SkillsData) => Promise<void>;
  updateToolsTechnologiesData: (data: ToolsTechnologiesData) => Promise<void>;
  uploadToolImage: (toolId: string, file: File) => Promise<string>;
  updateCertificationsData: (data: CertificationsData) => Promise<void>;
  uploadCertificationImage: (certId: string, file: File) => Promise<string>;
  updateTestimonialsData: (data: TestimonialsData) => Promise<void>;
  uploadTestimonialPhoto: (testimonialId: string, file: File) => Promise<string>;
  updateContactData: (data: ContactData) => Promise<void>;
  updateFooterData: (data: FooterData) => Promise<void>;
  updateSettingsData: (data: SettingsData) => Promise<void>;
  uploadSiteImage: (type: 'logo' | 'favicon', file: File) => Promise<string>;
  
  // Refresh methods
  refreshHeroData: () => Promise<void>;
  refreshAboutData: () => Promise<void>;
  refreshExperienceData: () => Promise<void>;
  refreshProjectsData: () => Promise<void>;
  refreshSkillsData: () => Promise<void>;
  refreshToolsTechnologiesData: () => Promise<void>;
  refreshCertificationsData: () => Promise<void>;
  refreshTestimonialsData: () => Promise<void>;
  refreshContactData: () => Promise<void>;
  refreshFooterData: () => Promise<void>;
  refreshSettingsData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const [toolsTechnologiesData, setToolsTechnologiesData] = useState<ToolsTechnologiesData | null>(null);
  const [certificationsData, setCertificationsData] = useState<CertificationsData | null>(null);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  
  // Network state
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(isOnline());
  
  // Effect to listen for network status changes
  useEffect(() => {
    const handleNetworkChange = (isConnected: boolean) => {
      setIsNetworkOnline(isConnected);
      
      // If we just came back online, refresh data
      if (isConnected) {
        console.log('Network connection restored. Refreshing data...');
        refreshAllData();
      }
    };
    
    // Subscribe to network status changes
    const unsubscribe = networkService.subscribeToNetworkChanges(handleNetworkChange);
    
    // Also listen to browser's online/offline events as a backup
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    hero: false,
    about: false,
    experience: false,
    projects: false,
    skills: false,
    toolsTechnologies: false,
    certifications: false,
    testimonials: false,
    newsletter: false,
    contact: false,
    footer: false,
    settings: false,
  });
  
  // Error states
  const [errors, setErrors] = useState({
    hero: null as string | null,
    about: null as string | null,
    experience: null as string | null,
    projects: null as string | null,
    skills: null as string | null,
    toolsTechnologies: null as string | null,
    certifications: null as string | null,
    testimonials: null as string | null,
    newsletter: null as string | null,
    contact: null as string | null,
    footer: null as string | null,
    settings: null as string | null,
  });

  // Fetch methods
  const refreshHeroData = async () => {
    setIsLoading(prev => ({ ...prev, hero: true }));
    setErrors(prev => ({ ...prev, hero: null }));
    
    try {
      const data = await dataService.getHeroData();
      setHeroData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, hero: 'Failed to load hero data' }));
      console.error('Error fetching hero data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, hero: false }));
    }
  };

  const refreshAboutData = async () => {
    setIsLoading(prev => ({ ...prev, about: true }));
    setErrors(prev => ({ ...prev, about: null }));
    
    try {
      const data = await dataService.getAboutData();
      setAboutData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, about: 'Failed to load about data' }));
      console.error('Error fetching about data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, about: false }));
    }
  };

  const refreshExperienceData = async () => {
    setIsLoading(prev => ({ ...prev, experience: true }));
    setErrors(prev => ({ ...prev, experience: null }));
    
    try {
      console.log('Fetching experience data...');
      const data = await dataService.getExperienceData();
      console.log('Experience data fetched successfully:', data);
      setExperienceData(data);
    } catch (error) {
      console.error('Error fetching experience data:', error);
      setErrors(prev => ({ ...prev, experience: 'Failed to load experience data' }));
    } finally {
      setIsLoading(prev => ({ ...prev, experience: false }));
    }
  };

  const refreshProjectsData = async () => {
    setIsLoading(prev => ({ ...prev, projects: true }));
    setErrors(prev => ({ ...prev, projects: null }));
    
    try {
      const data = await dataService.getProjectsData();
      setProjectsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, projects: 'Failed to load projects data' }));
      console.error('Error fetching projects data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const refreshSkillsData = async () => {
    setIsLoading(prev => ({ ...prev, skills: true }));
    setErrors(prev => ({ ...prev, skills: null }));
    
    try {
      const data = await dataService.getSkillsData();
      setSkillsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, skills: 'Failed to load skills data' }));
      console.error('Error fetching skills data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, skills: false }));
    }
  };

  const refreshToolsTechnologiesData = async () => {
    setIsLoading(prev => ({ ...prev, toolsTechnologies: true }));
    setErrors(prev => ({ ...prev, toolsTechnologies: null }));
    
    try {
      const data = await dataService.getToolsTechnologiesData();
      setToolsTechnologiesData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, toolsTechnologies: 'Failed to load tools & technologies data' }));
      console.error('Error fetching tools & technologies data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, toolsTechnologies: false }));
    }
  };

  const refreshCertificationsData = async () => {
    setIsLoading(prev => ({ ...prev, certifications: true }));
    setErrors(prev => ({ ...prev, certifications: null }));
    
    try {
      const data = await dataService.getCertificationsData();
      setCertificationsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, certifications: 'Failed to load certifications data' }));
      console.error('Error fetching certifications data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, certifications: false }));
    }
  };

  const refreshTestimonialsData = async () => {
    setIsLoading(prev => ({ ...prev, testimonials: true }));
    setErrors(prev => ({ ...prev, testimonials: null }));
    
    try {
      const data = await dataService.getTestimonialsData();
      setTestimonialsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, testimonials: 'Failed to load testimonials data' }));
      console.error('Error fetching testimonials data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, testimonials: false }));
    }
  };

  const refreshContactData = async () => {
    setIsLoading(prev => ({ ...prev, contact: true }));
    setErrors(prev => ({ ...prev, contact: null }));
    
    try {
      const data = await dataService.getContactData();
      setContactData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, contact: 'Failed to load contact data' }));
      console.error('Error fetching contact data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, contact: false }));
    }
  };

  const refreshFooterData = async () => {
    setIsLoading(prev => ({ ...prev, footer: true }));
    setErrors(prev => ({ ...prev, footer: null }));
    
    try {
      const data = await dataService.getFooterData();
      setFooterData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, footer: 'Failed to load footer data' }));
      console.error('Error fetching footer data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, footer: false }));
    }
  };

  const refreshSettingsData = async () => {
    setIsLoading(prev => ({ ...prev, settings: true }));
    setErrors(prev => ({ ...prev, settings: null }));
    
    try {
      const data = await dataService.getSettingsData();
      setSettingsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, settings: 'Failed to load settings data' }));
      console.error('Error fetching settings data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, settings: false }));
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      refreshHeroData(),
      refreshAboutData(),
      refreshExperienceData(),
      refreshProjectsData(),
      refreshSkillsData(),
      refreshCertificationsData(),
      refreshTestimonialsData(),
      refreshContactData(),
      refreshFooterData(),
      refreshSettingsData(),
    ]);
  };

  // Update methods
  const updateHeroData = async (data: HeroData, profileImageFile?: File) => {
    setIsLoading(prev => ({ ...prev, hero: true }));
    setErrors(prev => ({ ...prev, hero: null }));
    
    try {
      await dataService.updateHeroData(data, profileImageFile);
      setHeroData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, hero: 'Failed to update hero data' }));
      console.error('Error updating hero data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, hero: false }));
    }
  };

  const updateAboutData = async (data: AboutData, photoFile?: File) => {
    setIsLoading(prev => ({ ...prev, about: true }));
    setErrors(prev => ({ ...prev, about: null }));
    
    try {
      await dataService.updateAboutData(data, photoFile);
      setAboutData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, about: 'Failed to update about data' }));
      console.error('Error updating about data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, about: false }));
    }
  };

  const updateExperienceData = async (data: ExperienceData) => {
    setIsLoading(prev => ({ ...prev, experience: true }));
    setErrors(prev => ({ ...prev, experience: null }));
    
    try {
      await dataService.updateExperienceData(data);
      setExperienceData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, experience: 'Failed to update experience data' }));
      console.error('Error updating experience data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, experience: false }));
    }
  };

  const updateProjectsData = async (data: ProjectsData) => {
    setIsLoading(prev => ({ ...prev, projects: true }));
    setErrors(prev => ({ ...prev, projects: null }));
    
    try {
      await dataService.updateProjectsData(data);
      setProjectsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, projects: 'Failed to update projects data' }));
      console.error('Error updating projects data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const uploadProjectImage = async (projectId: string, file: File) => {
    try {
      return await dataService.uploadProjectImage(projectId, file);
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  };

  const updateSkillsData = async (data: SkillsData) => {
    setIsLoading(prev => ({ ...prev, skills: true }));
    setErrors(prev => ({ ...prev, skills: null }));
    
    try {
      await dataService.updateSkillsData(data);
      setSkillsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, skills: 'Failed to update skills data' }));
      console.error('Error updating skills data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, skills: false }));
    }
  };

  const updateToolsTechnologiesData = async (data: ToolsTechnologiesData) => {
    setIsLoading(prev => ({ ...prev, toolsTechnologies: true }));
    setErrors(prev => ({ ...prev, toolsTechnologies: null }));
    
    try {
      await dataService.updateToolsTechnologiesData(data);
      setToolsTechnologiesData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, toolsTechnologies: 'Failed to update tools & technologies data' }));
      console.error('Error updating tools & technologies data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, toolsTechnologies: false }));
    }
  };

  const uploadToolImage = async (toolId: string, file: File) => {
    try {
      return await dataService.uploadToolImage(toolId, file);
    } catch (error) {
      console.error('Error uploading tool image:', error);
      throw error;
    }
  };

  const updateCertificationsData = async (data: CertificationsData) => {
    setIsLoading(prev => ({ ...prev, certifications: true }));
    setErrors(prev => ({ ...prev, certifications: null }));
    
    try {
      await dataService.updateCertificationsData(data);
      setCertificationsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, certifications: 'Failed to update certifications data' }));
      console.error('Error updating certifications data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, certifications: false }));
    }
  };

  const uploadCertificationImage = async (certId: string, file: File) => {
    try {
      return await dataService.uploadCertificationImage(certId, file);
    } catch (error) {
      console.error('Error uploading certification image:', error);
      throw error;
    }
  };

  const updateTestimonialsData = async (data: TestimonialsData) => {
    setIsLoading(prev => ({ ...prev, testimonials: true }));
    setErrors(prev => ({ ...prev, testimonials: null }));
    
    try {
      await dataService.updateTestimonialsData(data);
      setTestimonialsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, testimonials: 'Failed to update testimonials data' }));
      console.error('Error updating testimonials data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, testimonials: false }));
    }
  };

  const uploadTestimonialPhoto = async (testimonialId: string, file: File) => {
    try {
      return await dataService.uploadTestimonialPhoto(testimonialId, file);
    } catch (error) {
      console.error('Error uploading testimonial photo:', error);
      throw error;
    }
  };

  const updateContactData = async (data: ContactData) => {
    setIsLoading(prev => ({ ...prev, contact: true }));
    setErrors(prev => ({ ...prev, contact: null }));
    
    try {
      await dataService.updateContactData(data);
      setContactData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, contact: 'Failed to update contact data' }));
      console.error('Error updating contact data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, contact: false }));
    }
  };

  const updateFooterData = async (data: FooterData) => {
    setIsLoading(prev => ({ ...prev, footer: true }));
    setErrors(prev => ({ ...prev, footer: null }));
    
    try {
      await dataService.updateFooterData(data);
      setFooterData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, footer: 'Failed to update footer data' }));
      console.error('Error updating footer data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, footer: false }));
    }
  };

  const updateSettingsData = async (data: SettingsData) => {
    setIsLoading(prev => ({ ...prev, settings: true }));
    setErrors(prev => ({ ...prev, settings: null }));
    
    try {
      await dataService.updateSettingsData(data);
      setSettingsData(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, settings: 'Failed to update settings data' }));
      console.error('Error updating settings data:', error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, settings: false }));
    }
  };

  const uploadSiteImage = async (type: 'logo' | 'favicon', file: File) => {
    try {
      return await dataService.uploadSiteImage(type, file);
    } catch (error) {
      console.error(`Error uploading site ${type}:`, error);
      throw error;
    }
  };

  // Load data on initial mount
  useEffect(() => {
    if (isNetworkOnline) {
      refreshHeroData();
      refreshAboutData();
      refreshExperienceData();
      refreshProjectsData();
      refreshSkillsData();
      refreshToolsTechnologiesData();
      refreshCertificationsData();
      refreshTestimonialsData();
      refreshContactData();
      refreshFooterData();
      refreshSettingsData();
    } else {
      refreshAllData();
    }
  }, [isNetworkOnline]);

  const value = {
    // Data states
    heroData,
    aboutData,
    experienceData,
    projectsData,
    skillsData,
    toolsTechnologiesData,
    certificationsData,
    testimonialsData,
    contactData,
    settingsData,
    
    // Network state
    isOnline: isNetworkOnline,
    
    // Loading states
    isLoading,
    
    // Error states
    errors,
    
    // Footer data
    footerData,
    
    // Update methods
    updateHeroData,
    updateAboutData,
    updateExperienceData,
    updateProjectsData,
    uploadProjectImage,
    updateSkillsData,
    updateToolsTechnologiesData,
    uploadToolImage,
    updateCertificationsData,
    uploadCertificationImage,
    updateTestimonialsData,
    uploadTestimonialPhoto,
    updateContactData,
    updateFooterData,
    updateSettingsData,
    uploadSiteImage,
    
    // Refresh methods
    refreshHeroData,
    refreshAboutData,
    refreshExperienceData,
    refreshProjectsData,
    refreshSkillsData,
    refreshToolsTechnologiesData,
    refreshCertificationsData,
    refreshTestimonialsData,
    refreshContactData,
    refreshFooterData,
    refreshSettingsData,
    refreshAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};