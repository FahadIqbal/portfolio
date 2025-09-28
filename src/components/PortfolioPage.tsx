import React from 'react';
import { ExternalLink, Github, Smartphone, Users, Award, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  achievements: string[];
  teamSize: number;
  duration: string;
  platform: string[];
}

const PortfolioPage: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'OCBC Bank Mobile Banking Platform',
      description: 'Led the mobile banking transformation for one of Southeast Asia\'s leading financial institutions',
      longDescription: 'As Assistant Vice President (Mobile) at OCBC Bank, I spearheaded the complete mobile banking platform transformation, implementing cutting-edge iOS and Android applications with React Native components. The project involved complex fintech integrations, PCI-DSS compliance, and multi-factor authentication systems.',
      technologies: ['Swift', 'SwiftUI', 'Kotlin', 'React Native', 'Node.js', 'AWS', 'Firebase'],
      category: 'Fintech',
      image: '/projects/ocbc-mobile.jpg',
      achievements: [
        'Delivered on time and under budget',
        'Improved user engagement by 40%',
        'Achieved 99.9% uptime',
        'PCI-DSS compliant implementation'
      ],
      teamSize: 15,
      duration: '18 months',
      platform: ['iOS', 'Android']
    },
    {
      id: '2',
      title: 'The ENTERTAINER Mobile Applications',
      description: '35+ mobile applications for the leading lifestyle and dining platform in the Middle East',
      longDescription: 'As Principal Software Engineer, I managed the development and maintenance of 35+ mobile applications for The ENTERTAINER platform. This included native iOS and Android apps, React Native solutions, and comprehensive backend systems serving millions of users across the Middle East.',
      technologies: ['Swift', 'Objective-C', 'Java', 'Kotlin', 'React Native', 'Flutter', 'Laravel'],
      category: 'Lifestyle',
      image: '/projects/entertainer-apps.jpg',
      achievements: [
        'Maintained 4.5+ App Store rating',
        'Zero critical bugs in production',
        'Served millions of users',
        'Cross-platform consistency'
      ],
      teamSize: 12,
      duration: '12 months',
      platform: ['iOS', 'Android', 'Cross-platform']
    },
    {
      id: '3',
      title: 'Punjab Police Record Management System (PSRMS)',
      description: 'Digital transformation of law enforcement systems serving millions of citizens',
      longDescription: 'Led the digital transformation of Punjab Police operations through a comprehensive mobile and web-based record management system. The project revolutionized how police operations are conducted, serving millions of citizens with improved efficiency and transparency.',
      technologies: ['Android', 'Java', 'PHP', 'MySQL', 'REST APIs', 'GPS Integration'],
      category: 'Government',
      image: '/projects/psrms-mobile.jpg',
      achievements: [
        'Served millions of citizens',
        'Improved operational efficiency by 60%',
        'Real-time data synchronization',
        'GPS-based location tracking'
      ],
      teamSize: 8,
      duration: '24 months',
      platform: ['Android', 'Web']
    },
    {
      id: '4',
      title: 'Cross-Platform E-Commerce Solutions',
      description: 'Multiple e-commerce mobile applications using React Native and Flutter',
      longDescription: 'Developed and delivered multiple cross-platform e-commerce solutions for various clients, focusing on performance optimization, user experience, and scalable architecture. Implemented advanced features like real-time inventory, payment gateways, and analytics.',
      technologies: ['React Native', 'Flutter', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'E-Commerce',
      image: '/projects/ecommerce-apps.jpg',
      achievements: [
        'Reduced development time by 50%',
        'Consistent UI across platforms',
        'Integrated multiple payment gateways',
        'Real-time inventory management'
      ],
      teamSize: 6,
      duration: '8 months',
      platform: ['iOS', 'Android']
    },
    {
      id: '5',
      title: 'Enterprise Mobile DevOps Pipeline',
      description: 'Comprehensive CI/CD pipeline for mobile applications with automated testing and deployment',
      longDescription: 'Designed and implemented a complete mobile DevOps pipeline incorporating ITIL 4 practices, automated testing, code quality checks, and deployment automation. The solution reduced deployment time from hours to minutes while maintaining high quality standards.',
      technologies: ['Jenkins', 'Fastlane', 'Docker', 'AWS', 'Bitrise', 'SonarQube'],
      category: 'DevOps',
      image: '/projects/mobile-devops.jpg',
      achievements: [
        'Reduced deployment time by 80%',
        'Automated testing coverage 95%',
        'Zero-downtime deployments',
        'ITIL 4 compliant processes'
      ],
      teamSize: 4,
      duration: '6 months',
      platform: ['CI/CD', 'Infrastructure']
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Mobile Engineering Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Showcasing 13+ years of mobile development expertise across iOS, Android, and cross-platform solutions. 
            From fintech to government systems, delivering scalable mobile applications that serve millions of users.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">50+</h3>
            <p className="text-gray-600 dark:text-gray-300">Apps Delivered</p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">15+</h3>
            <p className="text-gray-600 dark:text-gray-300">Team Members</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">95%</h3>
            <p className="text-gray-600 dark:text-gray-300">On-time Delivery</p>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">13+</h3>
            <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {projects.map((project, index) => (
            <div key={project.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12`}>
              {/* Project Image */}
              <div className="lg:w-1/2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
                  <Smartphone className="w-16 h-16 text-gray-400" />
                  <span className="ml-4 text-gray-500 dark:text-gray-400">Project Screenshot</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="lg:w-1/2">
                <div className="mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {project.longDescription}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Team Size</h4>
                    <p className="text-gray-900 dark:text-white">{project.teamSize} members</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</h4>
                    <p className="text-gray-900 dark:text-white">{project.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</h4>
                    <p className="text-gray-900 dark:text-white">{project.platform.join(', ')}</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Achievements
                  </h3>
                  <ul className="space-y-2">
                    {project.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <Award className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {project.liveUrl && (
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </button>
                  )}
                  {project.githubUrl && (
                    <button className="flex items-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Next Mobile Application?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Let's discuss how my 13+ years of mobile engineering expertise can help bring your vision to life. 
              From iOS and Android to cross-platform solutions, I deliver scalable mobile applications that users love.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;