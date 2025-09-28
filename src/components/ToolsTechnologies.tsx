import React, { useState, useEffect } from 'react';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import Star from 'lucide-react/dist/esm/icons/star';
import Link from 'lucide-react/dist/esm/icons/link';
import { useData } from '../admin/context/DataContext';

const ToolsTechnologies: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toolsTechnologiesData } = useData();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('tools');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!toolsTechnologiesData) {
    return null;
  }

  return (
    <section id="tools" className="py-16 bg-gray-50 dark:bg-gray-900" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Wrench className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Tools & Technologies</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {toolsTechnologiesData.title}
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-gray-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
            {toolsTechnologiesData.subtitle}
          </p>
        </div>

        {toolsTechnologiesData.categories.map((category, categoryIndex) => (
          <div 
            key={category} 
            className={`mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${categoryIndex * 100}ms` }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {toolsTechnologiesData.tools
                .filter(tool => tool.category === category)
                .map((tool, toolIndex) => (
                  <div 
                    key={tool.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-center mb-4">
                      {tool.imageUrl ? (
                        <img 
                          src={tool.imageUrl} 
                          alt={tool.name} 
                          className="w-12 h-12 object-contain mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                          <Wrench className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tool.description}</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300 text-sm">Proficiency</span>
                          <div className="flex items-center space-x-1">
                            <Star size={12} className="text-gray-400 dark:text-gray-500 fill-current" />
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">{tool.proficiency}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="h-2 bg-gray-800 dark:bg-gray-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: isVisible ? `${tool.proficiency}%` : '0%',
                              transitionDelay: `${(categoryIndex * 100) + (toolIndex * 50)}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Experience:</span>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {tool.yearsOfExperience} {tool.yearsOfExperience === 1 ? 'year' : 'years'}
                        </span>
                      </div>
                      
                      {tool.link && (
                        <a 
                          href={tool.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                        >
                          <Link size={14} className="mr-1" />
                          Learn more
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsTechnologies;