import React, { useEffect } from 'react';

interface LyroChatProps {
  publicKey: string;
  className?: string;
}

const LyroChat: React.FC<LyroChatProps> = ({ publicKey, className = '' }) => {
  useEffect(() => {
    // Check if Lyro script is already loaded
    if (document.getElementById('lyro-chat-script')) {
      return;
    }

    // Create and append the Lyro chat script
    const script = document.createElement('script');
    script.id = 'tidio-chat-script';
    script.src = `//code.tidio.co/${publicKey}.js`;
    script.async = true;

    // Handle script load error
    script.onerror = () => {
      console.error('Failed to load Tidio chat widget');
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove script if component unmounts
      const existingScript = document.getElementById('tidio-chat-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Hide Tidio widget if it exists
      if (window.tidioChatApi) {
        window.tidioChatApi.hide();
      }
    };
  }, [publicKey]);

  // This component doesn't render anything visible
  // The chat widget is injected by the Lyro script
  return (
    <div 
      className={`tidio-chat-container ${className}`}
      style={{ display: 'none' }}
      data-tidio-public-key={publicKey}
    >
      {/* Tidio chat widget (with Lyro AI) will be injected here */}
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    tidioChatApi?: {
      show: () => void;
      hide: () => void;
      open: () => void;
      close: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

export default LyroChat;