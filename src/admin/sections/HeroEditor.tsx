import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { HeroData } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Image from 'lucide-react/dist/esm/icons/image';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';
import RotateCw from 'lucide-react/dist/esm/icons/rotate-cw';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';

const HeroEditor: React.FC = () => {
  const { heroData, isLoading, errors, updateHeroData, refreshHeroData } = useData();
  const [formData, setFormData] = useState<HeroData | null>(null);
  const [activeTab, setActiveTab] = useState('pm');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Image adjustment state
  const [imageScale, setImageScale] = useState(() => {
    const savedScale = localStorage.getItem('heroImageScale');
    return savedScale ? parseFloat(savedScale) : 1;
  });
  const [imagePosition, setImagePosition] = useState(() => {
    const savedPosition = localStorage.getItem('heroImagePosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });
  const [showImageControls, setShowImageControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Image adjustment handlers
  const handleZoomIn = useCallback(() => {
    setImageScale((prev: number) => Math.min(prev + 0.1, 2));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setImageScale((prev: number) => Math.max(prev - 0.1, 0.5));
  }, []);
  
  const handleMoveHorizontal = useCallback((direction: 'left' | 'right') => {
    setImagePosition((prev: { x: number; y: number }) => ({
      ...prev,
      x: prev.x + (direction === 'left' ? -10 : 10)
    }));
  }, []);
  
  const handleMoveVertical = useCallback((direction: 'up' | 'down') => {
    setImagePosition((prev: { x: number; y: number }) => ({
      ...prev,
      y: prev.y + (direction === 'up' ? -10 : 10)
    }));
  }, []);
  
  const resetImageAdjustments = useCallback(() => {
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    localStorage.removeItem('heroImageScale');
    localStorage.removeItem('heroImagePosition');
  }, []);
  
  // Image dragging handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Limit the dragging boundaries
    const maxDragDistance = 150; // Maximum pixels the image can be dragged from center
    
    setImagePosition((prev: { x: number; y: number }) => ({
      x: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.x + deltaX)),
      y: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.y + deltaY))
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (heroData) {
      setFormData(heroData);
    }
  }, [heroData]);
  
  // Save image adjustments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('heroImageScale', imageScale.toString());
    localStorage.setItem('heroImagePosition', JSON.stringify(imagePosition));
  }, [imageScale, imagePosition]);
  
  // Add keyboard shortcuts for image adjustments
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only apply shortcuts when image controls are visible
      if (!showImageControls) return;
      
      switch(e.key) {
        case '+': // Zoom in
          handleZoomIn();
          break;
        case '-': // Zoom out
          handleZoomOut();
          break;
        case 'ArrowLeft': // Move left
          handleMoveHorizontal('left');
          break;
        case 'ArrowRight': // Move right
          handleMoveHorizontal('right');
          break;
        case 'ArrowUp': // Move up
          handleMoveVertical('up');
          break;
        case 'ArrowDown': // Move down
          handleMoveVertical('down');
          break;
        case 'r': // Reset
          resetImageAdjustments();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageControls, handleZoomIn, handleZoomOut, handleMoveHorizontal, handleMoveVertical, resetImageAdjustments]);
  
  // Add global mouse and touch handlers to ensure dragging works even when cursor/finger moves outside the container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        // Limit the dragging boundaries
        const maxDragDistance = 150; // Maximum pixels the image can be dragged from center
        
        setImagePosition((prev: { x: number; y: number }) => ({
          x: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.x + deltaX)),
          y: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.y + deltaY))
        }));
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && dragStart && e.touches[0]) {
        const deltaX = e.touches[0].clientX - dragStart.x;
        const deltaY = e.touches[0].clientY - dragStart.y;
        
        // Limit the dragging boundaries
        const maxDragDistance = 150; // Maximum pixels the image can be dragged from center
        
        setImagePosition((prev: { x: number; y: number }) => ({
          x: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.x + deltaX)),
          y: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.y + deltaY))
        }));
        
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd);
      window.addEventListener('touchcancel', handleGlobalTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchcancel', handleGlobalTouchEnd);
    };
  }, [isDragging, dragStart]);

  if (isLoading.hero || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading hero data...</span>
      </div>
    );
  }

  if (errors.hero) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.hero}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshHeroData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleInputChange = (track: 'pm' | 'dev', field: 'title' | 'subtitle' | 'description', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [track]: {
          ...prev[track],
          [field]: value
        }
      };
    });
  };

  const handleSocialLinkChange = (field: 'linkedin' | 'github' | 'email', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      };
    });
  };

  const handleCertificationChange = (track: 'pm' | 'dev', index: number, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const newCertifications = [...prev.certifications[track]];
      newCertifications[index] = value;
      return {
        ...prev,
        certifications: {
          ...prev.certifications,
          [track]: newCertifications
        }
      };
    });
  };

  const addCertification = (track: 'pm' | 'dev') => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        certifications: {
          ...prev.certifications,
          [track]: [...prev.certifications[track], '']
        }
      };
    });
  };

  const removeCertification = (track: 'pm' | 'dev', index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const newCertifications = [...prev.certifications[track]];
      newCertifications.splice(index, 1);
      return {
        ...prev,
        certifications: {
          ...prev.certifications,
          [track]: newCertifications
        }
      };
    });
  };

  // Image adjustment and dragging handlers are defined at the top of the component

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    setProfileImageFile(file);
    
    // Preview the image locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profileImageUrl: reader.result as string
        };
      });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Add image adjustments to the data before saving
      const dataWithAdjustments = {
        ...formData,
        imageAdjustments: {
          scale: imageScale,
          position: imagePosition
        }
      };
      
      await updateHeroData(dataWithAdjustments, profileImageFile || undefined);
      setProfileImageFile(null); // Reset the file after upload
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving hero data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pm">Project Manager Track</TabsTrigger>
          <TabsTrigger value="dev">Developer Track</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="profile">Profile Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pm" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.pm.title}
                    onChange={(e) => handleInputChange('pm', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.pm.subtitle}
                    onChange={(e) => handleInputChange('pm', 'subtitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.pm.description}
                    onChange={(e) => handleInputChange('pm', 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Certifications</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addCertification('pm')}
                    >
                      Add Certification
                    </Button>
                  </div>
                  
                  {formData.certifications.pm.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertificationChange('pm', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeCertification('pm', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dev" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.dev.title}
                    onChange={(e) => handleInputChange('dev', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.dev.subtitle}
                    onChange={(e) => handleInputChange('dev', 'subtitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.dev.description}
                    onChange={(e) => handleInputChange('dev', 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Certifications</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addCertification('dev')}
                    >
                      Add Certification
                    </Button>
                  </div>
                  
                  {formData.certifications.dev.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertificationChange('dev', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeCertification('dev', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.socialLinks.email}
                    onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="mt-1 flex flex-col">
                    {formData.profileImageUrl ? (
                      <div 
                        className="relative w-64 h-64 rounded-md overflow-hidden border border-gray-300 mb-4"
                        onMouseEnter={() => setShowImageControls(true)}
                        onMouseLeave={() => setShowImageControls(false)}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          if (e.touches[0]) {
                            setIsDragging(true);
                            setDragStart({ 
                              x: e.touches[0].clientX, 
                              y: e.touches[0].clientY 
                            });
                          }
                        }}
                        onTouchMove={(e) => {
                          if (!isDragging || !dragStart || !e.touches[0]) return;
                          e.preventDefault();
                          
                          const deltaX = e.touches[0].clientX - dragStart.x;
                          const deltaY = e.touches[0].clientY - dragStart.y;
                          
                          // Limit the dragging boundaries
                          const maxDragDistance = 150;
                          
                          setImagePosition((prev: { x: number; y: number }) => ({
                            x: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.x + deltaX)),
                            y: Math.max(-maxDragDistance, Math.min(maxDragDistance, prev.y + deltaY))
                          }));
                          
                          setDragStart({ 
                            x: e.touches[0].clientX, 
                            y: e.touches[0].clientY 
                          });
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                      >
                        {/* Image adjustment tooltip */}
                        {showImageControls && (
                          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2 text-center z-10">
                            Drag or touch image to position • Use controls to adjust zoom and position
                          </div>
                        )}
                        
                        {/* Profile Image with dynamic styling for scaling and positioning */}
                        <img
                          src={formData.profileImageUrl}
                          alt="Profile"
                          className={`absolute w-full h-full object-contain transition-transform duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                          style={{
                            transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                          }}
                          draggable="false"
                        />
                        
                        {/* Image adjustment controls */}
                        {showImageControls && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 flex flex-col gap-2 z-10">
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={handleZoomOut}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Zoom Out (-)">
                                  <Minus className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={handleZoomIn}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Zoom In (+)">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleMoveHorizontal('left')}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Move Left (←)">
                                  <ArrowLeft className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleMoveVertical('up')}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Move Up (↑)">
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleMoveVertical('down')}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Move Down (↓)">
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleMoveHorizontal('right')}
                                  className="p-1 rounded hover:bg-gray-700"
                                  title="Move Right (→)">
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </div>
                              <button 
                                onClick={resetImageAdjustments}
                                className="p-1 rounded hover:bg-gray-700"
                                title="Reset (R)">
                                <RotateCw className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-xs flex justify-between">
                              <span>Zoom: {(imageScale * 100).toFixed(0)}%</span>
                              <span>Position: X:{imagePosition.x.toFixed(0)} Y:{imagePosition.y.toFixed(0)}</span>
                            </div>
                            <div className="text-xs mt-1 pt-1 border-t border-gray-600">
                              <ul className="space-y-1">
                                <li>• <strong>Drag:</strong> Click and drag image directly</li>
                                <li>• <strong>Zoom:</strong> Use +/- buttons or keyboard shortcuts</li>
                                <li>• <strong>Fine adjust:</strong> Arrow buttons move image precisely</li>
                                <li>• <strong>Reset:</strong> Circular arrow button resets all adjustments</li>
                                <li>• <strong>Keyboard:</strong> +/- to zoom, arrows to move, R to reset</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-64 h-64 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center mb-4">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="relative"
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>Change Image</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                      <h4 className="font-medium mb-1">Image Adjustment Tips:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><span className="font-medium">Drag:</span> Click and drag the image directly to position it</li>
                        <li><span className="font-medium">Touch Support:</span> On mobile devices, touch and drag to position the image</li>
                        <li><span className="font-medium">Zoom:</span> Use the + and - buttons to adjust zoom level</li>
                        <li><span className="font-medium">Fine Adjustments:</span> Use arrow buttons for precise positioning</li>
                        <li><span className="font-medium">Reset:</span> Click the reset button to start over</li>
                        <li><span className="font-medium">Save:</span> Your adjustments will be saved when you save changes</li>
                      </ul>
                      <p className="mt-2 text-xs">Keyboard shortcuts: Arrow keys to move, + / - to zoom, R to reset</p>
                    </div>
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
              <CheckCircle className="mr-2 h-4 w-4" />
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

export default HeroEditor;