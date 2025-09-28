import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ToolsTechnologiesData, ToolTechItem } from '../services/DataService';
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

const ToolsTechnologiesEditor: React.FC = () => {
  const { toolsTechnologiesData, isLoading, errors, updateToolsTechnologiesData, refreshToolsTechnologiesData, uploadToolImage } = useData();
  const [formData, setFormData] = useState<ToolsTechnologiesData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (toolsTechnologiesData) {
      setFormData(toolsTechnologiesData);
      if (toolsTechnologiesData.categories.length > 0) {
        setActiveCategoryName(toolsTechnologiesData.categories[0]);
        
        const toolsInCategory = toolsTechnologiesData.tools.filter(
          tool => tool.category === toolsTechnologiesData.categories[0]
        );
        
        if (toolsInCategory.length > 0) {
          setActiveToolId(toolsInCategory[0].id);
        }
      }
    }
  }, [toolsTechnologiesData]);

  if (isLoading.toolsTechnologies || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading tools & technologies data...</span>
      </div>
    );
  }

  if (errors.toolsTechnologies) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.toolsTechnologies}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshToolsTechnologiesData()}
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

  const addCategory = () => {
    const newCategory = 'New Category';

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        categories: [...prev.categories, newCategory]
      };
    });

    setActiveCategoryName(newCategory);
    setActiveTab('categories');
  };

  const updateCategoryName = (oldName: string, newName: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      // Update category name in categories array
      const updatedCategories = prev.categories.map(category => 
        category === oldName ? newName : category
      );
      
      // Update category name in all tools that belong to this category
      const updatedTools = prev.tools.map(tool => {
        if (tool.category === oldName) {
          return { ...tool, category: newName };
        }
        return tool;
      });
      
      return {
        ...prev,
        categories: updatedCategories,
        tools: updatedTools
      };
    });

    if (activeCategoryName === oldName) {
      setActiveCategoryName(newName);
    }
  };

  const removeCategory = (categoryName: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      // Remove category from categories array
      const updatedCategories = prev.categories.filter(category => category !== categoryName);
      
      // Remove all tools that belong to this category
      const updatedTools = prev.tools.filter(tool => tool.category !== categoryName);
      
      // If we're removing the active category, select another one
      if (activeCategoryName === categoryName && updatedCategories.length > 0) {
        setActiveCategoryName(updatedCategories[0]);
        
        const toolsInNewCategory = updatedTools.filter(
          tool => tool.category === updatedCategories[0]
        );
        
        if (toolsInNewCategory.length > 0) {
          setActiveToolId(toolsInNewCategory[0].id);
        } else {
          setActiveToolId(null);
        }
      } else if (updatedCategories.length === 0) {
        setActiveCategoryName(null);
        setActiveToolId(null);
      }
      
      return {
        ...prev,
        categories: updatedCategories,
        tools: updatedTools
      };
    });
  };

  const moveCategory = (categoryName: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const categories = [...prev.categories];
      const index = categories.indexOf(categoryName);
      
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        // Move up
        [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
      } else if (direction === 'down' && index < categories.length - 1) {
        // Move down
        [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
      }
      
      return {
        ...prev,
        categories
      };
    });
  };

  const addTool = (categoryName: string) => {
    const newTool: ToolTechItem = {
      id: uuidv4(),
      name: 'New Tool',
      description: 'Description of the tool',
      imageUrl: '',
      category: categoryName,
      proficiency: 75,
      yearsOfExperience: 1,
      link: ''
    };

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tools: [...prev.tools, newTool]
      };
    });

    setActiveToolId(newTool.id);
    setActiveTab('tools');
  };

  const updateTool = (toolId: string, field: keyof ToolTechItem, value: string | number) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        tools: prev.tools.map(tool => {
          if (tool.id === toolId) {
            return { ...tool, [field]: value };
          }
          return tool;
        })
      };
    });
  };

  const removeTool = (toolId: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      const updatedTools = prev.tools.filter(tool => tool.id !== toolId);
      
      // If we're removing the active tool, select another one from the same category
      if (activeToolId === toolId && activeCategoryName) {
        const toolsInCategory = updatedTools.filter(
          tool => tool.category === activeCategoryName
        );
        
        if (toolsInCategory.length > 0) {
          setActiveToolId(toolsInCategory[0].id);
        } else {
          setActiveToolId(null);
        }
      }
      
      return {
        ...prev,
        tools: updatedTools
      };
    });
  };

  const moveTool = (toolId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const tools = [...prev.tools];
      const index = tools.findIndex(tool => tool.id === toolId);
      
      if (index === -1) return prev;
      
      const categoryTools = tools.filter(tool => tool.category === tools[index].category);
      const categoryIndex = categoryTools.findIndex(tool => tool.id === toolId);
      
      if (direction === 'up' && categoryIndex > 0) {
        // Find the index of the previous tool in the same category
        const prevCategoryToolId = categoryTools[categoryIndex - 1].id;
        const prevIndex = tools.findIndex(tool => tool.id === prevCategoryToolId);
        
        // Swap the tools
        [tools[index], tools[prevIndex]] = [tools[prevIndex], tools[index]];
      } else if (direction === 'down' && categoryIndex < categoryTools.length - 1) {
        // Find the index of the next tool in the same category
        const nextCategoryToolId = categoryTools[categoryIndex + 1].id;
        const nextIndex = tools.findIndex(tool => tool.id === nextCategoryToolId);
        
        // Swap the tools
        [tools[index], tools[nextIndex]] = [tools[nextIndex], tools[index]];
      }
      
      return {
        ...prev,
        tools
      };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && activeToolId) {
      setImageFile(files[0]);
    }
  };

  const uploadImage = async () => {
    if (imageFile && activeToolId) {
      try {
        const imageUrl = await uploadToolImage(activeToolId, imageFile);
        
        setFormData(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            tools: prev.tools.map(tool => {
              if (tool.id === activeToolId) {
                return { ...tool, imageUrl };
              }
              return tool;
            })
          };
        });
        
        setImageFile(null);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateToolsTechnologiesData(formData);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving tools & technologies data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const activeTool = activeToolId ? formData.tools.find(tool => tool.id === activeToolId) : null;
  const toolsByCategory = activeCategoryName ? formData.tools.filter(tool => tool.category === activeCategoryName) : [];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        
        {/* Header Tab */}
        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => handleHeaderChange('title', e.target.value)} 
                    placeholder="Tools & Technologies"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <Input 
                    value={formData.subtitle} 
                    onChange={(e) => handleHeaderChange('subtitle', e.target.value)} 
                    placeholder="The tools and technologies I work with"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Categories</h3>
            <Button onClick={addCategory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.categories.map((category) => (
              <Card key={category} className={`cursor-pointer ${activeCategoryName === category ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveCategoryName(category)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Input 
                        value={category} 
                        onChange={(e) => updateCategoryName(category, e.target.value)} 
                        className="font-medium"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); moveCategory(category, 'up'); }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); moveCategory(category, 'down'); }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); removeCategory(category); }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {formData.tools.filter(tool => tool.category === category).length} tools
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {activeCategoryName && (
            <div className="mt-6">
              <Button onClick={() => addTool(activeCategoryName)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tool to {activeCategoryName}
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Tools List</h3>
                {activeCategoryName && (
                  <Button onClick={() => addTool(activeCategoryName)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {formData.categories.map((category) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{category}</h4>
                    <div className="space-y-1">
                      {formData.tools
                        .filter(tool => tool.category === category)
                        .map((tool) => (
                          <div 
                            key={tool.id} 
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeToolId === tool.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                            onClick={() => setActiveToolId(tool.id)}
                          >
                            <span className="truncate">{tool.name}</span>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={(e) => { e.stopPropagation(); moveTool(tool.id, 'up'); }}
                              >
                                <MoveUp className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={(e) => { e.stopPropagation(); moveTool(tool.id, 'down'); }}
                              >
                                <MoveDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3">
              {activeTool ? (
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
                        <Input 
                          value={activeTool.name} 
                          onChange={(e) => updateTool(activeTool.id, 'name', e.target.value)} 
                          placeholder="Tool Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                          value={activeTool.category} 
                          onChange={(e) => updateTool(activeTool.id, 'category', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {formData.categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Textarea 
                        value={activeTool.description} 
                        onChange={(e) => updateTool(activeTool.id, 'description', e.target.value)} 
                        placeholder="Describe the tool and your experience with it"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency (0-100)</label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={activeTool.proficiency} 
                            onChange={(e) => updateTool(activeTool.id, 'proficiency', parseInt(e.target.value) || 0)} 
                          />
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${activeTool.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.5" 
                          value={activeTool.yearsOfExperience} 
                          onChange={(e) => updateTool(activeTool.id, 'yearsOfExperience', parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                      <div className="flex items-center space-x-2">
                        <Link className="h-4 w-4 text-gray-500" />
                        <Input 
                          type="url" 
                          value={activeTool.link || ''} 
                          onChange={(e) => updateTool(activeTool.id, 'link', e.target.value)} 
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                          {activeTool.imageUrl ? (
                            <img 
                              src={activeTool.imageUrl} 
                              alt={activeTool.name} 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Image className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-primary file:text-white
                              hover:file:bg-primary/90"
                          />
                          
                          {imageFile && (
                            <Button onClick={uploadImage} size="sm">
                              <Image className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeTool(activeTool.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Tool
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">Select a tool from the list or add a new one.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        
        {saveSuccess && (
          <span className="text-green-600 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved successfully!
          </span>
        )}
      </div>
    </div>
  );
};

export default ToolsTechnologiesEditor;