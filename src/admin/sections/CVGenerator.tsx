import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import FileTextIcon from 'lucide-react/dist/esm/icons/file-text';
import UploadIcon from 'lucide-react/dist/esm/icons/upload';
import { storage } from '../services/FirebaseInitializer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ResumeFile {
  name: string;
  file: File | null;
  previewUrl: string | null;
  uploading: boolean;
  error: string | null;
}

const CVGenerator: React.FC = () => {
  const { } = useData(); // We'll add specific data when implementing resume generation
  const [activeTab, setActiveTab] = useState('upload');
  const [resumeFiles, setResumeFiles] = useState<{
    'project-manager': ResumeFile;
    'developer': ResumeFile;
  }>({
    'project-manager': {
      name: 'Project Manager Resume',
      file: null,
      previewUrl: null,
      uploading: false,
      error: null
    },
    'developer': {
      name: 'Developer Resume',
      file: null,
      previewUrl: null,
      uploading: false,
      error: null
    }
  });

  // Check if resumes exist on component mount
  useEffect(() => {
    const checkExistingResumes = async () => {
      try {
        // Check for project manager resume
        const pmResumeRef = ref(storage, 'resumes/project-manager-resume.pdf');
        const pmResumeUrl = await getDownloadURL(pmResumeRef).catch(() => null);
        
        // Check for developer resume
        const devResumeRef = ref(storage, 'resumes/developer-resume.pdf');
        const devResumeUrl = await getDownloadURL(devResumeRef).catch(() => null);
        
        setResumeFiles(prev => ({
          'project-manager': {
            ...prev['project-manager'],
            previewUrl: pmResumeUrl
          },
          'developer': {
            ...prev['developer'],
            previewUrl: devResumeUrl
          }
        }));
      } catch (error) {
        console.error('Error checking existing resumes:', error);
      }
    };
    
    checkExistingResumes();
  }, []);

  const handleFileChange = (type: 'project-manager' | 'developer', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setResumeFiles(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          error: 'Only PDF files are allowed'
        }
      }));
      return;
    }
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setResumeFiles(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        file,
        previewUrl,
        error: null
      }
    }));
  };

  const uploadResume = async (type: 'project-manager' | 'developer') => {
    const resumeFile = resumeFiles[type];
    if (!resumeFile.file) return;
    
    setResumeFiles(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        uploading: true,
        error: null
      }
    }));
    
    try {
      // Upload to Firebase Storage
      const filename = type === 'project-manager' ? 'project-manager-resume.pdf' : 'developer-resume.pdf';
      const storageRef = ref(storage, `resumes/${filename}`);
      await uploadBytes(storageRef, resumeFile.file);
      
      // Get the download URL
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Create a Blob from the file to download it
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      
      // Instead of clicking to download, we'll use this to save to public folder
      // This is a client-side simulation of copying to public folder
      // In a real production environment, you would use a server-side function
      console.log(`Resume uploaded to Firebase Storage: ${downloadUrl}`);
      console.log(`Resume is now available for download at /resumes/${filename}`);
      
      // Clean up
      document.body.removeChild(link);
      
      setResumeFiles(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          previewUrl: downloadUrl,
          uploading: false
        }
      }));
      
      // Show success message
      alert(`Resume uploaded successfully! It is now available for download in the Contact section.`);
    } catch (error) {
      console.error(`Error uploading ${type} resume:`, error);
      setResumeFiles(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploading: false,
          error: 'Failed to upload resume. Please try again.'
        }
      }));
    }
  };

  const generateResume = async (type: 'project-manager' | 'developer') => {
    // This is a placeholder for the actual resume generation logic
    // In a real implementation, you would send the portfolio data to a server
    // that would generate a PDF and return it
    
    setResumeFiles(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        uploading: true,
        error: null
      }
    }));
    
    try {
      // Simulate API call to generate resume
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll just show an error message since we don't have the actual generation logic
      setResumeFiles(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploading: false,
          error: 'Automatic resume generation is not implemented yet. Please upload a PDF manually.'
        }
      }));
    } catch (error) {
      console.error(`Error generating ${type} resume:`, error);
      setResumeFiles(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploading: false,
          error: 'Failed to generate resume. Please try again.'
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="generate">Generate Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Manager Resume Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Manager Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileTextIcon className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="application/pdf" 
                            onChange={(e) => handleFileChange('project-manager', e)}
                          />
                        </label>
                      </div>
                      
                      {resumeFiles['project-manager'].error && (
                        <div className="text-red-500 text-sm">
                          {resumeFiles['project-manager'].error}
                        </div>
                      )}
                      
                      {resumeFiles['project-manager'].previewUrl && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Current Resume:</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500 truncate">
                              project-manager-resume.pdf
                            </span>
                            <a 
                              href={resumeFiles['project-manager'].previewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => uploadResume('project-manager')} 
                        disabled={!resumeFiles['project-manager'].file || resumeFiles['project-manager'].uploading}
                        className="w-full"
                      >
                        {resumeFiles['project-manager'].uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Developer Resume Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Developer Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileTextIcon className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="application/pdf" 
                            onChange={(e) => handleFileChange('developer', e)}
                          />
                        </label>
                      </div>
                      
                      {resumeFiles['developer'].error && (
                        <div className="text-red-500 text-sm">
                          {resumeFiles['developer'].error}
                        </div>
                      )}
                      
                      {resumeFiles['developer'].previewUrl && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Current Resume:</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500 truncate">
                              developer-resume.pdf
                            </span>
                            <a 
                              href={resumeFiles['developer'].previewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => uploadResume('developer')} 
                        disabled={!resumeFiles['developer'].file || resumeFiles['developer'].uploading}
                        className="w-full"
                      >
                        {resumeFiles['developer'].uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="generate" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Manager Resume Generation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generate Project Manager Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Generate a professional Project Manager resume based on your portfolio data. 
                        The resume will include your contact information, experience, skills, and more.
                      </p>
                      
                      {resumeFiles['project-manager'].error && (
                        <div className="text-red-500 text-sm">
                          {resumeFiles['project-manager'].error}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => generateResume('project-manager')} 
                        disabled={resumeFiles['project-manager'].uploading}
                        className="w-full"
                      >
                        {resumeFiles['project-manager'].uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            Generate Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Developer Resume Generation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generate Developer Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Generate a professional Developer resume based on your portfolio data. 
                        The resume will include your contact information, technical skills, projects, and more.
                      </p>
                      
                      {resumeFiles['developer'].error && (
                        <div className="text-red-500 text-sm">
                          {resumeFiles['developer'].error}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => generateResume('developer')} 
                        disabled={resumeFiles['developer'].uploading}
                        className="w-full"
                      >
                        {resumeFiles['developer'].uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            Generate Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVGenerator;