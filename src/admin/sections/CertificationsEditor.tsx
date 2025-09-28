import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CertificationsData, CertificationItem, EducationItem, AchievementItem } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import MoveUp from 'lucide-react/dist/esm/icons/move-up';
import MoveDown from 'lucide-react/dist/esm/icons/move-down';
import Image from 'lucide-react/dist/esm/icons/image';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Award from 'lucide-react/dist/esm/icons/award';
import Star from 'lucide-react/dist/esm/icons/star';
import { v4 as uuidv4 } from 'uuid';

const CertificationsEditor: React.FC = () => {
  const { certificationsData, isLoading, errors, updateCertificationsData, uploadCertificationImage, refreshCertificationsData } = useData();
  const [formData, setFormData] = useState<CertificationsData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [activeCertId, setActiveCertId] = useState<string | null>(null);
  const [activeEduId, setActiveEduId] = useState<string | null>(null);
  const [activeAchievementId, setActiveAchievementId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (certificationsData) {
      // Initialize education and achievements arrays if they don't exist
      const updatedData = {
        ...certificationsData,
        education: certificationsData.education || [],
        achievements: certificationsData.achievements || []
      };
      setFormData(updatedData);
      
      // Set active certification if available
      if (updatedData.certifications.length > 0 && !activeCertId) {
        setActiveCertId(updatedData.certifications[0].id);
      }
      
      // Set active education if available
      if (updatedData.education.length > 0 && !activeEduId) {
        setActiveEduId(updatedData.education[0].id);
      }
      
      // Set active achievement if available
      if (updatedData.achievements && updatedData.achievements.length > 0 && !activeAchievementId) {
        setActiveAchievementId(updatedData.achievements[0].id);
      }
    }
  }, [certificationsData]);

  if (isLoading.certifications || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading certifications data...</span>
      </div>
    );
  }

  if (errors.certifications) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.certifications}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshCertificationsData()}
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

  const addCertification = () => {
    const newCert: any = {
      id: uuidv4(),
      name: 'New Certification',
      issuer: 'Certification Issuer',
      date: 'January 2023',
      imageUrl: '/placeholder-cert.jpg',
      verificationUrl: 'https://example.com/verify'
    };

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        certifications: [...prev.certifications, newCert]
      };
    });

    setActiveCertId(newCert.id);
    setActiveTab('certifications');
  };

  const removeCertification = (id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      const updatedCerts = prev.certifications.filter(cert => cert.id !== id);
      
      // If we're removing the active certification, select another one
      if (activeCertId === id && updatedCerts.length > 0) {
        setActiveCertId(updatedCerts[0].id);
      } else if (updatedCerts.length === 0) {
        setActiveCertId(null);
      }
      
      return {
        ...prev,
        certifications: updatedCerts
      };
    });
  };
  
  const addEducation = () => {
    if (!formData) return;
    
    const newEdu: EducationItem = {
      id: uuidv4(),
      degree: 'New Degree',
      institution: 'University Name',
      year: new Date().getFullYear().toString(),
      description: 'Degree description'
    };
    
    const updatedEdu = [...(formData.education || []), newEdu];
    setFormData({
      ...formData,
      education: updatedEdu
    });
    setActiveEduId(newEdu.id);
    setActiveTab('education');
  };

  const removeEducation = (id: string) => {
    if (!formData || !formData.education) return;
    
    const updatedEdu = formData.education.filter(edu => edu.id !== id);
    setFormData({
      ...formData,
      education: updatedEdu
    });
    
    if (updatedEdu.length > 0) {
      setActiveEduId(updatedEdu[0].id);
    } else {
      setActiveEduId(null);
    }
  };

  const moveCertification = (id: string, direction: 'up' | 'down') => {
    if (!formData) return;
    
    const index = formData.certifications.findIndex(cert => cert.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(formData.certifications.length - 1, index + 1);
    if (newIndex === index) return;
    
    const updatedCerts = [...formData.certifications];
    const item = updatedCerts[index];
    updatedCerts.splice(index, 1);
    updatedCerts.splice(newIndex, 0, item);
    
    setFormData({
      ...formData,
      certifications: updatedCerts
    });
  };

  const moveEducation = (id: string, direction: 'up' | 'down') => {
    if (!formData || !formData.education) return;
    
    const index = formData.education.findIndex(edu => edu.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(formData.education.length - 1, index + 1);
    if (newIndex === index) return;
    
    const updatedEdu = [...formData.education];
    const item = updatedEdu[index];
    updatedEdu.splice(index, 1);
    updatedEdu.splice(newIndex, 0, item);
    
    setFormData({
      ...formData,
      education: updatedEdu
    });
  };

  const updateCertificationField = (id: string, field: keyof CertificationItem, value: string) => {
    if (!formData) return;
    
    const updatedCerts = formData.certifications.map(cert => {
      if (cert.id === id) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    
    setFormData({
      ...formData,
      certifications: updatedCerts
    });
  };
  
  const updateEducationField = (id: string, field: keyof EducationItem, value: string) => {
    if (!formData || !formData.education) return;
    
    const updatedEdu = formData.education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    
    setFormData({
      ...formData,
      education: updatedEdu
    });
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      const imageUrl = await uploadCertificationImage(id, file);
      updateCertificationField(id, 'imageUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const addAchievement = () => {
    if (!formData) return;
    
    const newAchievement: AchievementItem = {
      id: uuidv4(),
      text: 'New Achievement',
      icon: 'Trophy'
    };
    
    const updatedAchievements = [...(formData.achievements || []), newAchievement];
    setFormData({
      ...formData,
      achievements: updatedAchievements
    });
    setActiveAchievementId(newAchievement.id);
    setActiveTab('achievements');
  };

  const removeAchievement = (id: string) => {
    if (!formData || !formData.achievements) return;
    
    const updatedAchievements = formData.achievements.filter(achievement => achievement.id !== id);
    setFormData({
      ...formData,
      achievements: updatedAchievements
    });
    
    if (updatedAchievements.length > 0) {
      setActiveAchievementId(updatedAchievements[0].id);
    } else {
      setActiveAchievementId(null);
    }
  };

  const moveAchievement = (id: string, direction: 'up' | 'down') => {
    if (!formData || !formData.achievements) return;
    
    const index = formData.achievements.findIndex(achievement => achievement.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(formData.achievements.length - 1, index + 1);
    if (newIndex === index) return;
    
    const updatedAchievements = [...formData.achievements];
    const item = updatedAchievements[index];
    updatedAchievements.splice(index, 1);
    updatedAchievements.splice(newIndex, 0, item);
    
    setFormData({
      ...formData,
      achievements: updatedAchievements
    });
  };

  const updateAchievementField = (id: string, field: keyof AchievementItem, value: string) => {
    if (!formData || !formData.achievements) return;
    
    const updatedAchievements = formData.achievements.map(achievement => {
      if (achievement.id === id) {
        return { ...achievement, [field]: value };
      }
      return achievement;
    });
    
    setFormData({
      ...formData,
      achievements: updatedAchievements
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Ensure education and achievements arrays exist before submitting
      const dataToSubmit = {
        ...formData,
        education: formData.education || [],
        achievements: formData.achievements || []
      };
      
      await updateCertificationsData(dataToSubmit);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await refreshCertificationsData();
    } catch (error) {
      console.error('Error saving certifications data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const activeCert = formData.certifications.find(c => c.id === activeCertId);

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
        
        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Certifications</h3>
            <Button onClick={addCertification} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </div>
          
          {formData && formData.certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2">
                {formData.certifications.map((cert) => (
                  <div 
                    key={cert.id}
                    className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${cert.id === activeCertId ? 'bg-muted' : ''}`}
                    onClick={() => setActiveCertId(cert.id)}
                  >
                    <div className="truncate flex-1">{cert.name}</div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveCertification(cert.id, 'up'); }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveCertification(cert.id, 'down'); }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="md:col-span-2">
                {activeCertId && (
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      {formData.certifications.map((cert) => {
                        if (cert.id !== activeCertId) return null;
                        
                        return (
                          <div key={cert.id} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertificationField(cert.id, 'name', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Issuing Organization</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertificationField(cert.id, 'issuer', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Date</label>
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => updateCertificationField(cert.id, 'date', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="e.g., 2023 or May 2023"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Verification URL</label>
                              <input
                                type="url"
                                value={cert.verificationUrl || ''}
                                onChange={(e) => updateCertificationField(cert.id, 'verificationUrl', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="https://example.com/verify"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Image</label>
                              <div className="flex items-center gap-2">
                                {cert.imageUrl ? (
                                  <img 
                                    src={cert.imageUrl} 
                                    alt={cert.name} 
                                    className="h-12 w-12 object-contain border rounded-md"
                                  />
                                ) : (
                                  <div className="h-12 w-12 border rounded-md flex items-center justify-center bg-muted">
                                    <Image className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                
                                <label className="block w-full">
                                  <span className="sr-only">Choose certification image</span>
                                  <input 
                                    type="file" 
                                    className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-md file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-gray-100 file:text-gray-700
                                      hover:file:bg-gray-200"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(cert.id, e)}
                                    disabled={uploadingImage}
                                  />
                                </label>
                                {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md bg-muted">
              <p className="text-muted-foreground">No certifications added yet. Click the button above to add your first certification.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Education</h3>
            <Button onClick={addEducation} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>
          
          {formData && formData.education && formData.education.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2">
                {formData.education.map((edu) => (
                  <div 
                    key={edu.id}
                    className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${edu.id === activeEduId ? 'bg-muted' : ''}`}
                    onClick={() => setActiveEduId(edu.id)}
                  >
                    <div className="truncate flex-1">{edu.degree}</div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveEducation(edu.id, 'up'); }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveEducation(edu.id, 'down'); }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="md:col-span-2">
                {activeEduId && (
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      {formData.education.map((edu) => {
                        if (edu.id !== activeEduId) return null;
                        
                        return (
                          <div key={edu.id} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Degree</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationField(edu.id, 'degree', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducationField(edu.id, 'institution', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Year</label>
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => updateEducationField(edu.id, 'year', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="e.g., 2023 or 2018-2022"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={edu.description}
                                onChange={(e) => updateEducationField(edu.id, 'description', e.target.value)}
                                className="w-full p-2 border rounded-md min-h-[100px]"
                                placeholder="Describe your degree, specialization, achievements, etc."
                              />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md bg-muted">
              <p className="text-muted-foreground">No education entries added yet. Click the button above to add your first education entry.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Achievements</h3>
            <Button onClick={addAchievement} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          </div>
          
          {formData && formData.achievements && formData.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2">
                {formData.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${achievement.id === activeAchievementId ? 'bg-muted' : ''}`}
                    onClick={() => setActiveAchievementId(achievement.id)}
                  >
                    <div className="truncate flex-1">{achievement.text}</div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveAchievement(achievement.id, 'up'); }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); moveAchievement(achievement.id, 'down'); }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); removeAchievement(achievement.id); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="md:col-span-2">
                {activeAchievementId && (
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      {formData.achievements.map((achievement) => {
                        if (achievement.id !== activeAchievementId) return null;
                        
                        return (
                          <div key={achievement.id} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Achievement Text</label>
                              <input
                                type="text"
                                value={achievement.text}
                                onChange={(e) => updateAchievementField(achievement.id, 'text', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <select
                                value={achievement.icon || 'Trophy'}
                                onChange={(e) => updateAchievementField(achievement.id, 'icon', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="Trophy">Trophy</option>
                                <option value="Calendar">Calendar</option>
                                <option value="CheckCircle">Check Circle</option>
                                <option value="Award">Award</option>
                                <option value="Star">Star</option>
                              </select>
                              <div className="mt-2 flex items-center gap-2">
                                <span>Preview: </span>
                                {achievement.icon === 'Trophy' && <Trophy className="h-5 w-5" />}
                                {achievement.icon === 'Calendar' && <Calendar className="h-5 w-5" />}
                                {achievement.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5" />}
                                {achievement.icon === 'Award' && <Award className="h-5 w-5" />}
                                {achievement.icon === 'Star' && <Star className="h-5 w-5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md bg-muted">
              <p className="text-muted-foreground">No achievements added yet. Click the button above to add your first achievement.</p>
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

export default CertificationsEditor;