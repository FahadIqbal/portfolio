import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
  tags: string[];
  author: string;
  image?: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default blog posts (same as in BlogEditor)
  const defaultPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Mobile Development Best Practices in 2024',
      excerpt: 'Exploring the latest trends and best practices in mobile app development, from performance optimization to user experience design.',
      content: `Mobile development has evolved significantly in 2024. Here are the key practices every mobile developer should follow:

## Performance Optimization

Performance is crucial for mobile applications. Users expect fast, responsive apps that don't drain their battery or consume excessive data.

### Key Performance Strategies:

1. **Lazy Loading**: Load content only when needed
2. **Image Optimization**: Use appropriate formats and sizes
3. **Memory Management**: Properly manage memory allocation and deallocation
4. **Network Efficiency**: Minimize API calls and optimize data transfer

## User Experience Design

Great UX is what separates good apps from exceptional ones. Focus on:

- **Intuitive Navigation**: Users should never feel lost
- **Consistent Design**: Follow platform-specific design guidelines
- **Accessibility**: Ensure your app is usable by everyone
- **Responsive Design**: Adapt to different screen sizes and orientations

## Security Best Practices

With increasing cyber threats, security cannot be an afterthought:

- **Data Encryption**: Encrypt sensitive data both in transit and at rest
- **Authentication**: Implement robust authentication mechanisms
- **API Security**: Secure your backend APIs with proper authentication and authorization
- **Code Obfuscation**: Protect your code from reverse engineering

## Testing and Quality Assurance

Thorough testing ensures your app works reliably across different devices and scenarios:

- **Unit Testing**: Test individual components and functions
- **Integration Testing**: Ensure different parts work together
- **UI Testing**: Automate user interface testing
- **Performance Testing**: Test under various load conditions

## Conclusion

By following these best practices, you'll create mobile applications that not only meet user expectations but exceed them. Remember, mobile development is an iterative process – continuously gather feedback and improve your app.`,
      category: 'Mobile Development',
      date: '2024-01-15',
      readTime: '8 min read',
      published: true,
      tags: ['Mobile', 'iOS', 'Android', 'Best Practices'],
      author: 'Fahad Iqbal',
      image: '/blog/mobile-best-practices.jpg'
    },
    {
      id: '2',
      title: 'Leading Mobile Teams: Lessons from 13+ Years',
      excerpt: 'Insights on building and leading high-performing mobile development teams, based on real-world experience.',
      content: `After leading mobile teams for over 13 years, I've learned valuable lessons about team dynamics, project management, and technical leadership.

## Building High-Performing Teams

Creating a successful mobile development team goes beyond hiring skilled developers. It requires:

### 1. Clear Vision and Goals

Every team member should understand:
- The product vision and how their work contributes
- Short-term and long-term goals
- Success metrics and how they're measured

### 2. Diverse Skill Sets

A well-rounded mobile team includes:
- **iOS Developers**: Native iOS development expertise
- **Android Developers**: Native Android development skills
- **Cross-platform Specialists**: React Native, Flutter, or Xamarin experts
- **UI/UX Designers**: Mobile-first design thinking
- **QA Engineers**: Mobile testing specialists
- **DevOps Engineers**: CI/CD and deployment automation

## Communication and Collaboration

Effective communication is the backbone of successful teams:

### Daily Standups
- Keep them short and focused (15 minutes max)
- Focus on blockers and dependencies
- Encourage team members to help each other

### Code Reviews
- Establish clear review guidelines
- Focus on knowledge sharing, not just bug finding
- Encourage constructive feedback

### Documentation
- Maintain up-to-date technical documentation
- Document architectural decisions
- Create onboarding guides for new team members

## Technical Leadership

As a technical leader, your role extends beyond coding:

### Architecture Decisions
- Choose technologies that align with team skills and project requirements
- Consider long-term maintainability
- Balance innovation with stability

### Mentoring and Growth
- Provide regular feedback and coaching
- Create learning opportunities
- Support career development paths

### Risk Management
- Identify technical risks early
- Have contingency plans
- Communicate risks to stakeholders

## Project Management Excellence

With PMP, CSM, and PSM certifications, I've learned that successful mobile projects require:

### Agile Methodologies
- Adapt Scrum/Kanban to mobile development cycles
- Plan for app store review processes
- Account for device fragmentation testing

### Stakeholder Management
- Regular demos and progress updates
- Manage expectations around mobile-specific constraints
- Involve stakeholders in user testing

## Conclusion

Leading mobile teams is both challenging and rewarding. Success comes from combining technical expertise with strong leadership skills, clear communication, and a focus on continuous improvement. Remember, your team's success is your success.`,
      category: 'Leadership',
      date: '2024-01-10',
      readTime: '12 min read',
      published: true,
      tags: ['Leadership', 'Team Management', 'Mobile Teams'],
      author: 'Fahad Iqbal',
      image: '/blog/team-leadership.jpg'
    },
    {
      id: '3',
      title: 'The Future of Cross-Platform Development',
      excerpt: 'Analyzing the current state and future prospects of cross-platform mobile development frameworks.',
      content: `Cross-platform development has come a long way since the early days of hybrid apps. Let's explore where we are and where we're heading.

## Current State of Cross-Platform Development

Today's cross-platform landscape is dominated by several key players:

### React Native
- **Pros**: Large community, Facebook backing, code sharing with web
- **Cons**: Bridge performance bottlenecks, frequent updates
- **Best for**: Apps with complex business logic, teams with React experience

### Flutter
- **Pros**: Excellent performance, single codebase, growing ecosystem
- **Cons**: Larger app size, Dart learning curve
- **Best for**: UI-heavy apps, teams starting fresh

### Xamarin
- **Pros**: Native performance, Microsoft ecosystem integration
- **Cons**: Licensing costs, larger team at Microsoft
- **Best for**: Enterprise apps, .NET teams

## Performance Considerations

Performance remains a key concern for cross-platform solutions:

### Native Performance
- Direct access to platform APIs
- Optimized for specific platforms
- Best performance for graphics-intensive apps

### Cross-Platform Trade-offs
- Slight performance overhead
- Abstraction layer complexity
- Platform-specific optimizations may be limited

## Development Efficiency

Cross-platform development offers significant advantages:

### Code Reuse
- Share business logic across platforms
- Reduce development time by 30-50%
- Maintain feature parity more easily

### Team Efficiency
- Single team can target multiple platforms
- Shared knowledge and best practices
- Faster time to market

## Future Trends

Several trends are shaping the future of cross-platform development:

### 1. Improved Performance
- Better compilation techniques
- Reduced bridge overhead
- Native module integration

### 2. Enhanced Developer Experience
- Better debugging tools
- Improved hot reload capabilities
- Enhanced IDE support

### 3. Platform Convergence
- More shared APIs between platforms
- Standardized UI components
- Unified development workflows

### 4. AI and Machine Learning Integration
- Cross-platform ML frameworks
- Simplified AI model deployment
- Platform-agnostic inference engines

## Making the Right Choice

Choosing between native and cross-platform depends on:

### Project Requirements
- Performance needs
- Platform-specific features
- Development timeline
- Budget constraints

### Team Expertise
- Existing skill sets
- Learning curve considerations
- Long-term maintenance capabilities

### Business Goals
- Time to market requirements
- Target audience
- Competitive landscape

## Conclusion

Cross-platform development continues to evolve and improve. While native development still has its place for performance-critical applications, cross-platform solutions are becoming increasingly viable for a wide range of mobile applications. The key is choosing the right tool for your specific needs and constraints.`,
      category: 'Technology',
      date: '2024-01-05',
      readTime: '10 min read',
      published: true,
      tags: ['Cross-Platform', 'React Native', 'Flutter', 'Mobile'],
      author: 'Fahad Iqbal',
      image: '/blog/cross-platform.jpg'
    }
  ];

  useEffect(() => {
    if (id) {
      const foundPost = defaultPosts.find(post => post.id === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Blog post not found');
      }
    } else {
      setError('Invalid blog post ID');
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Blog post not found'}
          </h1>
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readTime}
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.image && (
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="ml-4 mb-2">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                return (
                  <li key={index} className="ml-4 mb-2 list-decimal">
                    {paragraph.replace(/^\d+\. /, '')}
                  </li>
                );
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 text-gray-500 dark:text-gray-400">#</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Link 
              to="/blog" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Link>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Published on {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;