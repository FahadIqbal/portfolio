import { SettingsData } from '../admin/services/DataService';

/**
 * Generates a favicon SVG from a user's name
 * @param name The name to generate the favicon from
 * @param backgroundColor Optional background color (defaults to primary color from settings)
 * @returns SVG string as a data URL
 */
export const generateFaviconFromName = (name: string, backgroundColor?: string): string => {
  // Split the name into words
  const words = name.trim().split(/\s+/);
  
  let displayText = '';
  
  // If there are two or more words, use the first letter of each of the first two words
  if (words.length >= 2 && words[0] && words[1]) {
    displayText = `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  } else {
    // Otherwise just use the first letter of the name
    displayText = name.charAt(0).toUpperCase();
  }
  
  // Generate a color based on the name if no background color is provided
  const generatedColor = backgroundColor || getColorFromString(name);
  
  // Adjust font size based on number of characters
  const fontSize = displayText.length > 1 ? 14 : 16;
  
  // Create an SVG with the display text
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="${generatedColor}" rx="4" ry="4"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white">${displayText}</text>
    </svg>
  `;
  
  // Convert SVG to a data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generates a logo SVG from a user's name
 * @param name The name to generate the logo from
 * @param backgroundColor Optional background color (defaults to primary color from settings)
 * @returns SVG string as a data URL
 */
export const generateLogoFromName = (name: string, backgroundColor?: string): string => {
  // Split the name into words
  const words = name.trim().split(/\s+/);
  
  let displayText = '';
  
  // If there are two or more words, use the first letter of each of the first two words
  if (words.length >= 2 && words[0] && words[1]) {
    displayText = `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  } else {
    // Otherwise just use the first letter of the name
    displayText = name.charAt(0).toUpperCase();
  }
  
  // Generate a color based on the name if no background color is provided
  const generatedColor = backgroundColor || getColorFromString(name);
  
  // Adjust font size based on number of characters
  const fontSize = displayText.length > 1 ? 24 : 28;
  
  // Create an SVG with the display text - make it larger for a logo
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
      <rect width="60" height="60" fill="${generatedColor}" rx="6" ry="6"/>
      <text x="30" y="30" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white">${displayText}</text>
      <text x="80" y="30" dominant-baseline="middle" text-anchor="start" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333">${name}</text>
    </svg>
  `;
  
  // Convert SVG to a data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generates a favicon from the site title in the settings
 * @param settings The settings data containing the site title
 * @returns SVG string as a data URL
 */
export const generateFaviconFromSettings = (settings: SettingsData): string => {
  const name = settings.siteTitle || 'Portfolio';
  return generateFaviconFromName(name, settings.primaryColor);
};

/**
 * Generates a logo from the user name in the settings
 * @param settings The settings data containing the user name
 * @returns SVG string as a data URL
 */
export const generateLogoFromSettings = (settings: SettingsData): string => {
  const name = settings.userName || settings.siteTitle || 'Portfolio';
  return generateFaviconFromName(name, settings.primaryColor);
};

/**
 * Generates a color from a string (name)
 * @param str The string to generate a color from
 * @returns A hex color code
 */
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a vibrant color (avoid too dark or too light)
  const h = Math.abs(hash) % 360;
  const s = 65 + (Math.abs(hash) % 25); // 65-90%
  const l = 45 + (Math.abs(hash) % 15); // 45-60%
  
  return hslToHex(h, s, l);
};

/**
 * Converts HSL color values to a hex color code
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns A hex color code
 */
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
};