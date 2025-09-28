import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const BlogSection: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Best Practices for Cross-Platform Mobile Development with React Native and Flutter',
      excerpt: 'Comprehensive guide to choosing the right cross-platform framework and implementing best practices for scalable mobile applications. Learn from 13+ years of mobile development experience.',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'Mobile Development',
      slug: 'cross-platform-mobile-development-best-practices'
    },
    {
      id: '2',
      title: 'How to Lead a Mobile Engineering Team Effectively: PMP and Agile Methodologies',
      excerpt: 'Essential leadership strategies for mobile engineering teams, combining PMP project management principles with Agile methodologies for successful project delivery.',
      date: '2024-01-08',
      readTime: '10 min read',
      category: 'Team Leadership',
      slug: 'leading-mobile-engineering-teams-pmp-agile'
    },
    {
      id: '3',
      title: 'Agile Practices in Mobile Development Projects: CSM and PSM Insights',
      excerpt: 'Implementing Scrum and Agile practices specifically for mobile development projects. Real-world insights from CSM and PSM certified professional with 50+ successful deliveries.',
      date: '2024-01-01',
      readTime: '12 min read',
      category: 'Agile & Scrum',
      slug: 'agile-practices-mobile-development-csm-psm'
    },
    {
      id: '4',
      title: 'iOS Development with Swift and SwiftUI: Advanced Techniques for Enterprise Apps',
      excerpt: 'Advanced iOS development techniques using Swift and SwiftUI for enterprise-grade applications. Covers architecture patterns, performance optimization, and security best practices.',
      date: '2023-12-25',
      readTime: '15 min read',
      category: 'iOS Development',
      slug: 'ios-swift-swiftui-enterprise-development'
    },
    {
      id: '5',
      title: 'Android Development with Kotlin: Building Scalable Fintech Applications',
      excerpt: 'Complete guide to building scalable Android applications using Kotlin for fintech and banking sectors. Includes security considerations and compliance requirements.',
      date: '2023-12-18',
      readTime: '11 min read',
      category: 'Android Development',
      slug: 'android-kotlin-fintech-applications'
    },
    {
      id: '6',
      title: 'ITIL 4 in Mobile DevOps: Streamlining Development and Operations',
      excerpt: 'Implementing ITIL 4 practices in mobile DevOps environments. Learn how to integrate service management with continuous integration and deployment for mobile applications.',
      date: '2023-12-11',
      readTime: '9 min read',
      category: 'DevOps & ITIL',
      slug: 'itil-4-mobile-devops-practices'
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" style={{marginTop: '20px'}}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mobile Engineering Insights
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert insights on mobile development, project management, and team leadership 
            from a PMP, CSM, PSM, and ITIL certified professional
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <div className="mb-12">
            <article className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="ml-3 text-gray-500 dark:text-gray-400 text-sm">
                     {blogPosts[0]?.category}
                   </span>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                   {blogPosts[0]?.title}
                 </h3>
                 <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                   {blogPosts[0]?.excerpt}
                 </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {blogPosts[0]?.date && new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </span>
                     <span className="flex items-center">
                       <Clock className="w-4 h-4 mr-1" />
                       {blogPosts[0]?.readTime}
                    </span>
                  </div>
                  <Link 
                    to={`/blog/${blogPosts[0]?.id}`}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Mobile Engineering Insights
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest insights on mobile development, project management, and team leadership 
              directly from a certified PMP, CSM, PSM, and ITIL professional.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;