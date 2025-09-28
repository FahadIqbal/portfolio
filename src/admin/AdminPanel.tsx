import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  User,
  Briefcase,
  Code,
  Award,
  MessageSquare,
  Settings,
  Database,
  Download
} from 'lucide-react';
import HeroEditor from './sections/HeroEditor';
import AboutEditor from './sections/AboutEditor';
import ExperienceEditor from './sections/ExperienceEditor';
import ProjectsEditor from './sections/ProjectsEditor';
import SkillsEditor from './sections/SkillsEditor';
import CertificationsEditor from './sections/CertificationsEditor';
import TestimonialsEditor from './sections/TestimonialsEditor';
import ContactEditor from './sections/ContactEditor';
import SettingsEditor from './sections/SettingsEditor';
import PortfolioEditor from './sections/PortfolioEditor';
import BlogEditor from './sections/BlogEditor';
import FirebaseConfigEditor from './sections/FirebaseConfigEditor';
import CVGenerator from './sections/CVGenerator';
import ToolsTechnologiesEditor from './sections/ToolsTechnologiesEditor';
import FooterEditor from './sections/FooterEditor';
import { useAuth } from './auth/AuthContext';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const { user, logout } = useAuth();

  const sections = [
    { id: 'hero', label: 'Hero', icon: User },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'portfolio', label: 'Portfolio', icon: () => '🖼️' },
    { id: 'blog', label: 'Blog', icon: () => '📝' },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'tools', label: 'Tools & Technologies', icon: () => '🔧' },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'footer', label: 'Footer', icon: MessageSquare },
    { id: 'cv', label: 'CV Generator', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'firebase', label: 'Firebase Config', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              🚪
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
                <CardDescription>Edit your portfolio content</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeSection === section.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      {typeof section.icon === 'function' ? (
                         <span className="text-lg">{section.icon()}</span>
                       ) : (
                          <section.icon className="h-5 w-5" />
                        )}
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>View your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => window.open('/', '_blank')}
                >
                  <span className="mr-2">👁️</span>
                  View Live Site
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>{sections.find(s => s.id === activeSection)?.label}</CardTitle>
                <CardDescription>Edit your {activeSection} section content</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSection === 'hero' && <HeroEditor />}
                {activeSection === 'about' && <AboutEditor />}
                {activeSection === 'experience' && <ExperienceEditor />}
                {activeSection === 'projects' && <ProjectsEditor />}
                {activeSection === 'portfolio' && <PortfolioEditor />}
                {activeSection === 'blog' && <BlogEditor />}
                {activeSection === 'skills' && <SkillsEditor />}
                {activeSection === 'tools' && <ToolsTechnologiesEditor />}
                {activeSection === 'certifications' && <CertificationsEditor />}
                {activeSection === 'testimonials' && <TestimonialsEditor />}
                {activeSection === 'contact' && <ContactEditor />}
                {activeSection === 'footer' && <FooterEditor />}
                {activeSection === 'cv' && <CVGenerator />}
                {activeSection === 'settings' && <SettingsEditor />}
                {activeSection === 'firebase' && <FirebaseConfigEditor />}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;