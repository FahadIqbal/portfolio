import React, { useState, useEffect } from 'react';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Github from 'lucide-react/dist/esm/icons/github';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Brain from 'lucide-react/dist/esm/icons/brain';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Star from 'lucide-react/dist/esm/icons/star';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

const Projects: React.FC = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

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

    const element = document.getElementById('projects');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "OCBC Global Wholesale Banking App",
      description: "Native iOS/Android migration of enterprise banking application with advanced security features and real-time transaction processing.",
      image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["SwiftUI", "Kotlin", "CI/CD", "PCI-DSS"],
      category: "Fintech",
      icon: Shield,
      stats: { users: "50K+", rating: "4.8", timeline: "18 months" },
      features: [
        "Biometric authentication integration",
        "Real-time payment processing",
        "Multi-language support",
        "Regulatory compliance (PSD2, GDPR)"
      ]
    },
    {
      title: "Pakistan Police FIR System (PSRMS)",
      description: "AI-powered digital transformation project for law enforcement with facial recognition and crime mapping capabilities.",
      image: "https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Python", "AI/ML", "Flask", "Computer Vision"],
      category: "Government",
      icon: Brain,
      stats: { users: "100K+", rating: "4.9", timeline: "24 months" },
      features: [
        "Facial recognition system",
        "Real-time crime mapping",
        "Digital FIR processing",
        "Advanced analytics dashboard"
      ]
    },
    {
      title: "Hotel Eye Crime Mapping Tool",
      description: "Real-time data visualization platform for crime monitoring and security management in hospitality sector.",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["React", "D3.js", "Node.js", "MongoDB"],
      category: "Security",
      icon: Globe,
      stats: { users: "25K+", rating: "4.7", timeline: "12 months" },
      features: [
        "Interactive crime heat maps",
        "Real-time incident reporting",
        "Predictive analytics",
        "Mobile-responsive dashboard"
      ]
    },
    {
      title: "35+ B2B Applications Suite",
      description: "Comprehensive suite of loyalty, travel, and booking applications for The Entertainer's B2B clients.",
      image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Swift", "Kotlin", "Flutter", "Laravel"],
      category: "Enterprise",
      icon: Smartphone,
      stats: { users: "1M+", rating: "4.8", timeline: "36 months" },
      features: [
        "Cross-platform compatibility",
        "Loyalty program integration",
        "Payment gateway integration",
        "Real-time notifications"
      ]
    }
  ];

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 md:mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-4 shadow-sm">
            <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Featured Projects</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Flagship Projects
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-gray-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
            Showcasing flagship projects that demonstrate expertise in both project management and technical development
          </p>
        </div>

        {/* Featured Project Carousel */}
        <div className={`mb-8 md:mb-12 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Project Image */}
              <div className="relative h-80 lg:h-auto overflow-hidden">
                {/* Loading skeleton for main project image */}
                {!loadedImages.has(currentProject) && !errorImages.has(currentProject) && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                )}
                
                <img 
                    src={projects[currentProject]?.image} 
                    alt={projects[currentProject]?.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages.has(currentProject) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(currentProject))}
                    onError={() => setErrorImages(prev => new Set(prev).add(currentProject))}
                  />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-full text-sm font-medium">
                    {projects[currentProject]?.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {projects[currentProject]?.icon && React.createElement(projects[currentProject].icon, { className: "w-5 h-5 text-white" })}
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{projects[currentProject]?.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{projects[currentProject]?.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-gray-900 dark:text-white">{projects[currentProject]?.stats?.users}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Users</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Star className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-gray-900 dark:text-white">{projects[currentProject]?.stats?.rating}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-gray-900 dark:text-white">{projects[currentProject]?.stats?.timeline}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Timeline</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Key Features:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {projects[currentProject]?.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-gray-800 dark:bg-gray-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {projects[currentProject]?.tech?.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                    <ExternalLink size={16} />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2 rounded-lg transition-colors">
                    <Github size={16} />
                    <span>Source</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button
                onClick={prevProject}
                className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button
                onClick={nextProject}
                className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Project Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProject(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentProject ? 'bg-gray-800 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Projects Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-2 gap-6 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => setCurrentProject(index)}>
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${index === currentProject ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}`}>
                <div className="relative h-40 overflow-hidden">
                  {/* Loading skeleton for thumbnail */}
                  {!loadedImages.has(index) && !errorImages.has(index) && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                      loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(index))}
                    onError={() => setErrorImages(prev => new Set(prev).add(index))}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;