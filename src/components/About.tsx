import React, { useEffect, useState } from 'react';
import Award from 'lucide-react/dist/esm/icons/award';
import Users from 'lucide-react/dist/esm/icons/users';
import Target from 'lucide-react/dist/esm/icons/target';
import LineChart from 'lucide-react/dist/esm/icons/line-chart';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Brain from 'lucide-react/dist/esm/icons/brain';

interface AboutProps {
  activeTrack: string;
}

const About: React.FC<AboutProps> = ({ activeTrack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ years: 0, projects: 0, teams: 0, rating: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          const duration = 2000;
          const steps = 60;
          const stepDuration = duration / steps;
          
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
              years: Math.floor(14 * progress),
              projects: Math.floor(50 * progress),
              teams: Math.floor(15 * progress),
              rating: Math.floor(4.8 * progress * 10) / 10
            });
            
            if (step >= steps) clearInterval(timer);
          }, stepDuration);
        }
      },
      { threshold: window.innerWidth <= 768 ? 0.1 : 0.3 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const pmContent = {
    title: "Bridging Strategy with Execution",
    description: "With over 14 years of experience in project management and agile methodologies, I specialize in leading cross-functional teams through complex digital transformations. My expertise spans from traditional project management to modern agile frameworks, ensuring delivery excellence in fintech, government, and enterprise environments.",
    highlights: [
      { icon: Award, title: "Certified Excellence", desc: "PMP, CSM, PSM, and ITIL-4 certified professional" },
      { icon: Users, title: "Team Leadership", desc: "Led teams of 15+ developers across multiple time zones" },
      { icon: Target, title: "Delivery Focus", desc: "95% on-time delivery rate across 50+ projects" },
      { icon: LineChart, title: "Digital Transformation", desc: "Spearheaded migration of legacy systems to modern architectures" }
    ]
  };

  const devContent = {
    title: "Building Tomorrow's Solutions Today",
    description: "As a senior full-stack developer with 14+ years of experience, I architect and build scalable mobile and web applications. My expertise spans native iOS/Android development, AI-powered solutions, and modern web technologies, with a focus on creating user-centric applications that solve real-world problems.",
    highlights: [
      { icon: Brain, title: "Technical Excellence", desc: "Expert in Swift, Kotlin, Python, and modern frameworks" },
      { icon: Users, title: "User-Centric Design", desc: "Built apps used by millions of users globally" },
      { icon: LineChart, title: "Performance Focused", desc: "Optimized apps achieving 4.8+ App Store ratings" },
      { icon: Target, title: "Innovation Driver", desc: "Pioneered AI integration in law enforcement and fintech" }
    ]
  };

  const content = activeTrack === 'pm' ? pmContent : devContent;

  return (
    <section id="about" className="py-8 md:py-10 bg-gray-50 dark:bg-gray-900" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-6 md:mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-4 shadow-sm">
            <Shield className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">About Me</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Passionate Professional
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-gray-600 mx-auto rounded-full"></div>
        </div>

        {/* Stats section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { label: 'Years Experience', value: counters.years, suffix: '+' },
            { label: 'Projects Delivered', value: counters.projects, suffix: '+' },
            { label: 'Team Members Led', value: counters.teams, suffix: '+' },
            { label: 'Average Rating', value: counters.rating, suffix: '/5' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {content.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.description}
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <LineChart className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                Key Strengths
              </h4>
              <div className="space-y-3">
                {activeTrack === 'pm' ? (
                  <>
                    {[
                      'Agile & Scrum methodologies implementation',
                      'Stakeholder management & cross-functional collaboration',
                      'Risk management & change control',
                      'DevOps & CI/CD pipeline management'
                    ].map((strength, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="w-2 h-2 bg-gray-800 dark:bg-gray-600 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{strength}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      'Native iOS (Swift/SwiftUI) & Android (Kotlin) development',
                      'Full-stack web development (Python, Laravel, Node.js)',
                      'AI/ML integration & computer vision solutions',
                      'Cloud architecture & scalable system design'
                    ].map((strength, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="w-2 h-2 bg-gray-800 dark:bg-gray-600 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{strength}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-4 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {content.highlights.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                    <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;