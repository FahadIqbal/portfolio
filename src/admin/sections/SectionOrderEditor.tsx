import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';

interface Section {
  id: string;
  label: string;
  enabled: boolean;
}

const SectionOrderEditor: React.FC = () => {
  const { settingsData, updateSettingsData } = useData();
  const [sections, setSections] = useState<Section[]>([
    { id: 'hero', label: 'Hero Section', enabled: true },
    { id: 'about', label: 'About Section', enabled: true },
    { id: 'experience', label: 'Experience Section', enabled: true },
    { id: 'projects', label: 'Projects Section', enabled: true },
    { id: 'skills', label: 'Skills Section', enabled: true },
    { id: 'tools', label: 'Tools & Technologies Section', enabled: true },
    { id: 'certifications', label: 'Certifications Section', enabled: true },
    { id: 'testimonials', label: 'Testimonials Section', enabled: true },
    { id: 'contact', label: 'Contact Section', enabled: true },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settingsData) {
      // Initialize sections with the current order and enabled state
      const currentOrder = settingsData.sectionOrder || [
        'hero', 'about', 'experience', 'projects', 'skills', 'certifications', 'testimonials', 'contact'
      ];
      
      const updatedSections = currentOrder.map(id => ({
        id,
        label: getSectionLabel(id),
        enabled: settingsData.features[id as keyof typeof settingsData.features] || false
      }));
      
      setSections(updatedSections);
    }
  }, [settingsData]);

  const getSectionLabel = (id: string): string => {
    const labelMap: Record<string, string> = {
      hero: 'Hero Section',
      about: 'About Section',
      experience: 'Experience Section',
      projects: 'Projects Section',
      skills: 'Skills Section',
      tools: 'Tools & Technologies Section',
      certifications: 'Certifications Section',
      testimonials: 'Testimonials Section',
      contact: 'Contact Section'
    };
    
    return labelMap[id] || id;
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the sections
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setSections(newSections);
  };

  const toggleSectionVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!settingsData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Create the updated section order
      const sectionOrder = sections.map(section => section.id);
      
      // Create the updated features object
      const features = { ...settingsData.features };
      sections.forEach(section => {
        if (section.id in features) {
          features[section.id as keyof typeof features] = section.enabled;
        }
      });
      
      // Update the settings data
      await updateSettingsData({
        ...settingsData,
        sectionOrder,
        features
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving section order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop sections to rearrange their order on your portfolio. 
              You can also toggle sections on/off to show or hide them.
            </p>
            
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  className={`p-3 border rounded-md flex items-center justify-between ${section.enabled ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => toggleSectionVisibility(index)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <span className={`font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                      {section.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex items-center justify-between">
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Order
            </>
          )}
        </Button>
        
        {saveSuccess && (
          <span className="text-green-600 text-sm">Section order saved successfully!</span>
        )}
      </div>
    </div>
  );
};

export default SectionOrderEditor;