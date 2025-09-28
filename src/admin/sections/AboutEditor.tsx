import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { AboutData } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Save from 'lucide-react/dist/esm/icons/save';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Image from 'lucide-react/dist/esm/icons/image';

const AboutEditor: React.FC = () => {
  const { aboutData, isLoading, errors, updateAboutData, refreshAboutData } = useData();
  const [formData, setFormData] = useState<AboutData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (aboutData) {
      setFormData(aboutData);
    }
  }, [aboutData]);

  if (isLoading.about || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading about data...</span>
      </div>
    );
  }

  if (errors.about) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.about}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshAboutData()}
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

  const handleBioChange = (value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        description: value
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      // Store the current form data to use with updateAboutData
      if (formData) {
        // Create a FileReader to preview the image locally
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Update the local state with the preview image
          const updatedFormData = {
            ...formData,
            photoUrl: reader.result as string
          };
          
          // Update the form data and pass the file for upload
          await updateAboutData(updatedFormData, file);
          setFormData(updatedFormData);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const addKeyPoint = () => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        highlights: [...(prev.highlights || []), 'New key point']
      };
    });
  };

  const updateKeyPoint = (index: number, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedPoints = [...(prev.highlights || [])];
      updatedPoints[index] = value;
      return {
        ...prev,
        highlights: updatedPoints
      };
    });
  };

  const removeKeyPoint = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedPoints = [...(prev.highlights || [])];
      updatedPoints.splice(index, 1);
      return {
        ...prev,
        highlights: updatedPoints
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateAboutData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="keypoints">Key Points</TabsTrigger>
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
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleBioChange(e.target.value)}
                    rows={8}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can use markdown formatting in your bio.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 border rounded-md overflow-hidden">
                      <img 
                        src={formData.photoUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <label className="block w-full">
                        <span className="sr-only">Choose profile image</span>
                        <input 
                          type="file" 
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-100 file:text-gray-700
                            hover:file:bg-gray-200"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keypoints" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Key Points</h2>
            <Button 
              type="button" 
              onClick={addKeyPoint}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Key Point
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {(formData.highlights || []).map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => updateKeyPoint(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeKeyPoint(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {(!formData.highlights || formData.highlights.length === 0) && (
                  <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500">No key points yet. Click "Add Key Point" to create one.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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

export default AboutEditor;