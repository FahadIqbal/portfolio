// This file contains custom type declarations for modules that don't have their own type definitions

// Declare modules for testing libraries
declare module 'vitest/globals' {
  export * from 'vitest';
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom';
}

declare module 'lucide-react' {
  import React from 'react';
  
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
  }
  
  export const Loader2: React.FC<IconProps>;
  export const Quote: React.FC<IconProps>;
  export const Star: React.FC<IconProps>;
  export const Linkedin: React.FC<IconProps>;
  export const ChevronLeft: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const MessageSquare: React.FC<IconProps>;
  export const Users: React.FC<IconProps>;
  export const Code: React.FC<IconProps>;
  export const Settings: React.FC<IconProps>;
  export const Database: React.FC<IconProps>;
  export const Cloud: React.FC<IconProps>;
  export const Shield: React.FC<IconProps>;
  export const LineChart: React.FC<IconProps>;
  export const ExternalLink: React.FC<IconProps>;
  export const Github: React.FC<IconProps>;
  export const Smartphone: React.FC<IconProps>;
  export const Globe: React.FC<IconProps>;
  export const Brain: React.FC<IconProps>;
  export const Calendar: React.FC<IconProps>;
  export const ArrowRight: React.FC<IconProps>;
  export const Download: React.FC<IconProps>;
  export const Mail: React.FC<IconProps>;
  export const Briefcase: React.FC<IconProps>;
  export const Menu: React.FC<IconProps>;
  export const X: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Award: React.FC<IconProps>;
  export const Target: React.FC<IconProps>;
  export const MapPin: React.FC<IconProps>;
  export const Building: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const Phone: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const Trophy: React.FC<IconProps>;
  export const CheckCircle: React.FC<IconProps>;
  export const GraduationCap: React.FC<IconProps>;
}