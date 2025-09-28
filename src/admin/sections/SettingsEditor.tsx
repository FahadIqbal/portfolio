import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { SettingsData } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Save from 'lucide-react/dist/esm/icons/save';
import Image from 'lucide-react/dist/esm/icons/image';
import Wand from 'lucide-react/dist/esm/icons/wand';
import SectionOrderEditor from './SectionOrderEditor';
import { generateFaviconFromSettings, generateLogoFromSettings } from '../../utils/faviconGenerator';

const SettingsEditor: React.FC = () => {
  const { settingsData, isLoading, errors, updateSettingsData, uploadSiteImage, refreshSettingsData } = useData();
  const [formData, setFormData] = useState<SettingsData | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    if (settingsData) {
      // Ensure features property exists with default values if missing
      const safeSettingsData = {
        ...settingsData,
        features: settingsData.features || {
          hero: true,
          about: true,
          experience: true,
          projects: true,
          skills: true,
          tools: true,
          certifications: true,
          testimonials: true,
          contact: true
        },
        // Ensure trackTypes property exists with default values if missing
        trackTypes: settingsData.trackTypes || [
          { id: "pm", name: "Project Manager", icon: "Briefcase" },
          { id: "dev", name: "Developer", icon: "Code" }
        ]
      };
      setFormData(safeSettingsData);
    }
  }, [settingsData]);

  if (isLoading.settings || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading settings data...</span>
      </div>
    );
  }

  if (errors.settings) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.settings}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshSettingsData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleGeneralChange = (field: keyof SettingsData, value: string | boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleMetaChange = (field: 'siteTitle' | 'siteDescription' | 'siteKeywords', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleThemeChange = (field: 'primaryColor' | 'secondaryColor', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  const handleDarkModeToggle = (enabled: boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        darkMode: enabled
      };
    });
  };
  
  const handleFeatureToggle = (feature: keyof SettingsData['features'], enabled: boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        features: {
          ...prev.features,
          [feature]: enabled
        }
      };
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingLogo(true);
    
    try {
      const logoUrl = await uploadSiteImage('logo', file);
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          logoUrl
        };
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFavicon(true);
    
    try {
      const faviconUrl = await uploadSiteImage('favicon', file);
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          faviconUrl
        };
      });
    } catch (error) {
      console.error('Error uploading favicon:', error);
    } finally {
      setUploadingFavicon(false);
    }
  };
  
  const handleGenerateFavicon = async () => {
    if (!formData) return;
    
    // Generate favicon from site title
    const faviconUrl = generateFaviconFromSettings(formData);
    
    // Update form data with the generated favicon URL
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        faviconUrl
      };
    });
    
    // Upload the generated favicon to Firebase
    try {
      // Convert data URL to Blob
      const response = await fetch(faviconUrl);
      const blob = await response.blob();
      
      // Create a File object from the Blob
      const file = new File([blob], 'favicon.svg', { type: 'image/svg+xml' });
      
      // Upload to Firebase Storage
      const uploadedFaviconUrl = await uploadSiteImage('favicon', file);
      
      // Update the form data with the Firebase URL
      const updatedFormData = {
        ...formData,
        faviconUrl: uploadedFaviconUrl
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      // Save the updated settings to Firestore
      await updateSettingsData(updatedFormData);
      
      // Show success message
      alert('Favicon generated and uploaded to Firebase successfully!');
    } catch (error) {
      console.error('Error uploading generated favicon to Firebase:', error);
      alert('Favicon generated but failed to upload to Firebase. Please try again.');
    }
  };
  
  const handleGenerateLogo = async () => {
    if (!formData) return;
    
    // Generate logo from site title
    const logoUrl = generateLogoFromSettings(formData);
    
    // Update form data with the generated logo URL
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        logoUrl
      };
    });
    
    // Upload the generated logo to Firebase
    try {
      // Convert data URL to Blob
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      
      // Create a File object from the Blob
      const file = new File([blob], 'logo.svg', { type: 'image/svg+xml' });
      
      // Upload to Firebase Storage
      const uploadedLogoUrl = await uploadSiteImage('logo', file);
      
      // Update the form data with the Firebase URL
      const updatedFormData = {
        ...formData,
        logoUrl: uploadedLogoUrl
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      // Save the updated settings to Firestore
      await updateSettingsData(updatedFormData);
      
      // Show success message
      alert('Logo generated and uploaded to Firebase successfully!');
    } catch (error) {
      console.error('Error uploading generated logo to Firebase:', error);
      alert('Logo generated but failed to upload to Firebase. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateSettingsData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="sectionOrder">Section Order</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                  <input
                    type="text"
                    value={formData.siteTitle}
                    onChange={(e) => handleGeneralChange('siteTitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                  <input
                    type="text"
                    value={formData.userName || ''}
                    onChange={(e) => handleGeneralChange('userName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your name for logo generation"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used to generate logos with your initials</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-12 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {formData.logoUrl ? (
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo" 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No logo</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <label className="block flex-1">
                          <span className="sr-only">Choose logo</span>
                          <input 
                            type="file" 
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-gray-100 file:text-gray-700
                              hover:file:bg-gray-200"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploadingLogo}
                          />
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={handleGenerateLogo}
                          title="Generate logo from site title"
                        >
                          <Wand className="h-4 w-4" />
                          <span>Generate</span>
                        </Button>
                      </div>
                      {uploadingLogo && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                      <p className="text-xs text-gray-500">Upload a custom image or generate from site title</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {formData.faviconUrl ? (
                        <img 
                          src={formData.faviconUrl} 
                          alt="Favicon" 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No favicon</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <label className="block flex-1">
                          <span className="sr-only">Choose favicon</span>
                          <input 
                            type="file" 
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-gray-100 file:text-gray-700
                              hover:file:bg-gray-200"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            disabled={uploadingFavicon}
                          />
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={handleGenerateFavicon}
                          title="Generate favicon from site title"
                        >
                          <Wand className="h-4 w-4" />
                          <span>Generate</span>
                        </Button>
                      </div>
                      {uploadingFavicon && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                      <p className="text-xs text-gray-500">Upload a custom image or generate from site title</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showTrackToggle"
                      checked={formData.showTrackToggle}
                      onChange={(e) => handleGeneralChange('showTrackToggle', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="showTrackToggle" className="ml-2 block text-sm text-gray-700">
                      Show Track Toggle
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Track Types</label>
                    <p className="text-xs text-gray-500 mb-3">Configure the different track types (roles) that can be displayed in your portfolio.</p>
                    
                    <div className="space-y-3 mb-4">
                      {formData.trackTypes?.map((track, index) => (
                        <div key={track.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`track-${track.id}`}
                                name="activeTrack"
                                checked={formData.activeTrack === track.id}
                                onChange={() => handleGeneralChange('activeTrack', track.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <label htmlFor={`track-${track.id}`} className="font-medium">
                                {track.name}
                              </label>
                              {formData.activeTrack === track.id && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ID: {track.id}</div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="p-1 text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                // Remove track type
                                const newTrackTypes = formData.trackTypes ? formData.trackTypes.filter((_, i) => i !== index) : [];
                                
                                // If we're removing the active track, set the first remaining track as active
                                let newActiveTrack = formData.activeTrack;
                                if (track.id === formData.activeTrack && newTrackTypes.length > 0 && newTrackTypes[0] && newTrackTypes[0].id) {
                                  newActiveTrack = newTrackTypes[0].id;
                                }
                                
                                setFormData(prev => {
                                  if (!prev) return null;
                                  return {
                                    ...prev,
                                    trackTypes: newTrackTypes,
                                    activeTrack: newActiveTrack
                                  };
                                });
                              }}
                              disabled={!formData.trackTypes || formData.trackTypes.length <= 1} // Prevent removing the last track
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        // Show a prompt to get the new track type details
                        const trackName = prompt('Enter the name for the new track type:');
                        if (!trackName) return;
                        
                        // Generate a unique ID based on the name (lowercase, no spaces)
                        const trackId = trackName.toLowerCase().replace(/\s+/g, '-');
                        
                        // Add the new track type
                        const newTrackType = { id: trackId, name: trackName };
                        setFormData(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            trackTypes: prev.trackTypes ? [...prev.trackTypes, newTrackType] : [newTrackType]
                          };
                        });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add New Track Type</span>
                    </button>
                  </div>
                </div>
                

              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.siteTitle}
                    onChange={(e) => handleMetaChange('siteTitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    value={formData.siteDescription}
                    onChange={(e) => handleMetaChange('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                  <input
                    type="text"
                    value={formData.siteKeywords}
                    onChange={(e) => handleMetaChange('siteKeywords', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated list of keywords</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="h-10 w-10 border-0 p-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="w-32 p-2 border border-gray-300 rounded-md"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="h-10 w-10 border-0 p-0"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="w-32 p-2 border border-gray-300 rounded-md"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Enable dark theme for your portfolio</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dark-mode-toggle"
                      checked={formData.darkMode || false}
                      onChange={(e) => handleDarkModeToggle(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="dark-mode-toggle" className="ml-2 block text-sm text-gray-700">
                      {formData.darkMode ? 'Enabled' : 'Disabled'}
                    </label>
                  </div>
                </div>
                

                
                <div className="p-4 border border-gray-200 rounded-md">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div 
                    className="p-4 rounded-md" 
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <h4 
                      className="text-lg font-bold mb-2" 
                      style={{ color: formData.primaryColor }}
                    >
                      Heading Example
                    </h4>
                    <p 
                      className="mb-2" 
                      style={{ color: '#000000' }}
                    >
                      This is an example paragraph showing how your text will look with the selected colors.
                    </p>
                    <button
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      Button Example
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Enable/Disable Sections</h3>
                <p className="text-sm text-gray-500">Toggle sections to show or hide them on your portfolio.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Hero Section</h4>
                      <p className="text-sm text-gray-500">Main introduction and headline</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-hero"
                        checked={formData.features.hero}
                        onChange={(e) => handleFeatureToggle('hero', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-hero" className="ml-2 block text-sm text-gray-700">
                        {formData.features.hero ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">About Section</h4>
                      <p className="text-sm text-gray-500">Personal information and bio</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-about"
                        checked={formData.features.about}
                        onChange={(e) => handleFeatureToggle('about', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-about" className="ml-2 block text-sm text-gray-700">
                        {formData.features.about ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Experience Section</h4>
                      <p className="text-sm text-gray-500">Work history and roles</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-experience"
                        checked={formData.features.experience}
                        onChange={(e) => handleFeatureToggle('experience', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-experience" className="ml-2 block text-sm text-gray-700">
                        {formData.features.experience ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Projects Section</h4>
                      <p className="text-sm text-gray-500">Portfolio projects and case studies</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-projects"
                        checked={formData.features.projects}
                        onChange={(e) => handleFeatureToggle('projects', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-projects" className="ml-2 block text-sm text-gray-700">
                        {formData.features.projects ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Skills Section</h4>
                      <p className="text-sm text-gray-500">Technical and professional skills</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-skills"
                        checked={formData.features.skills}
                        onChange={(e) => handleFeatureToggle('skills', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-skills" className="ml-2 block text-sm text-gray-700">
                        {formData.features.skills ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Tools & Technologies Section</h4>
                      <p className="text-sm text-gray-500">Tools and technologies expertise</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-tools"
                        checked={formData.features.tools}
                        onChange={(e) => handleFeatureToggle('tools', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-tools" className="ml-2 block text-sm text-gray-700">
                        {formData.features.tools ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Certifications Section</h4>
                      <p className="text-sm text-gray-500">Professional certifications and credentials</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-certifications"
                        checked={formData.features.certifications}
                        onChange={(e) => handleFeatureToggle('certifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-certifications" className="ml-2 block text-sm text-gray-700">
                        {formData.features.certifications ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Testimonials Section</h4>
                      <p className="text-sm text-gray-500">Client and colleague testimonials</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-testimonials"
                        checked={formData.features.testimonials}
                        onChange={(e) => handleFeatureToggle('testimonials', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-testimonials" className="ml-2 block text-sm text-gray-700">
                        {formData.features.testimonials ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Contact Section</h4>
                      <p className="text-sm text-gray-500">Contact form and information</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-contact"
                        checked={formData.features.contact}
                        onChange={(e) => handleFeatureToggle('contact', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-contact" className="ml-2 block text-sm text-gray-700">
                        {formData.features.contact ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <h4 className="font-medium">Footer Section</h4>
                      <p className="text-sm text-gray-500">Footer content and social links</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-footer"
                        checked={formData.features.footer}
                        onChange={(e) => handleFeatureToggle('footer', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-footer" className="ml-2 block text-sm text-gray-700">
                        {formData.features.footer ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sectionOrder" className="space-y-4">
          <SectionOrderEditor />
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

export default SettingsEditor;