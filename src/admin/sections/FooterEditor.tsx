import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FooterData } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Save from 'lucide-react/dist/esm/icons/save';
import Github from 'lucide-react/dist/esm/icons/github';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Mail from 'lucide-react/dist/esm/icons/mail';


const FooterEditor: React.FC = () => {
  const { footerData, isLoading, errors, updateFooterData, refreshFooterData } = useData();
  const [formData, setFormData] = useState<FooterData | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (footerData) {
      setFormData(footerData);
    }
  }, [footerData]);

  if (isLoading.footer || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading footer data...</span>
      </div>
    );
  }

  if (errors.footer) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.footer}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshFooterData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleCopyrightChange = (value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        copyright: value
      };
    });
  };

  const handleSocialLinkChange = (platform: keyof FooterData['socialLinks'], value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateFooterData(formData);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving footer data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                  <input
                    type="text"
                    value={formData.copyright}
                    onChange={(e) => handleCopyrightChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="© 2025 Fahad Iqbal. All rights reserved."
                  />
                  <p className="text-sm text-gray-500 mt-1">The current year will be automatically added.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks.github}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://github.com/fahadiqbal"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://linkedin.com/in/fahad-iqbal-07496a28/"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks.email}
                      onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="mailto:fahad.iqbal88@gmail.com"
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

export default FooterEditor;