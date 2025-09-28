import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ProjectsData, ProjectItem } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Image from 'lucide-react/dist/esm/icons/image';
import Link from 'lucide-react/dist/esm/icons/link';
import MoveUp from 'lucide-react/dist/esm/icons/move-up';
import MoveDown from 'lucide-react/dist/esm/icons/move-down';
import { v4 as uuidv4 } from 'uuid';

const ProjectsEditor: React.FC = () => {
  const { projectsData, isLoading, errors, updateProjectsData, uploadProjectImage, refreshProjectsData } = useData();
  const [formData, setFormData] = useState<ProjectsData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (projectsData) {
      setFormData(projectsData);
      if (projectsData.projects.length > 0 && !activeProjectId) {
        setActiveProjectId(projectsData.projects[0].id);
      }
    }
  }, [projectsData]);

  if (isLoading.projects || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading projects data...</span>
      </div>
    );
  }

  if (errors.projects) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.projects}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshProjectsData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleHeaderChange = (field: 'title' | 'subtitle', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const addProject = () => {
    const newProject: ProjectItem = {
      id: uuidv4(),
      title: 'New Project',
      description: 'Project description',
      imageUrl: '/placeholder-project.jpg',
      technologies: ['Technology 1'],
      category: 'Web',
      stats: [
        { label: 'Duration', value: '3 months' },
        { label: 'Role', value: 'Developer' }
      ],
      links: {
        demo: '',
        github: '',
        case_study: ''
      }
    };

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        projects: [...prev.projects, newProject]
      };
    });

    setActiveProjectId(newProject.id);
    setActiveTab('projects');
  };

  const removeProject = (id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      const updatedProjects = prev.projects.filter(project => project.id !== id);
      
      // If we're removing the active project, select another one
      if (activeProjectId === id && updatedProjects.length > 0) {
        setActiveProjectId(updatedProjects[0].id);
      } else if (updatedProjects.length === 0) {
        setActiveProjectId(null);
      }
      
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  const moveProject = (id: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const projects = [...prev.projects];
      const index = projects.findIndex(project => project.id === id);
      
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        // Move up
        [projects[index], projects[index - 1]] = [projects[index - 1], projects[index]];
      } else if (direction === 'down' && index < projects.length - 1) {
        // Move down
        [projects[index], projects[index + 1]] = [projects[index + 1], projects[index]];
      }
      
      return {
        ...prev,
        projects
      };
    });
  };

  const updateProjectField = (id: string, field: keyof ProjectItem, value: any) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            return { ...project, [field]: value };
          }
          return project;
        })
      };
    });
  };

  const updateProjectLink = (id: string, linkType: 'demo' | 'github' | 'case_study', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            return { 
              ...project, 
              links: {
                ...project.links,
                [linkType]: value
              }
            };
          }
          return project;
        })
      };
    });
  };

  const addTechnology = (id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            return { 
              ...project, 
              technologies: [...project.technologies, 'New Technology']
            };
          }
          return project;
        })
      };
    });
  };

  const updateTechnology = (id: string, index: number, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            const technologies = [...project.technologies];
            technologies[index] = value;
            return { ...project, technologies };
          }
          return project;
        })
      };
    });
  };

  const removeTechnology = (id: string, index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            const technologies = [...project.technologies];
            technologies.splice(index, 1);
            return { ...project, technologies };
          }
          return project;
        })
      };
    });
  };

  const addStat = (id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            return { 
              ...project, 
              stats: [...project.stats, { label: 'New Stat', value: 'Value' }]
            };
          }
          return project;
        })
      };
    });
  };

  const updateStat = (id: string, index: number, field: 'label' | 'value', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            const stats = [...project.stats];
            stats[index] = { ...stats[index], [field]: value };
            return { ...project, stats };
          }
          return project;
        })
      };
    });
  };

  const removeStat = (id: string, index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === id) {
            const stats = [...project.stats];
            stats.splice(index, 1);
            return { ...project, stats };
          }
          return project;
        })
      };
    });
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      const imageUrl = await uploadProjectImage(id, file);
      updateProjectField(id, 'imageUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateProjectsData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving projects data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const activeProject = formData.projects.find(p => p.id === activeProjectId);

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleHeaderChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleHeaderChange('subtitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Button 
              type="button" 
              onClick={addProject}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
          
          {formData.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Project list sidebar */}
              <div className="md:col-span-1 space-y-2">
                {formData.projects.map(project => (
                  <div 
                    key={project.id} 
                    className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${activeProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setActiveProjectId(project.id)}
                  >
                    <span className="font-medium truncate">{project.title}</span>
                    <div className="flex space-x-1">
                      <button 
                        type="button" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveProject(project.id, 'up');
                        }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button 
                        type="button" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveProject(project.id, 'down');
                        }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button 
                        type="button" 
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProject(project.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Project editor */}
              <div className="md:col-span-3">
                {activeProject ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                            <input
                              type="text"
                              value={activeProject.title}
                              onChange={(e) => updateProjectField(activeProject.id, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                              type="text"
                              value={activeProject.category}
                              onChange={(e) => updateProjectField(activeProject.id, 'category', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., Web, Mobile, AI, etc."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={activeProject.description}
                              onChange={(e) => updateProjectField(activeProject.id, 'description', e.target.value)}
                              rows={4}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                          <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 border rounded-md overflow-hidden">
                              <img 
                                src={activeProject.imageUrl} 
                                alt={activeProject.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <label className="block w-full">
                                <span className="sr-only">Choose project image</span>
                                <input 
                                  type="file" 
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-gray-100 file:text-gray-700
                                    hover:file:bg-gray-200"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(activeProject.id, e)}
                                  disabled={uploadingImage}
                                />
                              </label>
                              {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Technologies</label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => addTechnology(activeProject.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Technology
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {activeProject.technologies.map((tech, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={tech}
                                  onChange={(e) => updateTechnology(activeProject.id, index, e.target.value)}
                                  className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeTechnology(activeProject.id, index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Stats</label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => addStat(activeProject.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Stat
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {activeProject.stats.map((stat, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={stat.label}
                                  onChange={(e) => updateStat(activeProject.id, index, 'label', e.target.value)}
                                  className="flex-1 p-2 border border-gray-300 rounded-md"
                                  placeholder="Label"
                                />
                                <input
                                  type="text"
                                  value={stat.value}
                                  onChange={(e) => updateStat(activeProject.id, index, 'value', e.target.value)}
                                  className="flex-1 p-2 border border-gray-300 rounded-md"
                                  placeholder="Value"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeStat(activeProject.id, index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Link className="h-4 w-4 text-gray-500" />
                              <input
                                type="url"
                                value={activeProject.links?.demo || ''}
                                onChange={(e) => updateProjectLink(activeProject.id, 'demo', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                placeholder="Demo URL"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link className="h-4 w-4 text-gray-500" />
                              <input
                                type="url"
                                value={activeProject.links?.github || ''}
                                onChange={(e) => updateProjectLink(activeProject.id, 'github', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                placeholder="GitHub URL"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link className="h-4 w-4 text-gray-500" />
                              <input
                                type="url"
                                value={activeProject.links?.case_study || ''}
                                onChange={(e) => updateProjectLink(activeProject.id, 'case_study', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                placeholder="Case Study URL"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500">Select a project from the list or add a new one.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">No projects yet. Click "Add Project" to create one.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex items-center justify-between">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        
        {saveSuccess && (
          <span className="text-green-600 text-sm">Changes saved successfully!</span>
        )}
      </div>
    </form>
  );
};

export default ProjectsEditor;