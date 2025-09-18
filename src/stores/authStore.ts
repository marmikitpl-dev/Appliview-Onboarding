import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'manager';
  department?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call - replace with actual authentication logic
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Basic demo password validation
          const validCredentials = 
            (email === 'admin@appliview.com' && password === 'admin123') ||
            (email === 'user@appliview.com' && password === 'user123') ||
            password === 'demo'; // Generic demo password
          
          if (!validCredentials) {
            throw new Error('Invalid credentials');
          }
          
          // Demo user data - replace with actual API response
          const userData: User = {
            id: '1',
            email,
            name: email === 'admin@appliview.com' ? 'Admin User' : 'John Doe',
            role: email === 'admin@appliview.com' ? 'admin' : 'employee',
            department: 'Engineering',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=3b82f6&color=fff`
          };

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: 'Invalid credentials',
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
