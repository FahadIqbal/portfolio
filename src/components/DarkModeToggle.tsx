import React, { useContext } from 'react';
import Moon from 'lucide-react/dist/esm/icons/moon';
import Sun from 'lucide-react/dist/esm/icons/sun';
import { DataContext } from '../admin/context/DataContext';

const DarkModeToggle: React.FC = () => {
  const { settingsData, updateSettingsData } = useContext(DataContext) || {};
  const isDarkMode = settingsData?.darkMode || false;

  const toggleDarkMode = async () => {
    if (!settingsData || !updateSettingsData) return;
    
    try {
      await updateSettingsData({
        ...settingsData,
        darkMode: !isDarkMode
      });
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun size={18} className="text-yellow-500" />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
};

export default DarkModeToggle;