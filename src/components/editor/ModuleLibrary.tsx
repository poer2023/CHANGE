import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Brain, 
  Zap,
  Plus,
  ChevronDown,
  ChevronRight,
  Tag,
  TrendingUp,
  Heart,
  Download
} from 'lucide-react';

import { useSmartModule } from '../../contexts/SmartModuleContext';
import { SmartTemplateCategory, ModuleTemplate, UserPreferences } from '../../types/modular';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface ModuleLibraryProps {
  onModuleAdd: (type: string, template?: ModuleTemplate) => void;
  searchQuery?: string;
  className?: string;
}

const ModuleLibrary: React.FC<ModuleLibraryProps> = ({
  onModuleAdd,
  searchQuery: externalSearchQuery = '',
  className = ''
}) => {
  const { modules } = useSmartModule();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'recent' | 'alphabetical'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['popular']));
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Mock template library data (in real app, this would come from API/store)
  const templateLibrary: SmartTemplateCategory[] = useMemo(() => [
    {
      id: 'academic',
      name: 'Academic Papers',
      description: 'Templates for academic research papers',
      icon: 'BookOpen',
      color: '#3B82F6',
      aiGenerated: false,
      usageCount: 1250,
      averageRating: 4.8,
      difficulty: 'advanced',
      estimatedTime: 45,
      prerequisites: ['Research methodology basics'],
      learningOutcomes: ['Structure academic arguments', 'Cite sources properly', 'Write clear abstracts'],
      modules: [
        {
          id: 'abstract-academic',
          name: 'Academic Abstract',
          description: 'Structured abstract for research papers with background, methods, results, and conclusions',
          structure: [
            { id: '1', title: 'Background', description: 'Research context and problem statement', isRequired: true, order: 1 },
            { id: '2', title: 'Methods', description: 'Research methodology and approach', isRequired: true, order: 2 },
            { id: '3', title: 'Results', description: 'Key findings and outcomes', isRequired: true, order: 3 },
            { id: '4', title: 'Conclusions', description: 'Implications and significance', isRequired: true, order: 4 }
          ],
          prompts: [
            'What is the main research problem you are addressing?',
            'What methodology did you use to investigate this problem?',
            'What are your key findings?',
            'What are the implications of your research?'
          ],
          guidelines: [
            'Keep abstract between 150-300 words',
            'Use past tense for completed work',
            'Avoid jargon and abbreviations',
            'Include quantitative results when possible'
          ],
          wordCountTarget: { min: 150, max: 300 }
        },
        {
          id: 'introduction-academic',
          name: 'Academic Introduction',
          description: 'Comprehensive introduction with literature review and research questions',
          structure: [
            { id: '1', title: 'Topic Introduction', description: 'Introduce the research topic', isRequired: true, order: 1 },
            { id: '2', title: 'Literature Review', description: 'Review relevant previous work', isRequired: true, order: 2 },
            { id: '3', title: 'Research Gap', description: 'Identify gaps in current knowledge', isRequired: true, order: 3 },
            { id: '4', title: 'Research Questions', description: 'State research questions/hypotheses', isRequired: true, order: 4 }
          ],
          prompts: [
            'Why is this research topic important?',
            'What have previous researchers found about this topic?',
            'What gaps exist in the current research?',
            'What specific questions does your research address?'
          ],
          guidelines: [
            'Start broad and narrow down to specific research questions',
            'Cite relevant literature throughout',
            'Clearly state your contribution',
            'Use clear transitions between sections'
          ],
          wordCountTarget: { min: 800, max: 1200 }
        }
      ]
    },
    {
      id: 'business',
      name: 'Business Documents',
      description: 'Professional business document templates',
      icon: 'Users',
      color: '#10B981',
      aiGenerated: false,
      usageCount: 890,
      averageRating: 4.6,
      difficulty: 'intermediate',
      estimatedTime: 30,
      prerequisites: ['Business writing basics'],
      learningOutcomes: ['Write professional proposals', 'Create executive summaries', 'Develop business cases'],
      modules: [
        {
          id: 'executive-summary',
          name: 'Executive Summary',
          description: 'Concise overview of business proposals and reports',
          structure: [
            { id: '1', title: 'Overview', description: 'Brief project or proposal overview', isRequired: true, order: 1 },
            { id: '2', title: 'Problem Statement', description: 'Business problem or opportunity', isRequired: true, order: 2 },
            { id: '3', title: 'Solution', description: 'Proposed solution or approach', isRequired: true, order: 3 },
            { id: '4', title: 'Benefits', description: 'Expected outcomes and benefits', isRequired: true, order: 4 }
          ],
          prompts: [
            'What is the main purpose of this document?',
            'What business problem are you solving?',
            'What is your proposed solution?',
            'What benefits will this deliver?'
          ],
          guidelines: [
            'Keep it concise and focused',
            'Use bullet points for key information',
            'Include quantifiable benefits where possible',
            'Write for executive-level audience'
          ],
          wordCountTarget: { min: 200, max: 500 }
        }
      ]
    },
    {
      id: 'creative',
      name: 'Creative Writing',
      description: 'Templates for creative and narrative writing',
      icon: 'Brain',
      color: '#8B5CF6',
      aiGenerated: true,
      usageCount: 650,
      averageRating: 4.7,
      difficulty: 'beginner',
      estimatedTime: 25,
      prerequisites: [],
      learningOutcomes: ['Develop characters', 'Structure narratives', 'Create engaging content'],
      modules: [
        {
          id: 'story-outline',
          name: 'Story Outline',
          description: 'Three-act structure for narrative writing',
          structure: [
            { id: '1', title: 'Setup', description: 'Introduce characters and setting', isRequired: true, order: 1 },
            { id: '2', title: 'Conflict', description: 'Present main conflict or challenge', isRequired: true, order: 2 },
            { id: '3', title: 'Resolution', description: 'Resolve conflict and conclude', isRequired: true, order: 3 }
          ],
          prompts: [
            'Who are your main characters?',
            'What is the central conflict?',
            'How is the conflict resolved?'
          ],
          guidelines: [
            'Establish clear character motivations',
            'Create meaningful conflict',
            'Ensure satisfying resolution',
            'Maintain consistent tone'
          ],
          wordCountTarget: { min: 500, max: 1000 }
        }
      ]
    }
  ], []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templateLibrary;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        modules: category.modules.filter(module =>
          module.name.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query) ||
          module.prompts.some(prompt => prompt.toLowerCase().includes(query))
        )
      })).filter(category => category.modules.length > 0);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(category => category.id === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(category => category.difficulty === selectedDifficulty);
    }

    // Sort categories
    const sortedFiltered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'recent':
          return a.name.localeCompare(b.name); // Mock recent sort
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sortedFiltered;
  }, [templateLibrary, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Get popular/recommended templates
  const popularTemplates = useMemo(() => {
    return templateLibrary
      .flatMap(category => 
        category.modules.map(module => ({ ...module, category: category.name, categoryColor: category.color }))
      )
      .sort((a, b) => (b.wordCountTarget?.max || 0) - (a.wordCountTarget?.max || 0))
      .slice(0, 6);
  }, [templateLibrary]);

  // Recently used templates (mock data)
  const recentTemplates = useMemo(() => {
    return templateLibrary
      .flatMap(category => 
        category.modules.map(module => ({ ...module, category: category.name, categoryColor: category.color }))
      )
      .slice(0, 4);
  }, [templateLibrary]);

  // Handle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Handle favorite toggle
  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  }, []);

  // Handle template usage
  const handleUseTemplate = useCallback(async (template: ModuleTemplate, categoryType: string) => {
    setIsLoading(true);
    try {
      await onModuleAdd(categoryType, template);
      
      // Update usage count in real app
      console.log(`Using template: ${template.name}`);
    } catch (error) {
      console.error('Failed to add module from template:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onModuleAdd]);

  // Sync external search query
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  return (
    <div className={`module-library ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Module Library
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Custom
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="all">All Categories</option>
              {templateLibrary.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Recently Added</option>
              <option value="alphabetical">Alphabetical</option>
            </select>

            <div className="flex rounded border">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Sections */}
        {!searchQuery && (
          <div className="space-y-4">
            {/* Popular Templates */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory('popular')}
              >
                <div className="flex items-center space-x-2">
                  {expandedCategories.has('popular') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <h3 className="font-medium">Popular Templates</h3>
                </div>
                <span className="text-sm text-gray-500">{popularTemplates.length}</span>
              </div>

              {expandedCategories.has('popular') && (
                <div className="mt-3 space-y-2">
                  {popularTemplates.slice(0, 3).map((template) => (
                    <TemplateQuickCard
                      key={template.id}
                      template={template}
                      onUse={() => handleUseTemplate(template, 'popular')}
                      onToggleFavorite={() => toggleFavorite(template.id)}
                      isFavorite={favorites.has(template.id)}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recently Used */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory('recent')}
              >
                <div className="flex items-center space-x-2">
                  {expandedCategories.has('recent') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h3 className="font-medium">Recently Used</h3>
                </div>
                <span className="text-sm text-gray-500">{recentTemplates.length}</span>
              </div>

              {expandedCategories.has('recent') && (
                <div className="mt-3 space-y-2">
                  {recentTemplates.map((template) => (
                    <TemplateQuickCard
                      key={template.id}
                      template={template}
                      onUse={() => handleUseTemplate(template, 'recent')}
                      onToggleFavorite={() => toggleFavorite(template.id)}
                      isFavorite={favorites.has(template.id)}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            {favorites.size > 0 && (
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory('favorites')}
                >
                  <div className="flex items-center space-x-2">
                    {expandedCategories.has('favorites') ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Heart className="w-4 h-4 text-red-500" />
                    <h3 className="font-medium">Favorites</h3>
                  </div>
                  <span className="text-sm text-gray-500">{favorites.size}</span>
                </div>

                {expandedCategories.has('favorites') && (
                  <div className="mt-3 space-y-2">
                    {/* Favorites would be filtered here */}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Template Categories */}
        <div className="space-y-4">
          {filteredTemplates.map((category) => (
            <div key={category.id}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-2">
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-medium">{category.name}</h3>
                  {category.aiGenerated && (
                    <Brain className="w-3 h-3 text-purple-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {category.modules.length}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs ml-1">{category.averageRating}</span>
                  </div>
                </div>
              </div>

              {expandedCategories.has(category.id) && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>

                  <div className={`space-y-3 ${
                    viewMode === 'grid' ? 'grid grid-cols-1 gap-3 space-y-0' : ''
                  }`}>
                    {category.modules.map((template) => (
                      viewMode === 'grid' ? (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          category={category}
                          onUse={() => handleUseTemplate(template, category.id)}
                          onToggleFavorite={() => toggleFavorite(template.id)}
                          isFavorite={favorites.has(template.id)}
                          isLoading={isLoading}
                        />
                      ) : (
                        <TemplateListItem
                          key={template.id}
                          template={template}
                          category={category}
                          onUse={() => handleUseTemplate(template, category.id)}
                          onToggleFavorite={() => toggleFavorite(template.id)}
                          isFavorite={favorites.has(template.id)}
                          isLoading={isLoading}
                        />
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: ModuleTemplate & { category?: string; categoryColor?: string };
  category: SmartTemplateCategory;
  onUse: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isLoading: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  category,
  onUse,
  onToggleFavorite,
  isFavorite,
  isLoading
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {template.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {template.description}
          </p>
        </div>
        
        <button
          onClick={onToggleFavorite}
          className={`ml-2 p-1 rounded ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            category.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {category.difficulty}
          </span>
          
          <div className="flex items-center text-gray-500 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {category.estimatedTime}m
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-xs">
          <Download className="w-3 h-3 mr-1" />
          {category.usageCount}
        </div>
      </div>

      {template.wordCountTarget && (
        <div className="text-xs text-gray-500 mb-3">
          Target: {template.wordCountTarget.min}-{template.wordCountTarget.max} words
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {template.structure.length} sections
        </div>
        
        <Button 
          size="sm" 
          onClick={onUse}
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <Plus className="w-3 h-3 mr-1" />
              Use Template
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

// Template List Item Component
interface TemplateListItemProps {
  template: ModuleTemplate & { category?: string; categoryColor?: string };
  category: SmartTemplateCategory;
  onUse: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isLoading: boolean;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({
  template,
  category,
  onUse,
  onToggleFavorite,
  isFavorite,
  isLoading
}) => {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {template.name}
            </h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              category.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {category.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {template.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleFavorite}
            className={`p-1 rounded ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <Button 
            size="sm" 
            onClick={onUse}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Use'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Template Quick Card Component (for sections like Popular, Recent)
interface TemplateQuickCardProps {
  template: ModuleTemplate & { category?: string; categoryColor?: string };
  onUse: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isLoading: boolean;
}

const TemplateQuickCard: React.FC<TemplateQuickCardProps> = ({
  template,
  onUse,
  onToggleFavorite,
  isFavorite,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex items-center space-x-2">
        {template.categoryColor && (
          <div 
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: template.categoryColor }}
          />
        )}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {template.name}
          </h4>
          <p className="text-xs text-gray-500">
            {template.category} • {template.structure.length} sections
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={onToggleFavorite}
          className={`p-1 rounded ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={onUse}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="small" /> : <Plus className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );
};

export default ModuleLibrary;