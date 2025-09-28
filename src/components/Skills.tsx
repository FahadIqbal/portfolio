import React, { useState, useEffect } from 'react';
import Users from 'lucide-react/dist/esm/icons/users';
import Code from 'lucide-react/dist/esm/icons/code';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Database from 'lucide-react/dist/esm/icons/database';
import Cloud from 'lucide-react/dist/esm/icons/cloud';
import Shield from 'lucide-react/dist/esm/icons/shield';
import LineChart from 'lucide-react/dist/esm/icons/line-chart';
import Star from 'lucide-react/dist/esm/icons/star';
import { useData } from '../admin/context/DataContext';

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { skillsData, toolsTechnologiesData } = useData();

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

    const element = document.getElementById('skills');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Icon mapping for categories
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Project Management': Users,
    'Mobile Development': Code,
    'Backend & DevOps': Settings,
    'Database & AI': Database,
    'Cloud & Architecture': Cloud,
    'Security & Compliance': Shield,
    'Technical Mastery': Code,
    'Development': Code,
    'DevOps': Settings,
    'Database': Database,
    'Cloud': Cloud,
    'Security': Shield,
    'Management': Users
  };

  // Get icon for category based on name
  const getCategoryIcon = (categoryName: string) => {
    // Try exact match first
    if (iconMap[categoryName]) {
      return iconMap[categoryName];
    }
    
    // Try partial matches
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('project') || lowerName.includes('management')) return Users;
    if (lowerName.includes('mobile') || lowerName.includes('development') || lowerName.includes('code')) return Code;
    if (lowerName.includes('backend') || lowerName.includes('devops') || lowerName.includes('server')) return Settings;
    if (lowerName.includes('database') || lowerName.includes('data')) return Database;
    if (lowerName.includes('cloud') || lowerName.includes('aws') || lowerName.includes('azure')) return Cloud;
    if (lowerName.includes('security') || lowerName.includes('compliance')) return Shield;
    
    // Default icon
    return Code;
  };

  // Use skillsData from context or fallback to hardcoded data
  const skillCategories = skillsData?.categories?.map(category => ({
    title: category.name,
    icon: getCategoryIcon(category.name),
    skills: category.skills || []
  })) || [
    {
      title: "Project Management",
      icon: Users,
      skills: [
        { name: "Scrum & Agile", level: 95 },
        { name: "Stakeholder Management", level: 90 },
        { name: "Risk Management", level: 88 },
        { name: "Team Leadership", level: 92 },
        { name: "Product Ownership", level: 85 }
      ]
    },
    {
      title: "Mobile Development",
      icon: Code,
      skills: [
        { name: "iOS (Swift/SwiftUI)", level: 95 },
        { name: "Android (Kotlin/Java)", level: 90 },
        { name: "Flutter", level: 85 },
        { name: "React Native", level: 80 },
        { name: "Mobile CI/CD", level: 88 }
      ]
    },
    {
      title: "Backend & DevOps",
      icon: Settings,
      skills: [
        { name: "Python", level: 90 },
        { name: "Laravel/PHP", level: 85 },
        { name: "Node.js", level: 82 },
        { name: "Jenkins/GitHub Actions", level: 88 },
        { name: "Docker & Kubernetes", level: 80 }
      ]
    },
    {
      title: "Database & AI",
      icon: Database,
      skills: [
        { name: "PostgreSQL/MySQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Machine Learning", level: 75 },
        { name: "Computer Vision", level: 78 },
        { name: "Data Analytics", level: 82 }
      ]
    },
    {
      title: "Cloud & Architecture",
      icon: Cloud,
      skills: [
        { name: "AWS/Azure", level: 85 },
        { name: "Microservices", level: 88 },
        { name: "API Design", level: 90 },
        { name: "System Architecture", level: 85 },
        { name: "Performance Optimization", level: 87 }
      ]
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      skills: [
        { name: "PCI-DSS Compliance", level: 90 },
        { name: "GDPR/Data Privacy", level: 88 },
        { name: "Security Architecture", level: 85 },
        { name: "Penetration Testing", level: 75 },
        { name: "OAuth/JWT", level: 88 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-16 bg-white dark:bg-gray-800" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <LineChart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Skills & Expertise</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {skillsData?.title || 'Technical Mastery'}
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-gray-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
            {skillsData?.subtitle || 'A comprehensive skill set spanning project management, software development, and emerging technologies'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div 
              key={index} 
              className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{skill.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-gray-400 dark:text-gray-500 fill-current" />
                          <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 bg-gray-800 dark:bg-gray-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            transitionDelay: `${(index * 100) + (idx * 50)}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools & Technologies Section - Now manageable from admin panel */}
        <div className={`mt-12 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {toolsTechnologiesData?.title || 'Tools & Technologies'}
            </h3>
            {toolsTechnologiesData?.subtitle && (
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                {toolsTechnologiesData.subtitle}
              </p>
            )}
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {toolsTechnologiesData?.tools && toolsTechnologiesData.tools.length > 0 ? (
                toolsTechnologiesData.tools.map((tool, index) => (
                  <div key={tool.id} className="group">
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      {tool.imageUrl ? (
                        <img 
                          src={tool.imageUrl} 
                          alt={tool.name}
                          className="w-10 h-10 object-contain mb-2 group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg mb-2 group-hover:bg-gray-200 dark:group-hover:bg-gray-500 transition-colors flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">
                            {tool.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs text-center">
                        {tool.name}
                      </span>
                      {tool.proficiency && (
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                          <div 
                            className="h-1 bg-gray-800 dark:bg-gray-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: isVisible ? `${tool.proficiency}%` : '0%',
                              transitionDelay: `${index * 50}ms`
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to hardcoded tools if no data is available
                [
                  'Jira', 'Confluence', 'Slack', 'GitHub', 'Bitrise', 'Firebase',
                  'Xcode', 'Android Studio', 'VS Code', 'Figma', 'Postman', 'Docker'
                ].map((tool, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg mb-2 group-hover:bg-gray-200 dark:group-hover:bg-gray-500 transition-colors flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">
                          {tool.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs text-center">{tool}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;