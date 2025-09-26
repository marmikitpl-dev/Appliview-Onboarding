import React, { useState, useRef, useCallback } from "react";
import Navigation from "../components/Navigation";
import toast from "react-hot-toast";
import {
  Upload,
  Eye,
  Download,
  Folder,
  Search,
  Plus,
  FileText,
  Paperclip,
} from "lucide-react";

const DocumentsPage = () => {
  // Hardcoded mock data for UI testing
  const documents = [
    {
      id: 1,
      name: "I9_Form_John_Smith.pdf",
      category: "tax",
      status: "approved",
      uploadedAt: "2024-09-10T10:30:00Z",
      size: 245760,
      type: "application/pdf",
      description: "Employment eligibility verification form",
      isRequired: true,
      tags: ["Required", "Tax"]
    },
    {
      id: 2,
      name: "W4_Tax_Form.pdf", 
      category: "tax",
      status: "pending",
      uploadedAt: "2024-09-12T14:20:00Z",
      size: 189440,
      type: "application/pdf",
      description: "Tax withholding certificate",
      isRequired: true,
      tags: ["Required", "Tax"]
    },
    {
      id: 3,
      name: "Emergency_Contact_Form.pdf",
      category: "hr",
      status: "rejected",
      uploadedAt: "2024-09-08T09:15:00Z",
      size: 156672,
      type: "application/pdf",
      description: "Emergency contact information",
      isRequired: true,
      tags: ["Required", "HR"]
    }
  ];

  const categories = [
    { id: "tax", name: "Tax Documents", slug: "tax", count: 2 },
    { id: "hr", name: "HR Forms", slug: "hr", count: 1 },
    { id: "legal", name: "Legal Documents", slug: "legal", count: 0 },
    { id: "benefits", name: "Benefits", slug: "benefits", count: 0 }
  ];

  const templates = [
    {
      id: 1,
      name: "I-9 Employment Eligibility Verification",
      category: "tax",
      description: "Required form to verify employment eligibility",
      required: true
    },
    {
      id: 2,
      name: "W-4 Employee's Withholding Certificate",
      category: "tax", 
      description: "Tax withholding information form",
      required: true
    },
    {
      id: 3,
      name: "Emergency Contact Information",
      category: "hr",
      description: "Emergency contact details form",
      required: true
    }
  ];

  const uploadProgress = 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDocument = async (file: File, templateId?: number) => {
    console.log("Mock upload:", file.name, templateId);
    toast.success("Document uploaded successfully!");
  };

  // Calculate overall upload progress
  const overallUploadProgress = uploadProgress;

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, DOC, DOCX, PNG, and JPG files are allowed";
    }

    return null;
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!selectedTemplate) {
        toast.error('Please select a document template first');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const error = validateFile(file);

        if (error) {
          toast.error(`${file.name}: ${error}`);
          continue;
        }

        try {
          await uploadDocument(file, selectedTemplate || undefined);
          toast.success(`${file.name} uploaded successfully!`);
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    },
    [uploadDocument, validateFile, selectedTemplate]
  );

  // Enhanced categories with counts
  const enhancedCategories = [
    { id: "all", name: "All Documents", count: documents.length },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: documents.filter((d) => d.category === cat.id).length,
    })),
  ];

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-screen bg-gray-50">
      <Navigation />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">
            Upload, review, and manage your onboarding documents
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Paperclip className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upload Progress
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallUploadProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Documents
                </h2>
              </div>

              <div className="p-4">
                {/* Template Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Document Template
                  </label>
                  <select
                    value={selectedTemplate || ''}
                    onChange={(e) => setSelectedTemplate(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedTemplate ? 'Drag and drop files here, or' : 'Select a template first'}
                  </p>
                  <button
                    onClick={handleChooseFiles}
                    disabled={!selectedTemplate}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    choose files
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, PNG, JPG up to 10MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Folder className="h-5 w-5 mr-2" />
                  Categories
                </h2>
              </div>

              <div className="p-2">
                {enhancedCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleChooseFiles}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </button>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Documents ({filteredDocuments.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedCategory === "all"
                        ? "Upload your first document to get started"
                        : `No documents in ${
                            enhancedCategories.find(
                              (c) => c.id === selectedCategory
                            )?.name
                          } category`}
                    </p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              {doc.isRequired && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-500">
                                {doc.category}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(doc.size)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploaded{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {doc.description}
                              </p>
                            )}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
