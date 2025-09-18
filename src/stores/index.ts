// Export all stores
export { useAuthStore, type User } from './authStore';
export { useOnboardingStore, type Task, type OnboardingProgress } from './onboardingStore';
export { useDocumentsStore, type Document, type DocumentCategory } from './documentsStore';

// Store utilities and helpers
import { useAuthStore } from './authStore';
import { useOnboardingStore } from './onboardingStore';
import { useDocumentsStore } from './documentsStore';

export const useStoreReset = () => {
  const { logout } = useAuthStore();
  const { clearFilters: clearOnboardingFilters } = useOnboardingStore();
  const { clearFilters: clearDocumentFilters } = useDocumentsStore();

  return {
    resetAll: () => {
      logout();
      clearOnboardingFilters();
      clearDocumentFilters();
    }
  };
};
