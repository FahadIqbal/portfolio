import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { TestimonialsData, TestimonialItem } from '../services/DataService';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import Save from 'lucide-react/dist/esm/icons/save';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import MoveUp from 'lucide-react/dist/esm/icons/move-up';
import MoveDown from 'lucide-react/dist/esm/icons/move-down';
import Image from 'lucide-react/dist/esm/icons/image';
import { v4 as uuidv4 } from 'uuid';

const TestimonialsEditor: React.FC = () => {
  const { testimonialsData, isLoading, errors, updateTestimonialsData, uploadTestimonialImage, refreshTestimonialsData } = useData();
  const [formData, setFormData] = useState<TestimonialsData | null>(null);
  const [activeTab, setActiveTab] = useState('header');
  const [activeTestimonialId, setActiveTestimonialId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (testimonialsData) {
      setFormData(testimonialsData);
      if (testimonialsData.testimonials.length > 0 && !activeTestimonialId) {
        setActiveTestimonialId(testimonialsData.testimonials[0].id);
      }
    }
  }, [testimonialsData]);

  if (isLoading.testimonials || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading testimonials data...</span>
      </div>
    );
  }

  if (errors.testimonials) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{errors.testimonials}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refreshTestimonialsData()}
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

  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: uuidv4(),
      name: 'New Testimonial',
      role: 'Position, Company',
      content: 'This is a testimonial content. The person shares their experience working with you.',
      imageUrl: '/placeholder-avatar.jpg',
      rating: 5
    };

    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        testimonials: [...prev.testimonials, newTestimonial]
      };
    });

    setActiveTestimonialId(newTestimonial.id);
    setActiveTab('testimonials');
  };

  const removeTestimonial = (id: string) => {
    setFormData(prev => {
      if (!prev) return null;
      
      const updatedTestimonials = prev.testimonials.filter(testimonial => testimonial.id !== id);
      
      // If we're removing the active testimonial, select another one
      if (activeTestimonialId === id && updatedTestimonials.length > 0) {
        setActiveTestimonialId(updatedTestimonials[0].id);
      } else if (updatedTestimonials.length === 0) {
        setActiveTestimonialId(null);
      }
      
      return {
        ...prev,
        testimonials: updatedTestimonials
      };
    });
  };

  const moveTestimonial = (id: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return null;
      
      const testimonials = [...prev.testimonials];
      const index = testimonials.findIndex(testimonial => testimonial.id === id);
      
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        // Move up
        [testimonials[index], testimonials[index - 1]] = [testimonials[index - 1], testimonials[index]];
      } else if (direction === 'down' && index < testimonials.length - 1) {
        // Move down
        [testimonials[index], testimonials[index + 1]] = [testimonials[index + 1], testimonials[index]];
      }
      
      return {
        ...prev,
        testimonials
      };
    });
  };

  const updateTestimonialField = (id: string, field: keyof TestimonialItem, value: any) => {
    setFormData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        testimonials: prev.testimonials.map(testimonial => {
          if (testimonial.id === id) {
            return { ...testimonial, [field]: value };
          }
          return testimonial;
        })
      };
    });
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      const imageUrl = await uploadTestimonialImage(id, file);
      updateTestimonialField(id, 'imageUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateTestimonialsData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving testimonials data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const activeTestimonial = formData.testimonials.find(t => t.id === activeTestimonialId);

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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
        
        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Testimonials</h2>
            <Button 
              type="button" 
              onClick={addTestimonial}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Testimonial
            </Button>
          </div>
          
          {formData.testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Testimonial list sidebar */}
              <div className="md:col-span-1 space-y-2">
                {formData.testimonials.map(testimonial => (
                  <div 
                    key={testimonial.id} 
                    className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${activeTestimonialId === testimonial.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setActiveTestimonialId(testimonial.id)}
                  >
                    <span className="font-medium truncate">{testimonial.name}</span>
                    <div className="flex space-x-1">
                      <button 
                        type="button" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveTestimonial(testimonial.id, 'up');
                        }}
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button 
                        type="button" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveTestimonial(testimonial.id, 'down');
                        }}
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button 
                        type="button" 
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTestimonial(testimonial.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Testimonial editor */}
              <div className="md:col-span-3">
                {activeTestimonial ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={activeTestimonial.name}
                              onChange={(e) => updateTestimonialField(activeTestimonial.id, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                              type="text"
                              value={activeTestimonial.role}
                              onChange={(e) => updateTestimonialField(activeTestimonial.id, 'role', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., CEO, Company Name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                              value={activeTestimonial.content}
                              onChange={(e) => updateTestimonialField(activeTestimonial.id, 'content', e.target.value)}
                              rows={4}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rating ({activeTestimonial.rating} stars)</label>
                              <span className="text-sm text-gray-500">{activeTestimonial.rating}/5</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              step="1"
                              value={activeTestimonial.rating}
                              onChange={(e) => updateTestimonialField(activeTestimonial.id, 'rating', parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 border rounded-full overflow-hidden">
                              <img 
                                src={activeTestimonial.imageUrl} 
                                alt={activeTestimonial.name} 
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
                                  onChange={(e) => handleImageUpload(activeTestimonial.id, e)}
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
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500">Select a testimonial from the list or add a new one.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">No testimonials yet. Click "Add Testimonial" to create one.</p>
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

export default TestimonialsEditor;