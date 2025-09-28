import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { useData } from '../admin/context/DataContext';
import Newsletter from './Newsletter';

const Footer: React.FC = () => {
  const { footerData } = useData();
  const currentYear = new Date().getFullYear();

  if (!footerData) {
    return null;
  }

  const { copyright, socialLinks } = footerData;
  const copyrightText = copyright.replace('{year}', currentYear.toString());

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto">
            <Newsletter variant="footer" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {copyrightText}
            </p>
            <p style={{ display: 'none' }} className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Senior Mobile Engineering Lead | Based in Malaysia & Dubai | PMP, CSM, PSM, ITIL Certified
            </p>
          </div>
          
          <div className="flex space-x-4">
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            
            {socialLinks.email && (
              <a 
                href={`mailto:${socialLinks.email}`} 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;