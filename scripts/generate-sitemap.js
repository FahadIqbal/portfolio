/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file for the portfolio website.
 * It should be run as part of the build process to ensure the sitemap is up-to-date.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://fahad.my';
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Get current date in YYYY-MM-DD format for lastmod
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Generate sitemap content
const generateSitemap = () => {
  const today = getCurrentDate();
  
  // Define the URLs to include in the sitemap
  // Portfolio sections with proper SEO priorities and change frequencies
  const urls = [
    {
      loc: SITE_URL,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${SITE_URL}/portfolio`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${SITE_URL}/blog/future-mobile-development-cross-platform-vs-native-2024`,
      lastmod: '2024-01-15',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${SITE_URL}/blog/scaling-mobile-engineering-teams-lessons-50-projects`,
      lastmod: '2024-01-08',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${SITE_URL}/blog/mobile-app-security-enterprise-applications`,
      lastmod: '2024-01-01',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${SITE_URL}/#experience`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${SITE_URL}/#projects`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${SITE_URL}/#skills`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${SITE_URL}/#certifications`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${SITE_URL}/#testimonials`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${SITE_URL}/#contact`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.6'
    },
    {
      loc: `${SITE_URL}/admin`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];
  
  // Generate XML content
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each URL to the sitemap
  urls.forEach(url => {
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${url.loc}</loc>\n`;
    xmlContent += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xmlContent += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xmlContent += `    <priority>${url.priority}</priority>\n`;
    xmlContent += '  </url>\n';
  });
  
  xmlContent += '</urlset>';
  
  return xmlContent;
};

// Write sitemap to file
const writeSitemap = (content) => {
  try {
    fs.writeFileSync(SITEMAP_PATH, content);
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error('Error writing sitemap:', error);
  }
};

// Main execution
const main = () => {
  const sitemapContent = generateSitemap();
  writeSitemap(sitemapContent);
};

main();