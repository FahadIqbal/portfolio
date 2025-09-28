import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ContactData } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';

const ContactEditor: React.FC = () => {
  const { contactData, isLoading, errors, updateContactData, refreshContactData } = useData();
  const [formData, setFormData] = useState<ContactData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (contactData) {
      setFormData(contactData);
    }
  }, [contactData]);

  if (isLoading.contact || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading contact data...</span>
      </div>
    );
  }

  if (errors.contact) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.contact}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshContactData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleHeaderChange = (field: 'title' | 'subtitle' | 'description', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        email: value
      };
    });
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        phone: value
      };
    });
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        location: value
      };
    });
  };

  // Social links are now handled directly in the form inputs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateContactData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving contact data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleHeaderChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Social Links</h2>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                  <h3 className="font-medium">LinkedIn</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin || ''}
                      onChange={(e) => setFormData(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            linkedin: e.target.value
                          }
                        };
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                  <h3 className="font-medium">GitHub</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={formData.socialLinks.github || ''}
                      onChange={(e) => setFormData(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            github: e.target.value
                          }
                        };
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                  <h3 className="font-medium">Twitter</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter || ''}
                      onChange={(e) => setFormData(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            twitter: e.target.value
                          }
                        };
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
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

export default ContactEditor;