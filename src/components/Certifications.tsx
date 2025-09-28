import React, { useState, useEffect } from 'react';
import Award from 'lucide-react/dist/esm/icons/award';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Star from 'lucide-react/dist/esm/icons/star';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import { useData } from '../admin/context/DataContext';

const Certifications: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { certificationsData, isLoading } = useData();
  
  // Icons for certifications without images
  
  // Fallback data in case Firebase data is not available
  const fallbackCertifications = {
    title: "Certifications",
    subtitle: "My professional credentials",
    certifications: [
      {
        id: "cert1",
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        date: "2021",
        imageUrl: "",
        verificationUrl: "https://www.pmi.org/certifications/verify",
        // Additional properties for the UI
        credential: "PMI-123456789",
        description: "Comprehensive project management certification covering all aspects of project lifecycle",
        icon: Trophy
      },
      {
        id: "cert2",
        name: "Certified ScrumMaster (CSM)",
        issuer: "Scrum Alliance",
        date: "2024",
        imageUrl: "",
        verificationUrl: "https://www.scrumalliance.org/community/profile/verify-certification",
        // Additional properties for the UI
        credential: "CSM-987654321",
        description: "Agile project management and Scrum framework expertise",
        icon: Award
      },
      {
        id: "cert3",
        name: "Professional Scrum Master (PSM)",
        issuer: "Scrum.org",
        date: "2023",
        imageUrl: "",
        verificationUrl: "https://www.scrum.org/certificates/verify",
        // Additional properties for the UI
        credential: "PSM-456789123",
        description: "Advanced Scrum mastery and team facilitation skills",
        icon: Star
      },
      {
        id: "cert4",
        name: "ITIL 4 Foundation",
        issuer: "Axelos",
        date: "2024",
        imageUrl: "",
        verificationUrl: "https://www.axelos.com/successful-candidates-register",
        // Additional properties for the UI
        credential: "ITIL4-789123456",
        description: "IT service management and digital transformation practices",
        icon: CheckCircle
      }
    ],
    education: [
      {
        id: "edu1",
        degree: "Master of Science in Computer Science",
        institution: "University of Technology",
        year: "2012",
        description: "Specialized in Software Engineering and System Architecture"
      },
      {
        id: "edu2",
        degree: "MSc Information Technology (Software Engineering)",
        institution: "International University",
        year: "2010",
        description: "Focus on Advanced Software Development and Project Management"
      }
    ],
    achievements: [
      {
        id: "ach1",
        text: "14+ years of professional experience",
        icon: "Calendar"
      },
      {
        id: "ach2",
        text: "50+ successful project deliveries",
        icon: "CheckCircle"
      },
      {
        id: "ach3",
        text: "Led teams across 3 continents",
        icon: "Award"
      },
      {
        id: "ach4",
        text: "Published 5+ technical articles",
        icon: "Star"
      }
    ]
  };
  
  // Use education and achievements data from certificationsData or fallback
  const educationData = certificationsData?.education || fallbackCertifications.education;
  const achievementsData = certificationsData?.achievements || fallbackCertifications.achievements;

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

    const element = document.getElementById('certifications');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Education data is now part of certificationsData

  return (
    <section id="certifications" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-4 shadow-sm">
            <Award className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Certifications & Education</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {certificationsData?.title || "Professional Credentials"}
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-white mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-white" />
              </div>
              Professional Certifications
            </h3>
            <div className="space-y-6">
              {(certificationsData?.certifications || fallbackCertifications.certifications).map((cert, index) => (
                <div key={index} className="group">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                          {cert.imageUrl && cert.imageUrl !== "" ? (
                            <img src={cert.imageUrl} alt={cert.name} className="w-8 h-8 object-contain" />
                          ) : (
                            // Use the icon from the fallback data if available, otherwise use Award icon
                            'icon' in cert && typeof cert.icon === 'function' ? 
                              React.createElement(cert.icon as React.ComponentType<{className?: string}>, { className: "w-6 h-6 text-gray-600 dark:text-gray-300" }) : 
                              <Award className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                          <p className="font-semibold text-gray-700 dark:text-gray-300">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                      {cert.verificationUrl && cert.verificationUrl !== "" && (
                        <a 
                          href={cert.verificationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    
                    {'description' in cert && cert.description ? (
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{cert.description}</p>
                    ) : null}
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        <span className="font-medium">Issued {cert.date}</span>
                      </div>
                      {cert.verificationUrl && cert.verificationUrl !== "" && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                          <a 
                            href={cert.verificationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Verify
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              Education
            </h3>
            
            <div className="space-y-6 mb-8">
              {educationData.map((edu, index) => (
                <div key={index} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{edu.degree}</h4>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Achievements */}
            {achievementsData && achievementsData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center">
                  <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  Additional Achievements
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {achievementsData.map((achievement, index) => {
                    let IconComponent;
                    switch(achievement.icon) {
                      case 'Trophy': IconComponent = Trophy; break;
                      case 'Calendar': IconComponent = Calendar; break;
                      case 'CheckCircle': IconComponent = CheckCircle; break;
                      case 'Award': IconComponent = Award; break;
                      case 'Star': IconComponent = Star; break;
                      default: IconComponent = Trophy;
                    }
                    
                    return (
                      <div key={achievement.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{achievement.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;