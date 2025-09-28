import React, { useEffect, useState } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Building from 'lucide-react/dist/esm/icons/building';
import Award from 'lucide-react/dist/esm/icons/award';
import Users from 'lucide-react/dist/esm/icons/users';
import Target from 'lucide-react/dist/esm/icons/target';
import { useData } from '../admin/context/DataContext';

interface ExperienceProps {
  activeTrack: string;
}

// Function to get the appropriate icon component based on the icon string
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'award':
      return <Award className="w-7 h-7 text-white" />;
    case 'users':
      return <Users className="w-7 h-7 text-white" />;
    case 'target':
      return <Target className="w-7 h-7 text-white" />;
    case 'building':
      return <Building className="w-7 h-7 text-white" />;
    case 'calendar':
      return <Calendar className="w-7 h-7 text-white" />;
    case 'map-pin':
      return <MapPin className="w-7 h-7 text-white" />;
    default:
      return <Award className="w-7 h-7 text-white" />; // Default icon
  }
};

const Experience: React.FC<ExperienceProps> = ({ activeTrack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const context = useData();
  const { experienceData } = context;
  
  // Access the specific isLoading.experience value and provide a fallback
  const isLoading = context.isLoading?.experience === undefined ? false : context.isLoading.experience;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: window.innerWidth <= 768 ? 0.1 : 0.3 }
    );

    const element = document.getElementById('experience');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fallback data in case Firebase data is not available
  const fallbackExperience = {
    title: "Experience",
    subtitle: "My professional journey",
    pmTrack: [
      {
        id: "pm1",
        company: "OCBC Bank",
        role: "Senior Project Manager / Scrum Master",
        period: "2020 - Present",
        location: "Malaysia",
        icon: "award",
        highlights: [
          "Led native iOS/Android migration for Global Wholesale Banking application",
          "Managed cross-functional teams of 15+ developers across multiple time zones",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
          "Ensured compliance with PCI-DSS, GDPR, and PSD2 regulations"
        ]
      },
      {
        id: "pm2",
        company: "OUR Applications",
        role: "Technical Project Manager",
        period: "2018 - 2020",
        location: "UAE",
        icon: "users",
        highlights: [
          "Managed portfolio of 35+ B2B applications for hospitality sector",
          "Coordinated agile ceremonies and sprint planning sessions",
          "Reduced project delivery time by 40% through process optimization",
          "Stakeholder management for clients across MENA region"
        ]
      },
      {
        id: "pm3",
        company: "Punjab Information Technology Board (PITB)",
        role: "Project Manager / Team Lead",
        period: "2015 - 2018",
        location: "Pakistan",
        icon: "target",
        highlights: [
          "Led digital transformation initiatives for government sector",
          "Managed Pakistan Police FIR System (PSRMS) implementation",
          "Coordinated with law enforcement agencies and government stakeholders",
          "Implemented agile methodologies in government IT projects"
        ]
      }
    ],
    devTrack: [
      {
        id: "dev1",
        company: "OCBC Bank",
        role: "Senior iOS Developer / Tech Lead",
        period: "2020 - Present",
        location: "Malaysia",
        icon: "award",
        highlights: [
          "Architected and developed native iOS banking application using SwiftUI",
          "Implemented secure payment processing and biometric authentication",
          "Built automated testing framework achieving 95% code coverage",
          "Mentored junior developers and conducted code reviews"
        ]
      },
      {
        id: "dev2",
        company: "The Entertainer",
        role: "Senior Full Stack Developer",
        period: "2018 - 2020",
        location: "UAE",
        icon: "users",
        highlights: [
          "Developed 35+ B2B mobile applications using Swift and Kotlin",
          "Built loyalty management system handling 1M+ users",
          "Integrated payment gateways and real-time notification systems",
          "Optimized app performance achieving 4.8+ App Store ratings"
        ]
      },
      {
        id: "dev3",
        company: "TechNerds / Tjdeed",
        role: "Mobile App Developer",
        period: "2015 - 2018",
        location: "Pakistan",
        icon: "target",
        highlights: [
          "Developed AI-powered facial recognition system for law enforcement",
          "Built Hotel Eye crime mapping tool with real-time data visualization",
          "Created cross-platform applications using Flutter and React Native",
          "Implemented computer vision algorithms for image processing"
        ]
      }
    ]
  };

  // Get the appropriate experience data based on the active track
  const pmExperience = experienceData?.pmTrack || fallbackExperience.pmTrack;
  const devExperience = experienceData?.devTrack || fallbackExperience.devTrack;
  const experience = activeTrack === 'pm' ? pmExperience : devExperience;
  
  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  // If experienceData is undefined or null, show a loading indicator
  if (!experienceData) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading experience data...</p>
          </div>
        </div>
      </section>
    );
  }

  // If experience array is empty or undefined, use fallback data
  let displayExperience = experience;
  if (!experience || experience.length === 0) {
    // Use the appropriate fallback data based on activeTrack
    displayExperience = activeTrack === 'pm' ? fallbackExperience.pmTrack : fallbackExperience.devTrack;
    if (!displayExperience || displayExperience.length === 0) {
      return null;
    }
  }

  return (
    <section id="experience" className="py-20 md:py-20 bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      {/* Remove debug message */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full mb-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <Building className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Professional Experience</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {experienceData?.title || fallbackExperience.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 text-lg">
            {experienceData?.subtitle || fallbackExperience.subtitle}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {displayExperience.map((job, index) => (
            <div key={index} className="transform transition-all duration-500 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 group">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-14 h-14 bg-gray-800 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 shadow-sm group-hover:shadow-md">
                      {getIconComponent(job.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{job.role}</h3>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end space-y-2 bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900 p-3 rounded-lg transition-colors duration-300">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      <Calendar size={16} className="group-hover:animate-pulse" />
                      <span className="font-medium">{job.period}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={16} />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {job.highlights.map((highlight, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-sm transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-2 h-2 bg-gray-800 group-hover:bg-blue-600 rounded-full mt-2 flex-shrink-0 transition-colors duration-300"></div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Timeline visualization */}
        <div className={`mt-16 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span>Career Timeline</span>
            </h3>
            
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full"></div>
                {displayExperience.map((job, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center relative z-10 group"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="w-5 h-5 bg-gray-800 rounded-full shadow-md mb-3 group-hover:scale-125 group-hover:bg-blue-600 transition-all duration-300 cursor-pointer"></div>
                    <div className="text-center transform transition-all duration-300 group-hover:-translate-y-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">{job.period.split(' - ')[0]}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 group-hover:text-gray-800 dark:group-hover:text-gray-200">{job.company}</div>
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-6 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-left">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{job.role}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{job.period}</p>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{job.highlights[0]}</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 absolute -bottom-1.5 left-1/2 -ml-1.5 shadow-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Timeline (vertical) */}
            <div className="md:hidden">
              <div className="relative pl-8">
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600"></div>
                
                {displayExperience.map((job, index) => (
                  <div 
                    key={index} 
                    className="mb-8 relative"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="absolute left-0 w-8 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-full shadow-md z-10"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ml-2 hover:shadow-md transition-shadow duration-300">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{job.period}</div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-base mt-1">{job.company}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{job.role}</div>
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <p>{job.highlights[0]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Timeline Legend */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span>Key career milestones</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;