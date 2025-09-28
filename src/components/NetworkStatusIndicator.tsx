import React from 'react';
import WifiOff from 'lucide-react/dist/esm/icons/wifi-off';
import { useData } from '../admin/context/DataContext';

const NetworkStatusIndicator: React.FC = () => {
  const { isOnline } = useData();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-white shadow-lg animate-pulse">
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">You are offline - Changes will sync when connection is restored</span>
    </div>
  );
};

export default NetworkStatusIndicator;