import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { SkillsData, SkillCategory } from '../services/DataService';
import Save from 'lucide-react/dist/esm/icons/save';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import MoveUp from 'lucide-react/dist/esm/icons/move-up';
import MoveDown from 'lucide-react/dist/esm/icons/move-down';
import { v4 as uuidv4 } from 'uuid';

const SkillsEditor: React.FC = () => {
  const { skillsData, updateSkillsData } = useData();
  const [formData, setFormData] = useState<SkillsData | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (skillsData) {
      // Ensure all categories have IDs
      const categoriesWithIds = skillsData.categories.map(category => ({
        ...category,
        id: category.id || uuidv4()
      }));
      
      setFormData({
        title: skillsData.title || 'Skills',
        subtitle: skillsData.subtitle || 'My technical expertise',
        categories: categoriesWithIds
      });
      
      // Set initial active category only if none is selected and categories exist
      if (categoriesWithIds.length > 0 && !activeCategoryId && categoriesWithIds[0]) {
        setActiveCategoryId(categoriesWithIds[0].id || null);
      }
    }
  }, [skillsData]);

  const activeCategory = formData?.categories.find(cat => cat.id === activeCategoryId);

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: SkillCategory = {
      id: uuidv4(),
      name: newCategoryName,
      skills: []
    };
    
    setFormData(prev => {
      if (!prev) return null;
      const updatedData = {
        ...prev,
        categories: [...prev.categories, newCategory]
      };
      
      // Save to context immediately
      updateSkillsData(updatedData);
      
      return updatedData;
    });
    
    setNewCategoryName('');
    setActiveCategoryId(newCategory.id || null);
  };

  const removeCategory = (categoryId: string) => {
    if (!formData) return;
    
    const updatedCategories = formData.categories.filter(cat => cat.id !== categoryId);
    const updatedData = { ...formData, categories: updatedCategories };
    setFormData(updatedData);
    updateSkillsData(updatedData);
    
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(updatedCategories.length > 0 && updatedCategories[0] ? (updatedCategories[0].id || null) : null);
    }
  };

  const updateCategory = (categoryId: string, updates: Partial<SkillCategory>) => {
    if (!formData) return;
    
    const updatedCategories = formData.categories.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    const updatedData = { ...formData, categories: updatedCategories };
    setFormData(updatedData);
    updateSkillsData(updatedData);
  };

  const addSkill = () => {
    if (!activeCategory?.id) return;
    
    const newSkill = {
      name: 'New Skill',
      level: 50
    };
    
    updateCategory(activeCategory.id, {
      skills: [...activeCategory.skills, newSkill]
    });
  };

  const updateSkill = (categoryId: string, skillIndex: number, field: string, value: string | number) => {
    if (!formData) return;
    
    const updatedCategories = formData.categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedSkills = cat.skills.map((skill, index) => 
          index === skillIndex ? { ...skill, [field]: value } : skill
        );
        return { ...cat, skills: updatedSkills };
      }
      return cat;
    });
    
    const updatedData = { ...formData, categories: updatedCategories };
    setFormData(updatedData);
    updateSkillsData(updatedData);
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    if (!formData) return;
    
    const updatedCategories = formData.categories.map(cat => {
      if (cat.id === categoryId) {
        const updatedSkills = cat.skills.filter((_, index) => index !== skillIndex);
        return { ...cat, skills: updatedSkills };
      }
      return cat;
    });
    
    const updatedData = { ...formData, categories: updatedCategories };
    setFormData(updatedData);
    updateSkillsData(updatedData);
  };

  const moveSkill = (categoryId: string, skillIndex: number, direction: 'up' | 'down') => {
    if (!formData) return;
    
    const updatedCategories = formData.categories.map(cat => {
      if (cat.id === categoryId) {
        const skills = [...cat.skills];
        const newIndex = direction === 'up' ? skillIndex - 1 : skillIndex + 1;
        
        if (newIndex >= 0 && newIndex < skills.length && skills[skillIndex] && skills[newIndex]) {
           [skills[skillIndex], skills[newIndex]] = [skills[newIndex], skills[skillIndex]];
         }
        
        return { ...cat, skills };
      }
      return cat;
    });
    
    const updatedData = { ...formData, categories: updatedCategories };
    setFormData(updatedData);
    updateSkillsData(updatedData);
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    try {
      await updateSkillsData(formData);
      setSaveMessage('Skills saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving skills');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills Editor</h2>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className={`text-sm ${
              saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
            }`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category list sidebar */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCategory();
                }
              }}
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {formData.categories.map((category, categoryIndex) => (
            <div
              key={category.id || `category-${categoryIndex}`}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                activeCategoryId === category.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveCategoryId(category.id!)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.skills.length} skills
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(category.id!);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Category details */}
        <div className="md:col-span-2">
          {activeCategory ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  value={activeCategory.name}
                  onChange={(e) => updateCategory(activeCategory.id!, { name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Skills</label>
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {activeCategory.skills.map((skill: any, skillIndex: number) => (
                    <div key={`${activeCategory.id}-skill-${skillIndex}`} className="border border-gray-200 rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={skill.name || ''}
                            onChange={(e) => activeCategory?.id && updateSkill(activeCategory.id, skillIndex, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button" 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => activeCategory?.id && moveSkill(activeCategory.id, skillIndex, 'up')}
                          >
                          <MoveUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button" 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => activeCategory?.id && moveSkill(activeCategory.id, skillIndex, 'down')}
                          >
                          <MoveDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => activeCategory?.id && removeSkill(activeCategory.id, skillIndex)}
                          >
                          <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Level: {skill.level}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level || 0}
                          onChange={(e) => activeCategory?.id && updateSkill(activeCategory.id, skillIndex, 'level', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      
                      {skill.technologies && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Technologies</label>
                          <div className="flex flex-wrap gap-1">
                            {skill.technologies.map((tech: string, techIndex: number) => (
                              <span key={`${tech}-${techIndex}`} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a category to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsEditor;