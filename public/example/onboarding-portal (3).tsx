import React, { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  LogOut,
  Building,
  Upload,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  User,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Folder,
  Search,
  Filter,
  Plus,
  Paperclip,
  Calendar
} from 'lucide-react';

const DocumentsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: 'I9 Form',
      description: 'Employment eligibility verification',
      category: 'HR / Forms',
      status: 'submitted',
      submittedDate: '03/09/2025',
      dueDate: '10/09/2025',
      size: '2.4 MB',
      type: 'PDF',
      required: true,
      reviewNotes: ''
    },
    {
      id: 2,
      name: 'W4 Form',
      description: 'Federal tax withholding',
      category: 'HR / Forms',
      status: 'submitted',
      submittedDate: '03/09/2025',
      dueDate: '10/09/2025',
      size: '1.8 MB',
      type: 'PDF',
      required: true,
      reviewNotes: ''
    },
    {
      id: 3,
      name: 'Code of Conduct',
      description: 'Company code of conduct acknowledgment',
      category: 'Policies',
      status: 'approved',
      submittedDate: '03/09/2025',
      approvedDate: '04/09/2025',
      dueDate: '15/09/2025',
      size: '1.2 MB',
      type: 'PDF',
      required: true,
      reviewNotes: 'Document approved. Welcome to the team!'
    },
    {
      id: 4,
      name: 'Insider Trading Policy',
      description: 'Insider trading policy acknowledgment',
      category: 'Policies',
      status: 'rejected',
      submittedDate: '03/09/2025',
      rejectedDate: '05/09/2025',
      dueDate: '15/09/2025',
      size: '980 KB',
      type: 'PDF',
      required: true,
      reviewNotes: 'Please review section 3.2 and resubmit with corrections.'
    },
    {
      id: 5,
      name: 'Emergency Contact Form',
      description: 'Emergency contact information',
      category: 'HR / Forms',
      status: 'pending',
      dueDate: '12/09/2025',
      required: true,
      reviewNotes: ''
    },
    {
      id: 6,
      name: 'Direct Deposit Form',
      description: 'Banking information for payroll',
      category: 'HR / Forms',
      status: 'pending',
      dueDate: '12/09/2025',
      required: true,
      reviewNotes: ''
    },
    {
      id: 7,
      name: 'Health Insurance Enrollment',
      description: 'Health insurance plan selection',
      category: 'Benefits',
      status: 'pending',
      dueDate: '20/09/2025',
      required: false,
      reviewNotes: ''
    },
    {
      id: 8,
      name: 'Parking Registration',
      description: 'Vehicle registration for parking access',
      category: 'Facilities',
      status: 'pending',
      dueDate: '25/09/2025',
      required: false,
      reviewNotes: ''
    }
  ];

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'HR / Forms', name: 'HR / Forms', count: documents.filter(d => d.category === 'HR / Forms').length },
    { id: 'Policies', name: 'Policies', count: documents.filter(d => d.category === 'Policies').length },
    { id: 'Benefits', name: 'Benefits', count: documents.filter(d => d.category === 'Benefits').length },
    { id: 'Facilities', name: 'Facilities', count: documents.filter(d => d.category === 'Facilities').length }
  ];

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Building className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Onboarding Portal</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition duration-200">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </button>
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition duration-200">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </button>
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </button>
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition duration-200">
              <GraduationCap className="h-4 w-4 mr-2" />
              Training
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="px-2 py-3 space-y-1">
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition duration-200">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition duration-200">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-100">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition duration-200">
            <GraduationCap className="h-4 w-4 mr-2" />
            Training
          </button>
        </div>
      </div>
    </nav>
  );

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            SUBMITTED
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            APPROVED
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="h-3 w-3 mr-1" />
            REJECTED
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            <AlertTriangle className="h-3 w-3 mr-1" />
            PENDING
          </span>
        );
      default:
        return null;
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Document statistics
  const docStats = {
    total: documents.length,
    submitted: documents.filter(d => d.status === 'submitted').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    pending: documents.filter(d => d.status === 'pending').length
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
    console.log('Files dropped');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
            <p className="text-gray-600">Upload and manage your onboarding documents</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Documents
          </button>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{docStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{docStats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{docStats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{docStats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{docStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                <Plus className="h-4 w-4 mr-2 inline" />
                Choose Files
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <Folder className="h-4 w-4 mr-2 inline" />
                Browse Templates
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PDF, DOC, DOCX, PNG, JPG (Max size: 10MB)
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents by Category */}
        {categories
          .filter(cat => cat.id !== 'all' && (selectedCategory === 'all' || selectedCategory === cat.id))
          .map(category => {
            const categoryDocs = filteredDocuments.filter(doc => doc.category === category.id);
            if (categoryDocs.length === 0) return null;

            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {categoryDocs.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {categoryDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-200"
                    >
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 text-gray-600 mr-2" />
                          <h3 className="font-medium text-gray-900 mr-3">{doc.name}</h3>
                          {getStatusBadge(doc.status)}
                          {doc.required && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          {doc.submittedDate && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Submitted: {doc.submittedDate}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Due: {doc.dueDate}</span>
                          </div>
                          {doc.size && (
                            <div className="flex items-center">
                              <Paperclip className="h-3 w-3 mr-1" />
                              <span>{doc.size} • {doc.type}</span>
                            </div>
                          )}
                        </div>
                        
                        {doc.reviewNotes && (
                          <div className={`mt-2 p-2 rounded-lg text-xs ${
                            doc.status === 'approved' ? 'bg-green-50 text-green-700' :
                            doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-gray-50 text-gray-700'
                          }`}>
                            <strong>Review Notes:</strong> {doc.reviewNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {doc.status === 'pending' ? (
                          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </button>
                        ) : (
                          <>
                            <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 text-sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </button>
                            {doc.status === 'rejected' && (
                              <button className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 text-sm">
                                <Upload className="h-4 w-4 mr-1" />
                                Resubmit
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Your documents will appear here once uploaded'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentsPage;