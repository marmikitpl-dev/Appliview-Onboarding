import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, CandidateDashboard, DashboardStats, NotificationLog } from '../services/api';

interface DashboardState {
  candidateDashboard: CandidateDashboard | null;
  dashboardStats: DashboardStats | null;
  notifications: NotificationLog[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  // Data loading
  loadCandidateDashboard: () => Promise<void>;
  loadDashboardStats: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: number) => Promise<void>;
  clearError: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Initial state
      candidateDashboard: null,
      dashboardStats: null,
      notifications: [],
      isLoading: false,
      error: null,

      // Actions
      loadCandidateDashboard: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const dashboard = await apiService.getCandidateDashboard();
          set({ candidateDashboard: dashboard, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load dashboard data';
          set({
            error: errorMessage,
            isLoading: false
          });
        }
      },

      loadDashboardStats: async () => {
        try {
          const stats = await apiService.getDashboardStats();
          set({ dashboardStats: stats });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load dashboard statistics';
          set({ error: errorMessage });
        }
      },

      loadNotifications: async () => {
        try {
          const notifications = await apiService.getMyNotifications();
          set({ notifications });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load notifications';
          set({ error: errorMessage });
        }
      },

      markNotificationAsRead: async (notificationId) => {
        try {
          await apiService.markNotificationAsRead(notificationId);
          // Update local state
          set(state => ({
            notifications: state.notifications.map(notification =>
              notification.id === notificationId
                ? { ...notification, is_read: true }
                : notification
            )
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to mark notification as read';
          set({ error: errorMessage });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        candidateDashboard: state.candidateDashboard,
        dashboardStats: state.dashboardStats,
        notifications: state.notifications
      })
    }
  )
);

