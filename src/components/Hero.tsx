import React, { useEffect, useState } from 'react';
import Download from 'lucide-react/dist/esm/icons/download';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Github from 'lucide-react/dist/esm/icons/github';
import { useData as useDataContext } from '../admin/context/DataContext';
import { preloadImage } from '../utils/imagePreloader';

interface HeroProps {
  activeTrack: string;
}

const Hero: React.FC<HeroProps> = ({ activeTrack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { heroData } = useDataContext();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get title, subtitle, and description based on active track
  const title = heroData ? 
    (activeTrack === 'pm' ? heroData.pm.title : heroData.dev.title) : 
    activeTrack === 'pm' ? "Certified Project Manager & Scrum Master" : "Senior Full Stack Mobile Developer";
    
  const subtitle = heroData ? 
    (activeTrack === 'pm' ? heroData.pm.subtitle : heroData.dev.subtitle) : 
    activeTrack === 'pm' ? "14+ Years Leading Agile Teams & Digital Transformation" : "14+ Years Building Scalable Mobile & Web Solutions";

  const description = heroData ? 
    (activeTrack === 'pm' ? heroData.pm.description : heroData.dev.description) : 
    activeTrack === 'pm' ? "14+ Years Leading Agile Teams & Digital Transformation" : "13+ Years Experience in iOS, Android & React Native Development | PMP, CSM, PSM, ITIL Certified";

  // Default CTA content or from data
  const ctaText = heroData?.ctaText || 'Download Resume';
  const ctaLink = heroData?.ctaLink || '#';
  
  // Get profile image URL from heroData or use fallback
  const profileImageUrl = heroData?.profileImageUrl || '/placeholder-profile.jpg';
  
  // Preload profile image for better performance
  useEffect(() => {
    if (profileImageUrl && profileImageUrl !== '/placeholder-profile.jpg') {
      preloadImage(profileImageUrl).catch(() => {
        console.warn('Failed to preload profile image');
      });
    }
  }, [profileImageUrl]);
  
  // Get social links from heroData or use fallback
  const socialLinks = heroData ? [
    { platform: 'email', url: heroData.socialLinks.email },
    { platform: 'linkedin', url: heroData.socialLinks.linkedin },
    { platform: 'github', url: heroData.socialLinks.github },
  ] : [
    { platform: 'email', url: 'mailto:example@example.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'github', url: 'https://github.com' },
  ];
  
  // Get certifications from heroData or use empty array
  const certifications = heroData ? 
    (activeTrack === 'pm' ? 
      heroData.certifications.pm.map(cert => ({ name: cert, url: '#' })) : 
      heroData.certifications.dev.map(cert => ({ name: cert, url: '#' }))) : 
    [];
  
  // Get image adjustments from heroData or localStorage as fallback
  let imageScale = 1;
  let imagePosition = { x: 0, y: 0 };
  
  if (heroData?.imageAdjustments) {
    // Use image adjustments from heroData if available
    imageScale = heroData.imageAdjustments.scale;
    imagePosition = heroData.imageAdjustments.position;
  } else {
    // Fallback to localStorage
    const savedScale = localStorage.getItem('heroImageScale');
    const savedPosition = localStorage.getItem('heroImagePosition');
    imageScale = savedScale ? parseFloat(savedScale) : 1;
    imagePosition = savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  }

  return (
    <section id="hero" className={`relative flex items-start md:items-center justify-center pt-12 md:pt-0 pb-12 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-white dark:bg-gray-900`} style={{ minHeight: 'auto', overflow: 'visible' ,marginTop: '20px'}}>
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        {/* Left side - Text content */}
        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            {description}
          </p>
          
          {/* CTA Button */}
          <div>
            <a 
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  // Import Firebase storage dynamically to avoid circular dependencies
                  const { storage } = await import('../admin/services/FirebaseInitializer');
                  const { ref, getDownloadURL } = await import('firebase/storage');
                  
                  // Determine which resume to download based on active track
                  const resumeFilename = activeTrack === 'pm' ? 'project-manager-resume.pdf' : 'developer-resume.pdf';
                  
                  // Try to get the file from Firebase Storage
                  const storageRef = ref(storage, `resumes/${resumeFilename}`);
                  const downloadUrl = await getDownloadURL(storageRef);
                  
                  // Create a temporary link and trigger download
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.target = '_blank';
                  link.download = resumeFilename;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (error) {
                  console.warn(`Could not get resume from Firebase Storage, falling back to public directory: ${error}`);
                  // Fallback to public directory
                  const resumeFilename = activeTrack === 'pm' ? 'project-manager-resume.pdf' : 'developer-resume.pdf';
                  window.open(`/resumes/${resumeFilename}`, '_blank');
                }
              }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              {ctaText}
            </a>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start space-x-4 pt-4">
            {socialLinks?.map((link, index) => {
              let Icon;
              switch (link.platform) {
                case 'email':
                  Icon = Mail;
                  break;
                case 'linkedin':
                  Icon = Linkedin;
                  break;
                case 'github':
                  Icon = Github;
                  break;
                default:
                  return null;
              }
              
              return (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                  aria-label={`Visit ${link.platform}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
          
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="pt-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors duration-300"
                  >
                    {cert.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right side - Profile Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            {/* Profile Image with loading state */}
            {profileImageUrl && (
              <>
                {/* Loading skeleton */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Error state */}
                {imageError && (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
                )}
                
                {/* Actual image */}
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className={`absolute w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  }}
                  draggable="false"
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;