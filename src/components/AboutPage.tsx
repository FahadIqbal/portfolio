import React, { useState } from 'react';
import { MapPin, Award, Users, Calendar } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-8 relative">
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-blue-500 dark:border-blue-400 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Error state */}
            {imageError && (
              <div className="w-32 h-32 rounded-full mx-auto bg-gray-100 dark:bg-gray-800 border-4 border-blue-500 dark:border-blue-400 flex items-center justify-center">
                <span className="text-4xl text-gray-400">👤</span>
              </div>
            )}
            
            {/* Actual image */}
            <img
              src="/profile-photo.jpg"
              alt="Fahad Iqbal Mobile Engineering Lead"
              className={`w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500 dark:border-blue-400 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Fahad Iqbal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Senior Mobile Engineering Lead | PMP, CSM, PSM, ITIL Certified
          </p>
        </div>

        {/* Biography Section */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Journey
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            With over 13 years of experience in mobile engineering and project management, 
            I am a Senior Mobile Engineering Lead currently serving as Assistant Vice President (Mobile) 
            at OCBC Bank in Kuala Lumpur, Malaysia. My career spans across multiple continents and 
            industries, from fintech and banking to entertainment and government sectors.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            My expertise lies in leading cross-functional teams through complex mobile development 
            projects, specializing in iOS, Android, and React Native applications. I have successfully 
            delivered 50+ projects with a 95% on-time delivery rate, managing teams of 15+ developers 
            across multiple time zones.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Role & Responsibilities
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            As Assistant Vice President (Mobile) at OCBC Bank since January 2023, I lead the mobile 
            engineering initiatives for one of Southeast Asia's leading financial institutions. 
            My responsibilities include architecting scalable mobile solutions, implementing DevOps 
            practices, and ensuring compliance with banking regulations including PCI-DSS and GDPR.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Career Highlights
          </h3>
          
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
            <li>Led mobile banking transformation at OCBC Bank, delivering on time and under budget</li>
            <li>Principal Software Engineer at The ENTERTAINER, managing 35+ mobile applications</li>
            <li>Technical Project Manager at Our Applications, overseeing cross-platform development</li>
            <li>Spearheaded digital transformation of law enforcement systems in Punjab, Pakistan</li>
            <li>Successfully managed mobile development teams across Malaysia, Dubai, and Pakistan</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Technical Expertise
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            My technical stack encompasses the full spectrum of mobile development technologies. 
            I specialize in native iOS development using Swift and SwiftUI, Android development 
            with Kotlin and Java, and cross-platform solutions using React Native and Flutter. 
            My backend expertise includes Node.js, Python, and Laravel/PHP, with extensive 
            experience in cloud platforms like AWS and Azure.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Education & Certifications
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            I hold a Master of Science in Computer Science from the University of Technology (2012) 
            and an MSc in Information Technology (Software Engineering) from International University (2010). 
            My professional certifications include Project Management Professional (PMP), 
            Certified ScrumMaster (CSM), Professional Scrum Master (PSM), and ITIL 4 Foundation.
          </p>
        </div>

        {/* Key Achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">13+</h3>
            <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Award className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">50+</h3>
            <p className="text-gray-600 dark:text-gray-300">Projects Delivered</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">15+</h3>
            <p className="text-gray-600 dark:text-gray-300">Team Members Led</p>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <MapPin className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3</h3>
            <p className="text-gray-600 dark:text-gray-300">Continents</p>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Based in Malaysia & Dubai
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Currently based in Kuala Lumpur, Malaysia, with extensive experience working 
            across the Middle East and Asia-Pacific regions. Available for remote collaboration 
            and on-site consulting across multiple time zones.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Kuala Lumpur, Malaysia
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Dubai, UAE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;