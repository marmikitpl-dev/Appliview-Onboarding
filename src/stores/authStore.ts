import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, User, LoginRequest } from '../services/api';

// Extended User interface for frontend compatibility
export interface FrontendUser extends User {
  name: string; // Maps to full_name from backend
  avatar?: string;
  department?: string;
}

interface AuthState {
  user: FrontendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<FrontendUser>) => void;
  refreshAuthToken: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Helper function to convert backend user to frontend user
const convertToFrontendUser = (backendUser: User): FrontendUser => ({
  ...backendUser,
  name: backendUser.full_name,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.full_name)}&background=3b82f6&color=fff`,
  department: 'Engineering', // Default department, could be fetched from org
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const loginRequest: LoginRequest = { email, password };
          const loginResponse = await apiService.login(loginRequest);
          
          // Store tokens
          localStorage.setItem('access_token', loginResponse.access_token);
          localStorage.setItem('refresh_token', loginResponse.refresh_token);
          
          // Fetch user profile
          const userProfile = await apiService.getCurrentUser();
          const frontendUser = convertToFrontendUser(userProfile);

          set({
            user: frontendUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: loginResponse.access_token,
            refreshToken: loginResponse.refresh_token
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null
          });
        }
      },

      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          accessToken: null,
          refreshToken: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<FrontendUser>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          });
        }
      },

      refreshAuthToken: async () => {
        try {
          // This would typically call a refresh endpoint
          // For now, we'll just check if the current token is still valid
          const currentUser = await apiService.getCurrentUser();
          const frontendUser = convertToFrontendUser(currentUser);
          
          set({ user: frontendUser });
        } catch (error) {
          // Token is invalid, logout user
          get().logout();
        }
      },

      loadUserProfile: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          const userProfile = await apiService.getCurrentUser();
          const frontendUser = convertToFrontendUser(userProfile);
          set({ user: frontendUser });
        } catch (error) {
          // If we can't load the profile, the token might be invalid
          get().logout();
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
);
