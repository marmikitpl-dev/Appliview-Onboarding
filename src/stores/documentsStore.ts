import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'image' | 'video' | 'other';
  category: 'handbook' | 'policy' | 'training' | 'form' | 'reference' | 'personal';
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
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  requiredDocuments: number;
  completedDocuments: number;
}

interface DocumentsState {
  documents: Document[];
  categories: DocumentCategory[];
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
  uploadDocument: (file: File, metadata: Partial<Document>) => Promise<void>;
  updateUploadProgress: (documentId: string, progress: number) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<DocumentsState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Document selection
  selectDocument: (document: Document | null) => void;
  
  // Data loading
  loadDocuments: () => Promise<void>;
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

const initialCategories: DocumentCategory[] = [
  {
    id: 'handbook',
    name: 'Employee Handbook',
    description: 'Company policies and procedures',
    requiredDocuments: 1,
    completedDocuments: 1
  },
  {
    id: 'policy',
    name: 'Policies',
    description: 'Company policies and guidelines',
    requiredDocuments: 1,
    completedDocuments: 0
  },
  {
    id: 'training',
    name: 'Training Materials',
    description: 'Training videos and materials',
    requiredDocuments: 1,
    completedDocuments: 0
  },
  {
    id: 'form',
    name: 'Forms',
    description: 'Required forms and checklists',
    requiredDocuments: 1,
    completedDocuments: 0
  },
  {
    id: 'reference',
    name: 'Reference',
    description: 'Reference materials and resources',
    requiredDocuments: 0,
    completedDocuments: 0
  }
];

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
      documents: initialDocuments,
      categories: initialCategories,
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

      uploadDocument: async (file, metadata) => {
        const documentId = Date.now().toString();
        
        set(state => ({
          uploadProgress: { ...state.uploadProgress, [documentId]: 0 }
        }));

        try {
          // Simulate file upload with progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            get().updateUploadProgress(documentId, progress);
          }

          const newDocument: Document = {
            id: documentId,
            name: file.name,
            type: file.type.includes('pdf') ? 'pdf' : 
                  file.type.includes('doc') ? 'doc' : 
                  file.type.includes('image') ? 'image' : 'other',
            category: 'reference',
            size: file.size,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Current User', // Should come from auth store
            tags: [],
            isRequired: false,
            isCompleted: false,
            version: 1,
            ...metadata
          };

          set(state => ({
            documents: [...state.documents, newDocument],
            uploadProgress: { ...state.uploadProgress, [documentId]: undefined }
          }));

        } catch (error) {
          set(state => ({
            error: 'Failed to upload document',
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
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, you would fetch documents from an API here
          set({ isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to load documents',
            isLoading: false
          });
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
        categories: state.categories
      })
    }
  )
);
