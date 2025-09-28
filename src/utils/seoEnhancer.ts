// SEO Enhancement Utility for Portfolio Website
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  structuredData?: any;
  robots?: string;
  alternateUrls?: Array<{ hreflang: string; href: string }>;
}

export interface BlogPostSEO {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  publishedDate: string;
  modifiedDate: string;
  category: string;
  tags: string[];
  readingTime: string;
  wordCount: number;
}

// Enhanced SEO Manager
export class SEOEnhancer {
  private baseUrl: string = 'https://fahad.my';
  private siteName: string = 'Fahad Iqbal - Senior Mobile Engineering Lead';
  private defaultImage: string = '/images/fahad-og-image.jpg';

  // Generate comprehensive meta tags
  generateMetaTags(seoData: SEOData): string {
    const tags = [
      // Basic meta tags
      `<title>${seoData.title}</title>`,
      `<meta name="description" content="${seoData.description}" />`,
      `<meta name="keywords" content="${seoData.keywords.join(', ')}" />`,
      `<meta name="robots" content="${seoData.robots || 'index, follow'}" />`,
      `<link rel="canonical" href="${seoData.canonicalUrl}" />`,
      
      // Open Graph tags
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${seoData.title}" />`,
      `<meta property="og:description" content="${seoData.description}" />`,
      `<meta property="og:image" content="${this.baseUrl}${seoData.ogImage}" />`,
      `<meta property="og:url" content="${seoData.canonicalUrl}" />`,
      `<meta property="og:site_name" content="${this.siteName}" />`,
      
      // Twitter Card tags
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${seoData.title}" />`,
      `<meta name="twitter:description" content="${seoData.description}" />`,
      `<meta name="twitter:image" content="${this.baseUrl}${seoData.ogImage}" />`,
      
      // Additional SEO tags
      `<meta name="author" content="Fahad Iqbal" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />`,
      `<meta name="language" content="English" />`,
      `<meta name="revisit-after" content="7 days" />`,
      
      // Mobile optimization
      `<meta name="mobile-web-app-capable" content="yes" />`,
      `<meta name="apple-mobile-web-app-capable" content="yes" />`,
      `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`,
    ];

    // Add alternate language URLs if provided
    if (seoData.alternateUrls) {
      seoData.alternateUrls.forEach(alt => {
        tags.push(`<link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`);
      });
    }

    return tags.join('\n    ');
  }

  // Generate structured data for person/professional
  generatePersonStructuredData(): any {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Fahad Iqbal",
      "jobTitle": "Senior Mobile Engineering Lead",
      "description": "Senior Mobile Engineering Lead with 13+ years of experience in iOS, Android, and React Native development. PMP, CSM, PSM, and ITIL certified professional.",
      "url": this.baseUrl,
      "image": `${this.baseUrl}/images/fahad-professional.jpg`,
      "sameAs": [
        "https://www.linkedin.com/in/fahad-iqbal-07496a28/",
        "https://github.com/fahadiqbal",
        "https://twitter.com/fahadiqbal",
        "https://medium.com/@fahadiqbal"
      ],
      "knowsAbout": [
        "iOS Development", "Android Development", "React Native", "Flutter",
        "Swift", "SwiftUI", "Kotlin", "Java", "Mobile Engineering",
        "Project Management", "Agile Methodologies", "Scrum", "Team Leadership",
        "Mobile CI/CD", "Cross-platform Development", "Mobile App Security",
        "Performance Optimization", "Mobile UX/UI", "Enterprise Mobile Solutions"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Project Management Professional (PMP)",
          "credentialCategory": "Professional Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Project Management Institute"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Certified ScrumMaster (CSM)",
          "credentialCategory": "Professional Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Scrum Alliance"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Professional Scrum Master (PSM)",
          "credentialCategory": "Professional Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Scrum.org"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "ITIL 4 Foundation",
          "credentialCategory": "Professional Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": "AXELOS"
          }
        }
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Senior Mobile Engineering Lead",
        "occupationLocation": [
          {
            "@type": "Country",
            "name": "Malaysia"
          },
          {
            "@type": "Country",
            "name": "United Arab Emirates"
          }
        ],
        "skills": [
          "Mobile Application Development",
          "Team Leadership",
          "Project Management",
          "Agile Methodologies",
          "Software Architecture",
          "Performance Optimization"
        ]
      },
      "workLocation": [
        {
          "@type": "Place",
          "name": "Kuala Lumpur, Malaysia"
        },
        {
          "@type": "Place",
          "name": "Dubai, UAE"
        }
      ],
      "alumniOf": {
        "@type": "Organization",
        "name": "University of Engineering and Technology"
      }
    };
  }

  // Generate structured data for blog posts
  generateBlogPostStructuredData(post: BlogPostSEO): any {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": `${this.baseUrl}/images/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}-og.jpg`,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": this.baseUrl
      },
      "publisher": {
        "@type": "Person",
        "name": "Fahad Iqbal",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/images/logo.png`
        }
      },
      "datePublished": post.publishedDate,
      "dateModified": post.modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`
      },
      "keywords": post.keywords.join(', '),
      "articleSection": post.category,
      "wordCount": post.wordCount,
      "timeRequired": post.readingTime,
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "genre": ["Technology", "Mobile Development", "Software Engineering"],
      "audience": {
        "@type": "Audience",
        "audienceType": "Software Developers, Engineering Managers, Mobile App Developers"
      }
    };
  }

  // Generate FAQ structured data
  generateFAQStructuredData(): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Fahad Iqbal's experience in mobile development?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fahad Iqbal has 13+ years of experience in mobile development, specializing in iOS, Android, and React Native development. He has successfully delivered 50+ mobile projects and led engineering teams across various industries."
          }
        },
        {
          "@type": "Question",
          "name": "What certifications does Fahad Iqbal hold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fahad Iqbal holds multiple professional certifications including Project Management Professional (PMP), Certified ScrumMaster (CSM), Professional Scrum Master (PSM), and ITIL 4 Foundation."
          }
        },
        {
          "@type": "Question",
          "name": "What technologies does Fahad Iqbal specialize in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fahad specializes in iOS development with Swift and SwiftUI, Android development with Kotlin and Java, cross-platform development with React Native and Flutter, and mobile engineering leadership."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Fahad Iqbal located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fahad Iqbal is based in Malaysia and Dubai, UAE, and works with clients globally on mobile engineering projects."
          }
        }
      ]
    };
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): any {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${this.baseUrl}${crumb.url}`
      }))
    };
  }

  // Generate sitemap data
  generateSitemapData(): Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> {
    const now = new Date().toISOString().split('T')[0];
    
    return [
      {
        url: '/',
        lastmod: now,
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        url: '/about',
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/portfolio',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/blog',
        lastmod: now,
        changefreq: 'daily',
        priority: 0.8
      },
      {
        url: '/contact',
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.7
      }
    ];
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

Sitemap: ${this.baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*
`;
  }

  // SEO performance recommendations
  generateSEORecommendations(): Array<{
    category: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }> {
    return [
      {
        category: 'Content',
        recommendation: 'Publish blog posts regularly (2-3 times per month) focusing on mobile development trends and leadership insights',
        priority: 'high',
        impact: 'Improves search rankings and establishes thought leadership'
      },
      {
        category: 'Technical SEO',
        recommendation: 'Implement schema markup for all pages and blog posts',
        priority: 'high',
        impact: 'Enhances search result appearance and click-through rates'
      },
      {
        category: 'Performance',
        recommendation: 'Optimize images and implement lazy loading for better Core Web Vitals',
        priority: 'high',
        impact: 'Improves search rankings and user experience'
      },
      {
        category: 'Keywords',
        recommendation: 'Target long-tail keywords like "senior mobile engineering lead Malaysia" and "React Native consultant Dubai"',
        priority: 'medium',
        impact: 'Captures specific search intent and reduces competition'
      },
      {
        category: 'Local SEO',
        recommendation: 'Create Google My Business profiles for Malaysia and UAE locations',
        priority: 'medium',
        impact: 'Improves local search visibility'
      },
      {
        category: 'Backlinks',
        recommendation: 'Guest post on mobile development blogs and contribute to open source projects',
        priority: 'medium',
        impact: 'Builds domain authority and referral traffic'
      },
      {
        category: 'Social Signals',
        recommendation: 'Share blog content on LinkedIn, Twitter, and developer communities',
        priority: 'low',
        impact: 'Increases content reach and potential backlinks'
      }
    ];
  }

  // Generate meta description based on content
  generateMetaDescription(content: string, maxLength: number = 160): string {
    // Extract first meaningful sentence or paragraph
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let description = sentences[0]?.trim() || content.substring(0, maxLength);
    
    // Ensure it doesn't exceed max length
    if (description.length > maxLength) {
      description = description.substring(0, maxLength - 3) + '...';
    }
    
    return description;
  }

  // Extract keywords from content
  extractKeywords(content: string, maxKeywords: number = 10): string[] {
    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);

    // Extract words and count frequency
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Sort by frequency and return top keywords
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }
}

// Global SEO enhancer instance
export const seoEnhancer = new SEOEnhancer();

// Utility functions for easy access
export const generatePageSEO = (title: string, description: string, path: string, keywords?: string[]) => {
  return seoEnhancer.generateMetaTags({
    title: `${title} | Fahad Iqbal - Senior Mobile Engineering Lead`,
    description,
    keywords: keywords || ['mobile development', 'iOS', 'Android', 'React Native', 'engineering leadership'],
    ogImage: '/images/fahad-og-image.jpg',
    canonicalUrl: `https://fahad.my${path}`,
    robots: 'index, follow'
  });
};

export const generateBlogSEO = (post: any) => {
  return seoEnhancer.generateBlogPostStructuredData({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    author: post.author.name,
    publishedDate: post.date,
    modifiedDate: post.date,
    category: post.category,
    tags: post.tags,
    readingTime: post.readTime,
    wordCount: post.content.split(/\s+/).length
  });
};
