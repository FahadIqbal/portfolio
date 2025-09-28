import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ExperienceData, ExperienceItem } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import MoveUp from 'lucide-react/dist/esm/icons/move-up';
import MoveDown from 'lucide-react/dist/esm/icons/move-down';
import { v4 as uuidv4 } from 'uuid';

const ExperienceEditor: React.FC = () => {
  const { experienceData, isLoading, errors, updateExperienceData, refreshExperienceData } = useData();
  const [formData, setFormData] = useState<ExperienceData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<{ track: 'pmTrack' | 'devTrack', id: string } | null>(null);

  useEffect(() => {
    if (experienceData) {
      setFormData(experienceData);
    }
  }, [experienceData]);

  if (isLoading.experience || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading experience data...</span>
      </div>
    );
  }

  if (errors.experience) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.experience}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshExperienceData()}
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

  const addExperienceItem = (track: 'pmTrack' | 'devTrack') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const newItem: ExperienceItem = {
        id: uuidv4(),
        company: 'New Company',
        role: 'New Role',
        period: 'Start - End',
        location: 'Location',
        icon: 'default-icon',
        highlights: ['New highlight']
      };
      
      return {
        ...prev,
        [track]: [...prev[track], newItem]
      };
    });
    
    // Switch to the appropriate tab
    setActiveTab(track === 'pmTrack' ? 'pm' : 'dev');
  };

  const removeExperienceItem = (track: 'pmTrack' | 'devTrack', id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [track]: prev[track].filter(item => item.id !== id)
      };
    });
  };

  const moveExperienceItem = (track: 'pmTrack' | 'devTrack', id: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const items = [...prev[track]];
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        // Move up
        [items[index], items[index - 1]] = [items[index - 1], items[index]];
      } else if (direction === 'down' && index < items.length - 1) {
        // Move down
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
      }
      
      return {
        ...prev,
        [track]: items
      };
    });
  };

  const updateExperienceItemField = (track: 'pmTrack' | 'devTrack', id: string, field: keyof ExperienceItem, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [track]: prev[track].map(item => {
          if (item.id === id) {
            return { ...item, [field]: value };
          }
          return item;
        })
      };
    });
  };

  const addHighlight = (track: 'pmTrack' | 'devTrack', id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [track]: prev[track].map(item => {
          if (item.id === id) {
            return { 
              ...item, 
              highlights: [...item.highlights, 'New highlight']
            };
          }
          return item;
        })
      };
    });
  };

  const updateHighlight = (track: 'pmTrack' | 'devTrack', id: string, highlightIndex: number, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [track]: prev[track].map(item => {
          if (item.id === id) {
            const highlights = [...item.highlights];
            highlights[highlightIndex] = value;
            return { ...item, highlights };
          }
          return item;
        })
      };
    });
  };

  const removeHighlight = (track: 'pmTrack' | 'devTrack', id: string, highlightIndex: number) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [track]: prev[track].map(item => {
          if (item.id === id) {
            const highlights = [...item.highlights];
            highlights.splice(highlightIndex, 1);
            return { ...item, highlights };
          }
          return item;
        })
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateExperienceData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving experience data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderExperienceItemEditor = (item: ExperienceItem, track: 'pmTrack' | 'devTrack') => {
    return (
      <Card key={item.id} className="mb-4 border-l-4 border-l-gray-500">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{item.company} - {item.role}</h3>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => moveExperienceItem(track, item.id, 'up')}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => moveExperienceItem(track, item.id, 'down')}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeExperienceItem(track, item.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => updateExperienceItemField(track, item.id, 'company', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => updateExperienceItemField(track, item.id, 'role', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <input
                type="text"
                value={item.period}
                onChange={(e) => updateExperienceItemField(track, item.id, 'period', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Jan 2020 - Present"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => updateExperienceItemField(track, item.id, 'location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                value={item.icon}
                onChange={(e) => updateExperienceItemField(track, item.id, 'icon', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Icon name or URL"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Highlights</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addHighlight(track, item.id)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Highlight
              </Button>
            </div>
            
            {item.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => updateHighlight(track, item.id, index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeHighlight(track, item.id, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="pm">Project Management</TabsTrigger>
          <TabsTrigger value="dev">Development</TabsTrigger>
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
        
        <TabsContent value="pm" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Project Management Experience</h2>
            <Button 
              type="button" 
              onClick={() => addExperienceItem('pmTrack')}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
          </div>
          
          {formData.pmTrack.map(item => renderExperienceItemEditor(item, 'pmTrack'))}
          
          {formData.pmTrack.length === 0 && (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">No experience items yet. Click "Add Experience" to create one.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dev" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Development Experience</h2>
            <Button 
              type="button" 
              onClick={() => addExperienceItem('devTrack')}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
          </div>
          
          {formData.devTrack.map(item => renderExperienceItemEditor(item, 'devTrack'))}
          
          {formData.devTrack.length === 0 && (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">No experience items yet. Click "Add Experience" to create one.</p>
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

export default ExperienceEditor;