import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, TrainingModule, TrainingProgress } from '../services/api';

// Frontend Training interface that combines module and progress data
export interface FrontendTrainingModule {
  id: number;
  name: string;
  description: string;
  duration: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  rating: number;
  enrolledUsers: number;
  icon: string;
  tags: string[];
  estimatedCompletion: string;
  contentUrl?: string;
  dueDate?: string;
  startedAt?: string;
  completedAt?: string;
}

interface TrainingState {
  modules: FrontendTrainingModule[];
  trainingModules: TrainingModule[];
  trainingProgress: TrainingProgress[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string[];
    difficulty: string[];
    status: string[];
  };
  searchQuery: string;
}

interface TrainingActions {
  // Module management
  updateModuleProgress: (moduleId: number, status: 'not_started' | 'in_progress' | 'completed', completionPercentage: number) => Promise<void>;
  
  // Filtering and search
  setFilters: (filters: Partial<TrainingState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Data loading
  loadModules: () => Promise<void>;
  loadTrainingModules: () => Promise<void>;
  loadTrainingProgress: () => Promise<void>;
  clearError: () => void;
}

type TrainingStore = TrainingState & TrainingActions;

// Helper function to convert backend data to frontend format
const convertToFrontendModule = (module: TrainingModule, progress?: TrainingProgress): FrontendTrainingModule => {
  const status = progress?.status === 'completed' ? 'completed' : 
                 progress?.status === 'in_progress' ? 'in-progress' : 'not-started';
  
  // Map duration from minutes to readable format
  const durationMinutes = module.duration_minutes || 60;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  
  // Determine difficulty based on duration (simple heuristic)
  const difficulty = durationMinutes <= 60 ? 'Beginner' : 
                     durationMinutes <= 120 ? 'Intermediate' : 'Advanced';
  
  // Determine category based on title (simple heuristic)
  const category = module.title.toLowerCase().includes('security') ? 'Security' :
                   module.title.toLowerCase().includes('compliance') ? 'Compliance' :
                   module.title.toLowerCase().includes('technical') ? 'Technical Skills' :
                   'Onboarding';
  
  return {
    id: module.id,
    name: module.title,
    description: module.description || '',
    duration,
    category,
    difficulty,
    status,
    progress: progress?.completion_percentage || 0,
    rating: 4.5, // Default rating, could be fetched from a separate endpoint
    enrolledUsers: 100, // Default, could be fetched from analytics
    icon: 'GraduationCap', // Default icon, could be mapped based on category
    tags: ['Required'], // Default tags, could be determined from module properties
    estimatedCompletion: progress?.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contentUrl: module.content_url || undefined,
    dueDate: progress?.due_date || undefined,
    startedAt: progress?.started_at || undefined,
    completedAt: progress?.completed_at || undefined
  };
};

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: [],
      trainingModules: [],
      trainingProgress: [],
      isLoading: false,
      error: null,
      filters: {
        category: [],
        difficulty: [],
        status: []
      },
      searchQuery: '',

      // Actions
      updateModuleProgress: async (moduleId, status, completionPercentage) => {
        try {
          const { trainingProgress } = get();
          const progress = trainingProgress.find(p => p.module_id === moduleId);
          
          if (progress) {
            await apiService.updateTrainingProgress(progress.id, status, completionPercentage);
            // Refresh progress
            await get().loadTrainingProgress();
            await get().loadModules();
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update training progress';
          set({ error: errorMessage });
        }
      },

      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      clearFilters: () => {
        set({
          filters: {
            category: [],
            difficulty: [],
            status: []
          },
          searchQuery: ''
        });
      },

      loadModules: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { trainingModules, trainingProgress } = get();
          
          // Convert backend modules and progress to frontend modules
          const modules: FrontendTrainingModule[] = trainingModules.map(module => {
            const progress = trainingProgress.find(p => p.module_id === module.id);
            return convertToFrontendModule(module, progress);
          });
          
          set({ modules, isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to load training modules',
            isLoading: false
          });
        }
      },

      loadTrainingModules: async () => {
        try {
          const modules = await apiService.getTrainingModules();
          set({ trainingModules: modules });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load training modules';
          set({ error: errorMessage });
        }
      },

      loadTrainingProgress: async () => {
        try {
          const progress = await apiService.getMyTrainingProgress();
          set({ trainingProgress: progress });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load training progress';
          set({ error: errorMessage });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'training-storage',
      partialize: (state) => ({
        modules: state.modules,
        trainingModules: state.trainingModules,
        trainingProgress: state.trainingProgress
      })
    }
  )
);

