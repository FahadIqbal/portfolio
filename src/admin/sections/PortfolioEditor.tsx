import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  teamSize: number;
  role: string;
  achievements: string[];
}

const PortfolioEditor: React.FC = () => {
  const dataContext = useData();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioProject>>({});

  useEffect(() => {
    // Initialize with default portfolio projects
    const defaultProjects: PortfolioProject[] = [
      {
        id: '1',
        title: 'Enterprise Mobile Banking App',
        description: 'Led development of a comprehensive mobile banking solution serving 2M+ users across Malaysia and Dubai.',
        longDescription: 'Spearheaded the development of a cutting-edge mobile banking application that revolutionized digital banking experience. The app features secure biometric authentication, real-time transaction processing, multi-currency support, and advanced financial analytics. Implemented robust security measures including end-to-end encryption and fraud detection algorithms.',
        technologies: ['React Native', 'Node.js', 'MongoDB', 'AWS', 'Biometric Auth', 'Blockchain'],
        category: 'Mobile Banking',
        image: '/portfolio/banking-app.jpg',
        demoUrl: 'https://demo.bankingapp.com',
        featured: true,
        status: 'completed',
        startDate: '2022-01-15',
        endDate: '2023-06-30',
        teamSize: 12,
        role: 'Senior Mobile Engineering Lead',
        achievements: [
          'Increased user engagement by 150%',
          'Reduced transaction processing time by 60%',
          'Achieved 99.9% uptime reliability',
          'Successfully launched in 3 countries'
        ]
      },
      {
        id: '2',
        title: 'Cross-Platform E-commerce Solution',
        description: 'Architected and delivered a scalable e-commerce platform with advanced inventory management and analytics.',
        longDescription: 'Designed and implemented a comprehensive e-commerce solution that handles millions of transactions daily. The platform features intelligent product recommendations, real-time inventory tracking, multi-vendor support, and advanced analytics dashboard for business insights.',
        technologies: ['Flutter', 'Firebase', 'Stripe', 'Google Analytics', 'Machine Learning'],
        category: 'E-commerce',
        image: '/portfolio/ecommerce-app.jpg',
        githubUrl: 'https://github.com/fahad/ecommerce-solution',
        featured: true,
        status: 'completed',
        startDate: '2021-03-01',
        endDate: '2022-01-15',
        teamSize: 8,
        role: 'Technical Lead',
        achievements: [
          'Processed $50M+ in transactions',
          'Achieved 4.8/5 app store rating',
          'Reduced cart abandonment by 40%',
          'Implemented AI-powered recommendations'
        ]
      },
      {
        id: '3',
        title: 'Healthcare Management System',
        description: 'Developed a comprehensive healthcare platform connecting patients, doctors, and healthcare providers.',
        longDescription: 'Created an integrated healthcare management system that streamlines patient care, appointment scheduling, medical records management, and telemedicine consultations. The platform ensures HIPAA compliance and provides secure communication channels between all stakeholders.',
        technologies: ['React Native', 'Express.js', 'PostgreSQL', 'WebRTC', 'HIPAA Compliance'],
        category: 'Healthcare',
        image: '/portfolio/healthcare-app.jpg',
        featured: false,
        status: 'completed',
        startDate: '2020-06-01',
        endDate: '2021-02-28',
        teamSize: 6,
        role: 'Mobile Development Lead',
        achievements: [
          'Served 100K+ patients',
          'Reduced appointment wait times by 70%',
          'Achieved HIPAA compliance certification',
          'Integrated with 50+ healthcare providers'
        ]
      }
    ];
    setProjects(defaultProjects);
  }, []);

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.longDescription) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedProjects: PortfolioProject[];

    if (isCreating) {
      const newProject: PortfolioProject = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        longDescription: formData.longDescription || '',
        technologies: formData.technologies || [],
        category: formData.category || 'Mobile Development',
        image: formData.image || '/portfolio/default.jpg',
        demoUrl: formData.demoUrl,
        githubUrl: formData.githubUrl,
        featured: formData.featured || false,
        status: formData.status || 'completed',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate,
        teamSize: formData.teamSize || 1,
        role: formData.role || 'Developer',
        achievements: formData.achievements || []
      };
      updatedProjects = [...projects, newProject];
    } else if (editingProject) {
      updatedProjects = projects.map(project => 
        project.id === editingProject.id 
          ? { ...editingProject, ...formData }
          : project
      );
    } else {
      return;
    }

    setProjects(updatedProjects);
    setEditingProject(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
    }
  };

  const handleEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormData(project);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      category: 'Mobile Development',
      image: '/portfolio/default.jpg',
      featured: false,
      status: 'completed',
      startDate: new Date().toISOString().split('T')[0],
      teamSize: 1,
      role: 'Developer',
      achievements: []
    });
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleTechnologiesChange = (techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(tech => tech);
    setFormData({ ...formData, technologies });
  };

  const handleAchievementsChange = (achievementsString: string) => {
    const achievements = achievementsString.split('\n').map(achievement => achievement.trim()).filter(achievement => achievement);
    setFormData({ ...formData, achievements });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Management</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          +
          New Project
        </button>
      </div>

      {(isCreating || editingProject) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {isCreating ? 'Create New Project' : 'Edit Project'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter project title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Mobile Development">Mobile Development</option>
                <option value="Web Development">Web Development</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Fintech">Fintech</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'in-progress' | 'planned' })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size
              </label>
              <input
                type="number"
                value={formData.teamSize || ''}
                onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="1"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your role in the project"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of the project"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Description *
            </label>
            <textarea
              value={formData.longDescription || ''}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={6}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Detailed description of the project"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies?.join(', ') || ''}
                onChange={(e) => handleTechnologiesChange(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="React Native, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="/portfolio/project-image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://demo.example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Achievements (one per line)
            </label>
            <textarea
              value={formData.achievements?.join('\n') || ''}
              onChange={(e) => handleAchievementsChange(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Increased user engagement by 150%\nReduced processing time by 60%"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Project
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              ✓
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              ✕
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {project.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {project.startDate} {project.endDate && `- ${project.endDate}`} • Team: {project.teamSize} • Role: {project.role}
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.achievements.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Achievements:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                      {project.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                      {project.achievements.length > 2 && (
                        <li>+{project.achievements.length - 2} more achievements</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioEditor;