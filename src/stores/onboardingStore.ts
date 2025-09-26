import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, OnboardingTask, CandidateTask } from '../services/api';

// Frontend Task interface that combines template and candidate task data
export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'setup' | 'training' | 'documentation' | 'meeting' | 'other';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  estimatedHours?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  templateId?: number;
  candidateTaskId?: number;
}

export interface OnboardingProgress {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionPercentage: number;
}

interface OnboardingState {
  tasks: Task[];
  taskTemplates: OnboardingTask[];
  candidateTasks: CandidateTask[];
  progress: OnboardingProgress;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string[];
    category: string[];
    priority: string[];
  };
  searchQuery: string;
}

interface OnboardingActions {
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  updateTaskStatus: (candidateTaskId: number, status: 'pending' | 'in_progress' | 'done') => Promise<void>;
  
  // Filtering and search
  setFilters: (filters: Partial<OnboardingState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Progress tracking
  updateProgress: () => void;
  
  // Data loading
  loadTasks: () => Promise<void>;
  loadTaskTemplates: () => Promise<void>;
  loadCandidateTasks: () => Promise<void>;
  clearError: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete IT Setup',
    description: 'Set up laptop, accounts, and necessary software',
    category: 'setup',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-15',
    estimatedHours: 4,
    completedAt: '2024-01-14T10:30:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-14T10:30:00Z'
  },
  {
    id: '2',
    title: 'Review Company Handbook',
    description: 'Read through employee handbook and policies',
    category: 'documentation',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-01-16',
    estimatedHours: 2,
    completedAt: '2024-01-15T14:20:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    title: 'Security Training Module',
    description: 'Complete mandatory cybersecurity training',
    category: 'training',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-18',
    estimatedHours: 3,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-16T11:15:00Z'
  },
  {
    id: '4',
    title: 'Meet Team Members',
    description: 'Schedule 1:1 meetings with immediate team',
    category: 'meeting',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-20',
    estimatedHours: 4,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '5',
    title: 'Project Documentation Review',
    description: 'Review current project documentation and codebase',
    category: 'documentation',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-22',
    estimatedHours: 6,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  }
];

// Helper function to convert backend data to frontend format
const convertToFrontendTask = (template: OnboardingTask, candidateTask?: CandidateTask): Task => {
  const status = candidateTask?.status === 'done' ? 'completed' : 
                 candidateTask?.status === 'in_progress' ? 'in-progress' : 'pending';
  
  return {
    id: candidateTask ? candidateTask.id.toString() : `template-${template.id}`,
    title: template.title,
    description: template.description || '',
    category: 'other', // Default category, could be mapped from assignee_role
    status,
    priority: 'medium', // Default priority, could be calculated from due_days_from_start
    dueDate: candidateTask?.due_date || undefined,
    assignedTo: template.assignee_role,
    estimatedHours: undefined,
    completedAt: candidateTask?.completed_at || undefined,
    createdAt: candidateTask?.created_at || new Date().toISOString(),
    updatedAt: candidateTask?.created_at || new Date().toISOString(),
    templateId: template.id,
    candidateTaskId: candidateTask?.id
  };
};

const calculateProgress = (tasks: Task[]): OnboardingProgress => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && task.status !== 'completed';
  }).length;

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      taskTemplates: [],
      candidateTasks: [],
      progress: { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, overdueTasks: 0, completionPercentage: 0 },
      isLoading: false,
      error: null,
      filters: {
        status: [],
        category: [],
        priority: []
      },
      searchQuery: '',

      // Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => {
          const newTasks = [...state.tasks, newTask];
          return {
            tasks: newTasks,
            progress: calculateProgress(newTasks)
          };
        });
      },

      updateTask: (id, updates) => {
        set(state => {
          const newTasks = state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          );
          return {
            tasks: newTasks,
            progress: calculateProgress(newTasks)
          };
        });
      },

      deleteTask: (id) => {
        set(state => {
          const newTasks = state.tasks.filter(task => task.id !== id);
          return {
            tasks: newTasks,
            progress: calculateProgress(newTasks)
          };
        });
      },

      completeTask: (id) => {
        get().updateTask(id, {
          status: 'completed',
          completedAt: new Date().toISOString()
        });
      },

      updateTaskStatus: async (candidateTaskId, status) => {
        try {
          await apiService.updateTaskStatus(candidateTaskId, status);
          // Refresh candidate tasks
          await get().loadCandidateTasks();
          await get().loadTasks();
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update task status';
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
            status: [],
            category: [],
            priority: []
          },
          searchQuery: ''
        });
      },

      updateProgress: () => {
        set(state => ({
          progress: calculateProgress(state.tasks)
        }));
      },

      loadTasks: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { taskTemplates, candidateTasks } = get();
          
          // Convert templates and candidate tasks to frontend tasks
          const tasks: Task[] = taskTemplates.map(template => {
            const candidateTask = candidateTasks.find(ct => ct.task_id === template.id);
            return convertToFrontendTask(template, candidateTask);
          });
          
          set({ tasks, progress: calculateProgress(tasks), isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to load tasks',
            isLoading: false
          });
        }
      },

      loadTaskTemplates: async () => {
        try {
          const templates = await apiService.getTaskTemplates();
          set({ taskTemplates: templates });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load task templates';
          set({ error: errorMessage });
        }
      },

      loadCandidateTasks: async () => {
        try {
          const candidateTasks = await apiService.getMyTasks();
          set({ candidateTasks });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load candidate tasks';
          set({ error: errorMessage });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        taskTemplates: state.taskTemplates,
        candidateTasks: state.candidateTasks,
        progress: state.progress
      })
    }
  )
);
