// API Configuration
export const API_CONFIG = {
  // Prefer VITE_API_BASE. Fallback to VITE_API_BASE_URL. Default to new backend URL.
  BASE_URL: (import.meta.env.VITE_API_BASE as string) || (import.meta.env.VITE_API_BASE_URL as string) || 'https://civil-stud-miserably.ngrok-free.app/api/v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
    USERS: {
      ME: '/users/me',
      LIST: '/users/',
      CREATE: '/users/',
      GET_BY_ID: (id: number) => `/users/${id}`,
      UPDATE: (id: number) => `/users/${id}`,
      WITH_PROGRESS: '/users/with-progress',
    },
    DASHBOARD: {
      CANDIDATE: '/dashboard/candidate',
      STATS: '/dashboard/stats',
      DOCUMENT_TRENDS: '/dashboard/document-trends',
      ONBOARDING_PROGRESS: '/dashboard/onboarding-progress',
    },
    DOCUMENTS: {
      TEMPLATES: '/documents/templates',
      TEMPLATE_BY_ID: (id: number) => `/documents/templates/${id}`,
      // Backend expects POST to /documents/submit/{template_id} with multipart 'file'
      SUBMIT: (templateId: number) => `/documents/submit/${templateId}`,
      SUBMISSIONS_ME: '/documents/submissions/me',
      SUBMISSION_BY_ID: (id: number) => `/documents/submissions/${id}`,
      // View stream endpoint
      VIEW: (submissionId: number) => `/documents/view/${submissionId}`,
      CATEGORIES: '/documents/categories',
      CATEGORY_BY_ID: (id: number) => `/documents/categories/${id}`,
      CANDIDATE_TEMPLATES: '/documents/candidate-templates',
      CANDIDATE_TEMPLATES_BY_ID: (id: number) => `/documents/candidate-templates/${id}`,
    },
    TASKS: {
      // For candidates, use required tasks endpoint
      LIST: '/tasks/',
      TASK_BY_ID: (id: number) => `/tasks/${id}`,
      CANDIDATE_TASKS: '/candidate-tasks/me',
      CANDIDATE_TASK_BY_ID: (id: number) => `/candidate-tasks/${id}`,
      CANDIDATE_TEMPLATES: '/tasks/candidate-templates',
    },
    TRAINING: {
      MODULES: '/training/modules',
      MODULE_BY_ID: (id: number) => `/training/modules/${id}`,
      PROGRESS: '/training/progress/me',
      PROGRESS_BY_ID: (id: number) => `/training/progress/${id}`,
      ASSIGNMENTS: '/training/assignments',
    },
    NOTIFICATIONS: {
      // Backend exposes /notifications/logs (HR/Admin) and candidate notifications via dashboard.candidate
      LOGS: '/notifications/logs',
      SEND: '/notifications/send',
      MARK_READ: (id: number) => `/notifications/${id}/read`,
      TEMPLATES: '/notifications/templates',
      TEMPLATE_BY_ID: (id: number) => `/notifications/templates/${id}`,
    },
    HEALTH: {
      // Note: These are ROOT-level endpoints on the backend server, not under /api/v1
      CHECK: '/healthz',
      DB_TEST: '/test-db',
    },
  },
} as const;

// Environment variables validation
export const validateEnv = () => {
  const requiredVars = ['VITE_API_BASE'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default API URL:', API_CONFIG.BASE_URL);
  }
};

// Initialize environment validation
validateEnv();
