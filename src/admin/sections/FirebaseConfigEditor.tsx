import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Save from 'lucide-react/dist/esm/icons/save';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import firebaseConfigService, { SaasConfig } from '../services/FirebaseConfigService';
import { reinitializeFirebase } from '../services/FirebaseInitializer';

const FirebaseConfigEditor: React.FC = () => {
  const [formData, setFormData] = useState<SaasConfig | null>(null);
  const [activeTab, setActiveTab] = useState('firebase');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [needsReinitialization, setNeedsReinitialization] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to load Firebase configuration...');
      const config = await firebaseConfigService.getFirebaseConfig();
      console.log('Firebase configuration loaded successfully');
      setFormData(config);
    } catch (err) {
      console.error('Error in FirebaseConfigEditor when loading config:', err);
      
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (err.message.includes('Authentication required')) {
          setError('Authentication required. Please ensure you are logged in and try again.');
        } else if (err.message.includes('Permission denied')) {
          setError('Permission denied. You do not have access to the Firebase configuration.');
        } else if (err.message.includes('network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(`Failed to load Firebase configuration: ${err.message}`);
        }
      } else {
        setError('Failed to load Firebase configuration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseConfigChange = (field: keyof SaasConfig['firebase'], value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        firebase: {
          ...prev.firebase,
          [field]: value
        }
      };
    });
    setNeedsReinitialization(true);
  };

  const handleAdminConfigChange = (field: keyof SaasConfig['admin'], value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        admin: {
          ...prev.admin,
          [field]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      console.log('Attempting to save Firebase configuration...');
      await firebaseConfigService.saveFirebaseConfig(formData);
      
      // Reinitialize Firebase if config has changed
      if (needsReinitialization) {
        console.log('Reinitializing Firebase with new configuration...');
        reinitializeFirebase(formData.firebase);
        setNeedsReinitialization(false);
      }
      
      console.log('Firebase configuration saved successfully');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error in FirebaseConfigEditor when saving config:', err);
      
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (err.message.includes('Authentication required')) {
          setError('Authentication required. Please ensure you are logged in and try again.');
        } else if (err.message.includes('Permission denied')) {
          setError('Permission denied. You do not have access to save the Firebase configuration.');
        } else if (err.message.includes('network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(`Failed to save configuration: ${err.message}`);
        }
      } else {
        setError('Failed to save configuration. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading configuration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={loadConfig}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-600">No configuration found. Please initialize the system.</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => firebaseConfigService.initializeConfig()}
        >
          Initialize Configuration
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Firebase Configuration</h1>
        <p className="text-gray-500">Configure your Firebase settings for this portfolio application.</p>
      </div>

      {needsReinitialization && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            You've made changes to the Firebase configuration. Save to apply these changes.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="firebase">Firebase Settings</TabsTrigger>
          <TabsTrigger value="admin">Admin Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="firebase" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="text"
                    value={formData.firebase.apiKey}
                    onChange={(e) => handleFirebaseConfigChange('apiKey', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Your Firebase API Key"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auth Domain</label>
                  <input
                    type="text"
                    value={formData.firebase.authDomain}
                    onChange={(e) => handleFirebaseConfigChange('authDomain', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="your-project-id.firebaseapp.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                  <input
                    type="text"
                    value={formData.firebase.projectId}
                    onChange={(e) => handleFirebaseConfigChange('projectId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="your-project-id"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Bucket</label>
                  <input
                    type="text"
                    value={formData.firebase.storageBucket}
                    onChange={(e) => handleFirebaseConfigChange('storageBucket', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="your-project-id.appspot.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Messaging Sender ID</label>
                  <input
                    type="text"
                    value={formData.firebase.messagingSenderId}
                    onChange={(e) => handleFirebaseConfigChange('messagingSenderId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="123456789012"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                  <input
                    type="text"
                    value={formData.firebase.appId}
                    onChange={(e) => handleFirebaseConfigChange('appId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1:123456789012:web:abcdef1234567890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Measurement ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.firebase.measurementId || ''}
                    onChange={(e) => handleFirebaseConfigChange('measurementId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="G-ABCDEFGHIJ"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={formData.admin.adminEmail}
                    onChange={(e) => handleAdminConfigChange('adminEmail', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                  <input
                    type="password"
                    value={formData.admin.adminPassword}
                    onChange={(e) => handleAdminConfigChange('adminPassword', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Note: This password is stored in Firestore. Make sure your security rules are properly configured.</p>
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
              Save Configuration
            </>
          )}
        </Button>
        
        {saveSuccess && (
          <span className="text-green-600 text-sm">Configuration saved successfully!</span>
        )}
      </div>
    </form>
  );
};

export default FirebaseConfigEditor;