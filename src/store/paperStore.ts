import { create } from 'zustand';
import { Paper, CreatePaperForm, UpdatePaperForm, FormData, FormStep } from '@/types';

interface EditorState {
  content: string;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
}

interface FormState {
  currentStep: number;
  steps: FormStep[];
  data: Partial<FormData>;
}

interface WorkflowState {
  currentMode: 'form' | 'modular' | 'ai-writing' | null;
  previousMode: 'form' | 'modular' | 'ai-writing' | null;
  entryPoint: 'create' | 'form-basic' | 'direct' | null;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
}

interface PaperState {
  papers: Paper[];
  currentPaper: Paper | null;
  loading: boolean;
  error: string | null;
  editorState: EditorState;
  formData: Partial<FormData>;
  formState: FormState;
  workflowState: WorkflowState;
}

interface PaperActions {
  fetchPapers: () => Promise<void>;
  fetchPaper: (id: string) => Promise<void>;
  createPaper: (data: CreatePaperForm) => Promise<Paper>;
  updatePaper: (id: string, data: UpdatePaperForm) => Promise<void>;
  deletePaper: (id: string) => Promise<void>;
  setCurrentPaper: (paper: Paper | null) => void;
  setEditorContent: (content: string) => void;
  setFormData: (data: Partial<FormData>) => void;
  setFormStep: (step: number) => void;
  resetForm: () => void;
  createPaperFromForm: (formData: FormData) => Promise<Paper>;
  clearError: () => void;
  setWorkflowMode: (mode: 'form' | 'modular' | 'ai-writing', entryPoint?: 'create' | 'form-basic' | 'direct') => void;
  navigateBack: () => string | null;
  navigateForward: () => string | null;
}

type PaperStore = PaperState & PaperActions;

export const usePaperStore = create<PaperStore>((set, get) => ({
  papers: [],
  currentPaper: null,
  loading: false,
  error: null,
  editorState: {
    content: '',
    isAutoSaving: false,
    lastSaved: null,
    isDirty: false
  },
  formData: {},
  formState: {
    currentStep: 0,
    steps: [
      { id: 0, title: '基本信息', description: '填写论文基本信息', component: 'basic', isCompleted: false, isActive: true },
      { id: 1, title: '内容结构', description: '设置论文结构', component: 'content', isCompleted: false, isActive: false },
      { id: 2, title: '参考文献', description: '管理参考文献', component: 'references', isCompleted: false, isActive: false },
      { id: 3, title: '生成论文', description: '生成最终论文', component: 'generate', isCompleted: false, isActive: false }
    ],
    data: {}
  },
  workflowState: {
    currentMode: null,
    previousMode: null,
    entryPoint: null,
    canNavigateBack: false,
    canNavigateForward: false
  },

  fetchPapers: async () => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPapers: Paper[] = [
        {
          id: '1',
          title: 'AI in Medical Diagnosis: A Comprehensive Review',
          content: 'This paper explores the current state and future prospects...',
          abstract: 'Abstract content here...',
          keywords: ['AI', 'medical', 'diagnosis'],
          status: 'draft',
          authorId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
          wordCount: 2431,
          sections: [],
        },
        // Add more mock papers...
      ];
      set({ papers: mockPapers, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch papers', loading: false });
    }
  },

  fetchPaper: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const paper = get().papers.find(p => p.id === id);
      set({ currentPaper: paper || null, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch paper', loading: false });
    }
  },

  createPaper: async (data: CreatePaperForm) => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPaper: Paper = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        type: data.type || 'research',
        template: data.template,
        content: '',
        keywords: [],
        status: 'draft',
        authorId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 0,
        sections: [],
        isFavorite: false,
        isShared: false,
      };
      set(state => ({ 
        papers: [...state.papers, newPaper], 
        loading: false 
      }));
      return newPaper;
    } catch (error) {
      set({ error: 'Failed to create paper', loading: false });
      throw error;
    }
  },

  updatePaper: async (id: string, data: UpdatePaperForm) => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        papers: state.papers.map(paper =>
          paper.id === id 
            ? { 
                ...paper, 
                ...data, 
                updatedAt: new Date(),
                wordCount: data.content ? data.content.split(' ').length : paper.wordCount
              }
            : paper
        ),
        currentPaper: state.currentPaper?.id === id 
          ? { 
              ...state.currentPaper, 
              ...data, 
              updatedAt: new Date(),
              wordCount: data.content ? data.content.split(' ').length : state.currentPaper.wordCount
            }
          : state.currentPaper,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update paper', loading: false });
    }
  },

  deletePaper: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        papers: state.papers.filter(paper => paper.id !== id),
        currentPaper: state.currentPaper?.id === id ? null : state.currentPaper,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete paper', loading: false });
    }
  },

  setCurrentPaper: (paper: Paper | null) => {
    set({ 
      currentPaper: paper,
      editorState: {
        content: paper?.content || '',
        isAutoSaving: false,
        lastSaved: paper?.updatedAt || null,
        isDirty: false
      }
    });
  },

  setEditorContent: (content: string) => {
    set(state => ({
      editorState: {
        ...state.editorState,
        content,
        isDirty: content !== (state.currentPaper?.content || '')
      }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setFormData: (data: Partial<FormData>) => {
    set(state => ({
      formData: { ...state.formData, ...data },
      formState: {
        ...state.formState,
        data: { ...state.formState.data, ...data }
      }
    }));
  },

  setFormStep: (step: number) => {
    set(state => ({
      formState: {
        ...state.formState,
        currentStep: step,
        steps: state.formState.steps.map((s, index) => ({
          ...s,
          isActive: index === step,
          isCompleted: index < step
        }))
      }
    }));
  },

  resetForm: () => {
    set(state => ({
      formData: {},
      formState: {
        ...state.formState,
        currentStep: 0,
        data: {},
        steps: state.formState.steps.map((s, index) => ({
          ...s,
          isActive: index === 0,
          isCompleted: false
        }))
      }
    }));
  },

  createPaperFromForm: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPaper: Paper = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled Paper',
        content: `# ${formData.title || 'Untitled Paper'}\n\n## Abstract\n\n${formData.abstract || 'Abstract to be written...'}\n\n## Introduction\n\nIntroduction content based on requirements: ${formData.requirements}\n\n## Literature Review\n\nLiterature review content...\n\n## Methodology\n\nMethodology content...\n\n## Results\n\nResults content...\n\n## Discussion\n\nDiscussion content...\n\n## Conclusion\n\nConclusion content...\n\n## References\n\nReferences will be added here...`,
        abstract: formData.abstract || '',
        keywords: formData.keywords || [],
        status: 'draft',
        authorId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: [
          { id: '1', title: 'Abstract', content: formData.abstract || '', order: 1, level: 1 },
          { id: '2', title: 'Introduction', content: '', order: 2, level: 1 },
          { id: '3', title: 'Literature Review', content: '', order: 3, level: 1 },
          { id: '4', title: 'Methodology', content: '', order: 4, level: 1 },
          { id: '5', title: 'Results', content: '', order: 5, level: 1 },
          { id: '6', title: 'Discussion', content: '', order: 6, level: 1 },
          { id: '7', title: 'Conclusion', content: '', order: 7, level: 1 },
          { id: '8', title: 'References', content: '', order: 8, level: 1 }
        ],
        paperType: formData.paperType,
        field: formData.field,
        requirements: formData.requirements,
        wordCount: formData.wordCount || 0,
        format: formData.format,
        specialRequirements: formData.specialRequirements,
        outlinePreference: formData.outlinePreference,
        detailLevel: formData.detailLevel,
        citationStyle: formData.citationStyle
      };
      
      set(state => ({ 
        papers: [...state.papers, newPaper], 
        loading: false,
        formData: {} // Reset form data after successful creation
      }));
      
      return newPaper;
    } catch (error) {
      set({ error: 'Failed to create paper from form', loading: false });
      throw error;
    }
  },

  setWorkflowMode: (mode: 'form' | 'modular' | 'ai-writing', entryPoint?: 'create' | 'form-basic' | 'direct') => {
    set(state => ({
      workflowState: {
        ...state.workflowState,
        previousMode: state.workflowState.currentMode,
        currentMode: mode,
        entryPoint: entryPoint || state.workflowState.entryPoint,
        canNavigateBack: true,
        canNavigateForward: mode !== 'ai-writing'
      }
    }));
  },

  navigateBack: () => {
    const state = get();
    const { workflowState, currentPaper } = state;
    
    if (!workflowState.canNavigateBack) return null;
    
    switch (workflowState.currentMode) {
      case 'modular':
        if (workflowState.entryPoint === 'form-basic') {
          return '/form';
        } else if (workflowState.entryPoint === 'create') {
          return '/create';
        }
        return '/';
      case 'ai-writing':
        if (currentPaper) {
          return `/modular-editor/${currentPaper.id}`;
        }
        return '/form';
      case 'form':
        return '/create';
      default:
        return '/';
    }
  },

  navigateForward: () => {
    const state = get();
    const { workflowState, currentPaper } = state;
    
    if (!workflowState.canNavigateForward) return null;
    
    switch (workflowState.currentMode) {
      case 'form':
        if (currentPaper) {
          return `/ai-writing/${currentPaper.id}`;
        }
        return null;
      case 'modular':
        if (currentPaper) {
          return `/ai-writing/${currentPaper.id}`;
        }
        return null;
      default:
        return null;
    }
  },
}));