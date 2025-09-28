// Simple Blog Content Management System
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  tags: string[];
  featured: boolean;
  published: boolean;
}

// Enhanced blog posts with thought leadership content
export const thoughtLeadershipPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Mobile Development: Cross-Platform vs Native in 2024',
    excerpt: 'As mobile technology evolves rapidly, choosing the right development approach becomes crucial. This comprehensive analysis explores the current state and future trends of cross-platform versus native development.',
    content: 'Comprehensive analysis of mobile development trends, cross-platform frameworks like React Native and Flutter, and native development advantages. Covers decision frameworks, emerging technologies, and recommendations for engineering leaders.',
    date: '2024-01-15',
    readTime: '12 min read',
    category: 'Mobile Development',
    slug: 'future-mobile-development-cross-platform-vs-native-2024',
    tags: ['Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android', 'Technology Strategy'],
    featured: true,
    published: true
  },
  {
    id: '2',
    title: 'Scaling Mobile Engineering Teams: Lessons from 50+ Project Deliveries',
    excerpt: 'Practical insights on building and scaling high-performing mobile engineering teams. Learn proven strategies for team structure, processes, and culture from real-world experience.',
    content: 'Deep dive into scaling mobile engineering teams with insights from 50+ project deliveries. Covers team structure, Agile processes, CI/CD, quality assurance, culture building, and common challenges with solutions.',
    date: '2024-01-08',
    readTime: '15 min read',
    category: 'Team Leadership',
    slug: 'scaling-mobile-engineering-teams-lessons-50-projects',
    tags: ['Team Leadership', 'Mobile Engineering', 'Agile', 'Scrum', 'Project Management', 'Engineering Management'],
    featured: true,
    published: true
  },
  {
    id: '3',
    title: 'Mobile App Security: Essential Practices for Enterprise Applications',
    excerpt: 'Comprehensive guide to mobile app security covering authentication, data protection, and compliance requirements for enterprise-grade applications.',
    content: 'Complete guide to mobile app security including threat landscape, authentication strategies, data protection, code obfuscation, compliance requirements, and incident response planning.',
    date: '2024-01-01',
    readTime: '18 min read',
    category: 'Security',
    slug: 'mobile-app-security-enterprise-applications',
    tags: ['Mobile Security', 'Enterprise Apps', 'Authentication', 'Encryption', 'Compliance', 'GDPR', 'HIPAA'],
    featured: false,
    published: true
  }
];

// Blog content management functions
export class BlogContentManager {
  private posts: BlogPost[] = thoughtLeadershipPosts;

  // Get all published posts
  getPublishedPosts(): BlogPost[] {
    return this.posts.filter(post => post.published);
  }

  // Get featured posts
  getFeaturedPosts(): BlogPost[] {
    return this.posts.filter(post => post.featured && post.published);
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts.find(post => post.slug === slug);
  }

  // Get posts by category
  getPostsByCategory(category: string): BlogPost[] {
    return this.posts.filter(post => 
      post.category === category && post.published
    );
  }

  // Get posts by tag
  getPostsByTag(tag: string): BlogPost[] {
    return this.posts.filter(post => 
      post.tags.includes(tag) && post.published
    );
  }

  // Search posts
  searchPosts(query: string): BlogPost[] {
    const lowercaseQuery = query.toLowerCase();
    return this.posts.filter(post => 
      post.published && (
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  // Get related posts
  getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
    return this.posts
      .filter(post => 
        post.id !== currentPost.id && 
        post.published &&
        (post.category === currentPost.category ||
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  }

  // Get all categories
  getCategories(): string[] {
    const categories = new Set(this.posts.map(post => post.category));
    return Array.from(categories);
  }

  // Get all tags
  getTags(): string[] {
    const tags = new Set(this.posts.flatMap(post => post.tags));
    return Array.from(tags);
  }

  // Generate blog sitemap data
  getSitemapData(): Array<{url: string, lastmod: string, priority: number}> {
    return this.posts
      .filter(post => post.published)
      .map(post => ({
        url: `/blog/${post.slug}`,
        lastmod: post.date,
        priority: post.featured ? 0.8 : 0.6
      }));
  }
}

// Global blog manager instance
export const blogManager = new BlogContentManager();
