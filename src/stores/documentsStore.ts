import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, DocumentTemplate, DocumentSubmission, DocumentCategory } from '../services/api';

// Frontend Document interface that combines template and submission data
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'image' | 'video' | 'other';
  category: string;
  size: number; // in bytes
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
  description?: string;
  tags: string[];
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: string;
  version: number;
  status?: 'submitted' | 'approved' | 'rejected';
  templateId?: number;
  submissionId?: number;
}

export interface FrontendDocumentCategory {
  id: string;
  name: string;
  description: string;
  requiredDocuments: number;
  completedDocuments: number;
}

interface DocumentsState {
  documents: Document[];
  categories: FrontendDocumentCategory[];
  templates: DocumentTemplate[];
  submissions: DocumentSubmission[];
  isLoading: boolean;
  uploadProgress: { [key: string]: number | undefined };
  error: string | null;
  filters: {
    category: string[];
    type: string[];
    status: 'all' | 'required' | 'completed' | 'pending';
  };
  searchQuery: string;
  selectedDocument: Document | null;
}

interface DocumentsActions {
  // Document management
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt' | 'version'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  markDocumentCompleted: (id: string) => void;
  
  // File upload
  uploadDocument: (templateId: number, file: File) => Promise<void>;
  updateUploadProgress: (documentId: string, progress: number) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<DocumentsState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Document selection
  selectDocument: (document: Document | null) => void;
  
  // Data loading
  loadDocuments: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadSubmissions: () => Promise<void>;
  loadCategories: () => Promise<void>;
  clearError: () => void;
}

type DocumentsStore = DocumentsState & DocumentsActions;

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook 2024.pdf',
    type: 'pdf',
    category: 'handbook',
    size: 2048000,
    uploadedAt: '2024-01-10T09:00:00Z',
    uploadedBy: 'HR Department',
    description: 'Complete employee handbook with policies and procedures',
    tags: ['handbook', 'policies', 'required'],
    isRequired: true,
    isCompleted: true,
    completedAt: '2024-01-15T14:20:00Z',
    version: 1
  },
  {
    id: '2',
    name: 'IT Security Policy.docx',
    type: 'docx',
    category: 'policy',
    size: 512000,
    uploadedAt: '2024-01-10T09:15:00Z',
    uploadedBy: 'IT Department',
    description: 'Information security policies and guidelines',
    tags: ['security', 'IT', 'required'],
    isRequired: true,
    isCompleted: false,
    version: 2
  },
  {
    id: '3',
    name: 'Onboarding Checklist.pdf',
    type: 'pdf',
    category: 'form',
    size: 256000,
    uploadedAt: '2024-01-10T09:30:00Z',
    uploadedBy: 'HR Department',
    description: 'Checklist for new employee onboarding process',
    tags: ['checklist', 'onboarding', 'required'],
    isRequired: true,
    isCompleted: false,
    version: 1
  },
  {
    id: '4',
    name: 'Company Org Chart.png',
    type: 'image',
    category: 'reference',
    size: 1024000,
    uploadedAt: '2024-01-10T10:00:00Z',
    uploadedBy: 'HR Department',
    description: 'Current organizational structure',
    tags: ['organization', 'reference'],
    isRequired: false,
    isCompleted: false,
    version: 1
  },
  {
    id: '5',
    name: 'Training Module 1 - Introduction.mp4',
    type: 'video',
    category: 'training',
    size: 15728640,
    uploadedAt: '2024-01-10T10:30:00Z',
    uploadedBy: 'Training Department',
    description: 'Introduction to company culture and values',
    tags: ['training', 'culture', 'video'],
    isRequired: true,
    isCompleted: false,
    version: 1
  }
];

// Helper function to convert backend data to frontend format
const convertToFrontendDocument = (template: DocumentTemplate, submission?: DocumentSubmission): Document => {
  const isCompleted = submission?.status === 'approved';
  const isRequired = template.required_for_role === 'candidate';
  
  return {
    id: submission ? submission.id.toString() : `template-${template.id}`,
    name: template.name,
    type: 'pdf', // Default type, could be determined from file extension
    category: template.category_id?.toString() || 'general',
    size: 0, // Would need to be fetched from file metadata
    uploadedAt: submission?.created_at || new Date().toISOString(),
    uploadedBy: 'Current User', // Would need to be fetched from user data
    description: template.description || '',
    tags: isRequired ? ['required'] : [],
    isRequired,
    isCompleted,
    completedAt: isCompleted ? submission?.reviewed_at || undefined : undefined,
    version: 1,
    status: submission?.status,
    templateId: template.id,
    submissionId: submission?.id
  };
};

const convertToFrontendCategory = (category: DocumentCategory, templates: DocumentTemplate[], submissions: DocumentSubmission[]): FrontendDocumentCategory => {
  const categoryTemplates = templates.filter(t => t.category_id === category.id);
  const categorySubmissions = submissions.filter(s => 
    categoryTemplates.some(t => t.id === s.template_id)
  );
  
  return {
    id: category.id.toString(),
    name: category.name,
    description: category.description || '',
    requiredDocuments: categoryTemplates.filter(t => t.required_for_role === 'candidate').length,
    completedDocuments: categorySubmissions.filter(s => s.status === 'approved').length
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const useDocumentsStore = create<DocumentsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      documents: [],
      categories: [],
      templates: [],
      submissions: [],
      isLoading: false,
      uploadProgress: {},
      error: null,
      filters: {
        category: [],
        type: [],
        status: 'all'
      },
      searchQuery: '',
      selectedDocument: null,

      // Actions
      addDocument: (documentData) => {
        const newDocument: Document = {
          ...documentData,
          id: Date.now().toString(),
          uploadedAt: new Date().toISOString(),
          version: 1
        };

        set(state => ({
          documents: [...state.documents, newDocument]
        }));
      },

      updateDocument: (id, updates) => {
        set(state => ({
          documents: state.documents.map(doc =>
            doc.id === id
              ? { ...doc, ...updates, version: doc.version + 1 }
              : doc
          )
        }));
      },

      deleteDocument: (id) => {
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== id),
          selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument
        }));
      },

      markDocumentCompleted: (id) => {
        get().updateDocument(id, {
          isCompleted: true,
          completedAt: new Date().toISOString()
        });
      },

      uploadDocument: async (templateId, file) => {
        const documentId = Date.now().toString();
        
        set(state => ({
          uploadProgress: { ...state.uploadProgress, [documentId]: 0 }
        }));

        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            get().updateUploadProgress(documentId, progress);
          }

          // Upload to backend
          const submission = await apiService.submitDocument(templateId, file);
          
          // Refresh submissions and documents
          await get().loadSubmissions();
          await get().loadDocuments();

          set(state => ({
            uploadProgress: { ...state.uploadProgress, [documentId]: undefined }
          }));

        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to upload document';
          set(state => ({
            error: errorMessage,
            uploadProgress: { ...state.uploadProgress, [documentId]: undefined }
          }));
        }
      },

      updateUploadProgress: (documentId, progress) => {
        set(state => ({
          uploadProgress: { ...state.uploadProgress, [documentId]: progress }
        }));
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
            type: [],
            status: 'all'
          },
          searchQuery: ''
        });
      },

      selectDocument: (document) => {
        set({ selectedDocument: document });
      },

      loadDocuments: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { templates, submissions } = get();
          
          // Convert templates and submissions to frontend documents
          const documents: Document[] = templates.map(template => {
            const submission = submissions.find(s => s.template_id === template.id);
            return convertToFrontendDocument(template, submission);
          });
          
          set({ documents, isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to load documents',
            isLoading: false
          });
        }
      },

      loadTemplates: async () => {
        try {
          const templates = await apiService.getDocumentTemplates();
          set({ templates });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load document templates';
          set({ error: errorMessage });
        }
      },

      loadSubmissions: async () => {
        try {
          const submissions = await apiService.getMyDocumentSubmissions();
          set({ submissions });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load document submissions';
          set({ error: errorMessage });
        }
      },

      loadCategories: async () => {
        try {
          const backendCategories = await apiService.getDocumentCategories();
          const { templates, submissions } = get();
          
          const categories = backendCategories.map(category => 
            convertToFrontendCategory(category, templates, submissions)
          );
          
          set({ categories });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to load document categories';
          set({ error: errorMessage });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'documents-storage',
      partialize: (state) => ({
        documents: state.documents,
        categories: state.categories,
        templates: state.templates,
        submissions: state.submissions
      })
    }
  )
);
