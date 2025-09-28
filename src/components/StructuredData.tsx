import { useEffect } from 'react';
import { useData } from '../admin/context/DataContext';

// Define interfaces for schema types
interface PersonSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image: string;
  jobTitle: string;
  email: string;
  sameAs: string[];
  worksFor?: Array<{
    '@type': string;
    name: string;
    jobTitle: string;
  }>;
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  author: {
    '@type': string;
    name: string;
  };
}

interface ProjectSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  creator: {
    '@type': string;
    name: string;
  };
  url: string;
  keywords: string;
}

// Define a type for the data we need from context
interface ContextData {
  settingsData?: {
    siteTitle?: string;
    siteDescription?: string;
  };
  heroData?: {
    pm?: {
      title?: string;
      subtitle?: string;
      description?: string;
    };
    profileImageUrl?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      email?: string;
    };
  };
  aboutData?: {
    description?: string;
    photoUrl?: string;
  };
  projectsData?: {
    projects?: Array<{
      title: string;
      description: string;
      imageUrl?: string;
      technologies: string[];
      links?: {
        demo?: string;
      };
    }>;
  };
  experienceData?: {
    pmTrack?: Array<{
      company: string;
      role: string;
    }>;
  };
}

const StructuredData = () => {
  const { settingsData, heroData, aboutData, projectsData, experienceData } = useData();
  
  // Type guard to ensure we have the required data
  const hasRequiredData = (): boolean => {
    return !!(settingsData && heroData);
  };

  useEffect(() => {
    if (!hasRequiredData()) return;

    // Remove any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Create person schema
    const personSchema: PersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: heroData?.pm?.title || 'Portfolio Owner',
      description: aboutData?.description || heroData?.pm?.description || '',
      url: window.location.origin,
      image: heroData?.profileImageUrl || aboutData?.photoUrl || '',
      jobTitle: heroData?.pm?.subtitle || '',
      email: heroData?.socialLinks?.email || '',
      sameAs: [
        heroData?.socialLinks?.linkedin || '',
        heroData?.socialLinks?.github || '',
      ].filter(Boolean),
    };

    // Add work experience if available
    if (experienceData?.pmTrack && experienceData.pmTrack.length > 0) {
      personSchema.worksFor = experienceData.pmTrack.map(exp => ({
        '@type': 'Organization',
        name: exp.company,
        jobTitle: exp.role,
      }));
    }

    // Create portfolio website schema
    const websiteSchema: WebsiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settingsData?.siteTitle || 'Portfolio',
      description: settingsData?.siteDescription || '',
      url: window.location.origin,
      author: {
        '@type': 'Person',
        name: heroData?.pm?.title || 'Portfolio Owner',
      },
    };

    // Create project schemas if available
    const projectSchemas: ProjectSchema[] = [];
    if (projectsData?.projects && projectsData.projects.length > 0) {
      projectsData.projects.forEach(project => {
        projectSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          image: project.imageUrl || '',
          creator: {
            '@type': 'Person',
            name: heroData?.pm?.title || 'Portfolio Owner',
          },
          url: project.links?.demo || window.location.origin,
          keywords: project.technologies?.join(', ') || '',
        });
      });
    }

    // Add schemas to the document
    const addJsonLdScript = (schema: PersonSchema | WebsiteSchema | ProjectSchema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    addJsonLdScript(personSchema);
    addJsonLdScript(websiteSchema);
    projectSchemas.forEach(schema => addJsonLdScript(schema));

  }, [settingsData, heroData, aboutData, projectsData, experienceData]);

  return null; // This component doesn't render anything
};

export default StructuredData;