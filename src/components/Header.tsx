import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import User from 'lucide-react/dist/esm/icons/user';
import Code from 'lucide-react/dist/esm/icons/code';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import DarkModeToggle from './DarkModeToggle';
import { useData } from '../admin/context/DataContext';
import { TrackType } from '../admin/services/DataService';

interface HeaderProps {
  activeTrack: string;
  setActiveTrack: (track: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTrack, setActiveTrack }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Add a class to the body when menu is open to adjust spacing
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);
  const { settingsData } = useData();
  
  // Check for track parameter in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackParam = urlParams.get('track');
    
    // If track parameter exists in URL and is different from active track, update active track
    if (trackParam && trackParam !== activeTrack && settingsData?.trackTypes) {
      const trackExists = settingsData.trackTypes.some(track => track.id === trackParam);
      if (trackExists) {
        setActiveTrack(trackParam);
      }
    }
  }, [settingsData, activeTrack, setActiveTrack]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-40 transition-all duration-300" style={{ height: '60px', maxHeight: '60px', overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {settingsData?.logoUrl ? (
                <img 
                  src={settingsData.logoUrl} 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  {settingsData?.userName ? (
                    <span className="text-white font-bold text-sm">
                      {settingsData.userName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                    </span>
                  ) : (
                    <Briefcase className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {settingsData?.userName || settingsData?.siteTitle || 'Portfolio'}
              </h1>
            </div>
            
            {settingsData?.showTrackToggle && settingsData?.trackTypes?.length > 0 && (
              <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {settingsData.trackTypes.map((track: TrackType) => (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrack(track.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                      activeTrack === track.id
                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                    }`}
                  >
                    {track.id === 'pm' ? (
                      <User size={16} />
                    ) : track.id === 'dev' ? (
                      <Code size={16} />
                    ) : (
                      <Briefcase size={16} />
                    )}
                    <span>{track.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {[
               { name: 'Home', href: '/', isRoute: true },
               { name: 'About', href: '/about', isRoute: true },
               { name: 'Portfolio', href: '/portfolio', isRoute: true },
               { name: 'Blog', href: '/blog', isRoute: true },
               { name: 'Contact', href: '#contact', isRoute: false },
             ].map((item) => (
               item.isRoute ? (
                 <Link
                   key={item.name}
                   to={item.href}
                   className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                 >
                   {item.name}
                 </Link>
               ) : (
                 <a
                   key={item.name}
                   href={item.href}
                   className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                 >
                   {item.name}
                 </a>
               )
             ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden py-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 z-50 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`} style={{ position: 'absolute' }}>
            {settingsData?.showTrackToggle && settingsData?.trackTypes?.length > 0 && (
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
                {settingsData.trackTypes.map((track: TrackType) => (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrack(track.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-all duration-200 font-medium ${
                      activeTrack === track.id
                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {track.id === 'pm' ? (
                      <User size={16} />
                    ) : track.id === 'dev' ? (
                      <Code size={16} />
                    ) : (
                      <Briefcase size={16} />
                    )}
                    <span>{track.name.length > 3 ? track.name.substring(0, 3) : track.name}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-1 mb-4">
              <div className="flex justify-center mb-2">
                <DarkModeToggle />
              </div>
              {[
                 { name: 'Home', href: '/', isRoute: true },
                 { name: 'About', href: '/about', isRoute: true },
                 { name: 'Portfolio', href: '/portfolio', isRoute: true },
                 { name: 'Blog', href: '/blog', isRoute: true },
                 { name: 'Contact', href: '#contact', isRoute: false },
               ].map((item) => (
                 item.isRoute ? (
                   <Link
                     key={item.name}
                     to={item.href}
                     onClick={() => setIsMenuOpen(false)}
                     className="block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                   >
                     {item.name}
                   </Link>
                 ) : (
                   <a
                     key={item.name}
                     href={item.href}
                     onClick={() => setIsMenuOpen(false)}
                     className="block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                   >
                     {item.name}
                   </a>
                 )
               ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;