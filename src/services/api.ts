import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

// Types based on backend API documentation
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'candidate' | 'hr' | 'admin';
  org_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface DocumentTemplate {
  id: number;
  name: string;
  description: string | null;
  required_for_role: string | null;
  org_id: number;
  category_id: number | null;
}

export interface DocumentSubmission {
  id: number;
  candidate_user_id: number;
  template_id: number;
  file_path: string;
  status: 'submitted' | 'approved' | 'rejected';
  notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface DocumentCategory {
  id: number;
  name: string;
  description: string | null;
  org_id: number;
}

export interface OnboardingTask {
  id: number;
  title: string;
  description: string | null;
  due_days_from_start: number;
  assignee_role: 'candidate' | 'hr' | 'manager';
  org_id: number;
}

export interface CandidateTask {
  id: number;
  candidate_user_id: number;
  task_id: number;
  status: 'pending' | 'in_progress' | 'done';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  task: OnboardingTask;
}

export interface TrainingModule {
  id: number;
  title: string;
  description: string | null;
  content_url: string | null;
  duration_minutes: number | null;
  org_id: number;
}

export interface TrainingProgress {
  id: number;
  candidate_user_id: number;
  module_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  due_date: string | null;
}

export interface NotificationLog {
  id: number;
  recipient_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  documents: {
    total: number;
    submitted: number;
    approved: number;
  };
  tasks: {
    total: number;
    completed: number;
  };
  training: {
    total: number;
    completed: number;
  };
  notifications: number;
}

export interface CandidateDashboard {
  user: User;
  stats: DashboardStats;
  recent_activity: NotificationLog[];
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>(API_CONFIG.ENDPOINTS.USERS.ME);
    return response.data;
  }

  // Dashboard
  async getCandidateDashboard(): Promise<CandidateDashboard> {
    const response = await this.api.get<CandidateDashboard>(
      API_CONFIG.ENDPOINTS.DASHBOARD.CANDIDATE
    );
    return response.data;
  }

  async getDashboardStats(): Promise<any> {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  }

  // Documents
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const response = await this.api.get<DocumentTemplate[]>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.TEMPLATES
    );
    return response.data;
  }

  async getDocumentCategories(): Promise<DocumentCategory[]> {
    const response = await this.api.get<DocumentCategory[]>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.CATEGORIES
    );
    return response.data;
  }

  async getMyDocumentSubmissions(): Promise<DocumentSubmission[]> {
    const response = await this.api.get<DocumentSubmission[]>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.SUBMISSIONS_ME
    );
    return response.data;
  }

  async submitDocument(templateId: number, file: File): Promise<DocumentSubmission> {
    const formData = new FormData();
    formData.append('template_id', templateId.toString());
    formData.append('file', file);

    const response = await this.api.post<DocumentSubmission>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.SUBMIT(templateId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Tasks
  async getTaskTemplates(): Promise<OnboardingTask[]> {
    const response = await this.api.get<OnboardingTask[]>(
      API_CONFIG.ENDPOINTS.TASKS.LIST
    );
    return response.data;
  }

  async getMyTasks(): Promise<CandidateTask[]> {
    const response = await this.api.get<CandidateTask[]>(
      API_CONFIG.ENDPOINTS.TASKS.CANDIDATE_TASKS
    );
    return response.data;
  }

  async updateTaskStatus(taskId: number, status: 'pending' | 'in_progress' | 'done'): Promise<CandidateTask> {
    const response = await this.api.put<CandidateTask>(
      API_CONFIG.ENDPOINTS.TASKS.CANDIDATE_TASK_BY_ID(taskId),
      { status }
    );
    return response.data;
  }

  // Training
  async getTrainingModules(): Promise<TrainingModule[]> {
    const response = await this.api.get<TrainingModule[]>(
      API_CONFIG.ENDPOINTS.TRAINING.MODULES
    );
    return response.data;
  }

  async getMyTrainingProgress(): Promise<TrainingProgress[]> {
    const response = await this.api.get<TrainingProgress[]>(
      API_CONFIG.ENDPOINTS.TRAINING.PROGRESS
    );
    return response.data;
  }

  async updateTrainingProgress(progressId: number, status: 'not_started' | 'in_progress' | 'completed', score?: number): Promise<TrainingProgress> {
    const response = await this.api.patch<TrainingProgress>(
      API_CONFIG.ENDPOINTS.TRAINING.PROGRESS_BY_ID(progressId),
      { status, score }
    );
    return response.data;
  }

  // Notifications
  async getMyNotifications(): Promise<NotificationLog[]> {
    // Backend does not provide /notifications/me for candidates. Use dashboard recent_activity as a proxy.
    const dashboard = await this.getCandidateDashboard();
    // Map recent_activity to NotificationLog shape (partial fields)
    const mapped: NotificationLog[] = (dashboard.recent_activity || []).map((n: any) => ({
      id: n.id,
      recipient_id: dashboard.user.id,
      title: n.title,
      message: n.message,
      notification_type: 'info',
      is_read: n.is_read,
      created_at: n.created_at,
    }));
    return mapped;
  }

  async markNotificationAsRead(_notificationId: number): Promise<void> {
    // Backend doesn't expose a mark-read endpoint for candidate notifications.
    // This is a no-op on the server; state is updated locally by the store.
    return Promise.resolve();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    // healthz is at root server level, not under /api/v1
    const base = API_CONFIG.BASE_URL.replace(/\/?api\/?v1\/?$/, '');
    const url = `${base}/healthz`;
    const response = await axios.get(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
