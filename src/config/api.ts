// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
    USERS: {
      ME: '/users/me',
    },
    DASHBOARD: {
      CANDIDATE: '/dashboard/candidate',
      STATS: '/dashboard/stats',
    },
    DOCUMENTS: {
      TEMPLATES: '/documents/templates',
      SUBMISSIONS: '/documents/submissions',
      SUBMISSIONS_ME: '/documents/submissions/me',
      CATEGORIES: '/documents/categories',
    },
    TASKS: {
      LIST: '/tasks/',
      CANDIDATE_TASKS: '/candidate-tasks/me',
    },
    TRAINING: {
      MODULES: '/training/modules',
      PROGRESS: '/training/progress/me',
    },
    NOTIFICATIONS: {
      ME: '/notifications/me',
      SEND: '/notifications/send',
    },
  },
} as const;

// Environment variables validation
export const validateEnv = () => {
  const requiredVars = ['VITE_API_BASE_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default API URL:', API_CONFIG.BASE_URL);
  }
};

// Initialize environment validation
validateEnv();
