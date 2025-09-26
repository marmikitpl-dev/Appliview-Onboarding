// Export all stores
export { useAuthStore, type FrontendUser } from './authStore';
export { useOnboardingStore, type Task, type OnboardingProgress } from './onboardingStore';
export { useDocumentsStore, type Document, type FrontendDocumentCategory } from './documentsStore';
export { useTrainingStore, type FrontendTrainingModule } from './trainingStore';
export { useDashboardStore } from './dashboardStore';

// Store utilities and helpers
import { useAuthStore } from './authStore';
import { useOnboardingStore } from './onboardingStore';
import { useDocumentsStore } from './documentsStore';
import { useTrainingStore } from './trainingStore';
import { useDashboardStore } from './dashboardStore';

export const useStoreReset = () => {
  const { logout } = useAuthStore();
  const { clearFilters: clearOnboardingFilters } = useOnboardingStore();
  const { clearFilters: clearDocumentFilters } = useDocumentsStore();
  const { clearFilters: clearTrainingFilters } = useTrainingStore();

  return {
    resetAll: () => {
      logout();
      clearOnboardingFilters();
      clearDocumentFilters();
      clearTrainingFilters();
    }
  };
};
