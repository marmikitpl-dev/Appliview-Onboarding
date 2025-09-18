import React, { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  LogOut,
  Building,
  CheckCircle,
  Clock,
  RotateCcw,
  User,
  Bell,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit3
} from 'lucide-react';

const TasksPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample tasks data
  const tasks = [
    {
      id: 1,
      title: 'Complete Profile Setup',
      description: 'Set up your employee profile with personal information, emergency contacts, and preferences',
      status: 'completed',
      dueDate: '18/08/2025',
      category: 'Profile',
      priority: 'high',
      completedDate: '15/08/2025'
    },
    {
      id: 2,
      title: 'Review Company Handbook',
      description: 'Read through the company policies, procedures, and employee guidelines',
      status: 'completed',
      dueDate: '16/08/2025',
      category: 'Documentation',
      priority: 'high',
      completedDate: '14/08/2025'
    },
    {
      id: 3,
      title: 'Complete IT Setup',
      description: 'Set up your work laptop, email accounts, and access required software applications',
      status: 'completed',
      dueDate: '20/08/2025',
      category: 'IT Setup',
      priority: 'medium',
      completedDate: '16/08/2025'
    },
    {
      id: 4,
      title: 'Schedule Meet & Greet',
      description: 'Schedule meetings with your team members and key stakeholders',
      status: 'in-progress',
      dueDate: '25/08/2025',
      category: 'Networking',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Complete Security Training',
      description: 'Finish mandatory security awareness and compliance training modules',
      status: 'pending',
      dueDate: '30/08/2025',
      category: 'Training',
      priority: 'high'
    },
    {
      id: 6,
      title: 'Submit Emergency Contacts',
      description: 'Provide emergency contact information for company records',
      status: 'overdue',
      dueDate: '10/08/2025',
      category: 'HR',
      priority: 'high'
    }
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
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </button>
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition duration-200">
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
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-100">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition duration-200">
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

  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            COMPLETED
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            IN PROGRESS
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            PENDING
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3 mr-1" />
            OVERDUE
          </span>
        );
      default:
        return null;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Onboarding Tasks</h1>
          <p className="text-gray-600">Track and complete your onboarding tasks to get started</p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{taskStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {['all', 'completed', 'in-progress', 'pending', 'overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    filterStatus === status
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {status === 'all' ? 'All Tasks' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl shadow-sm border-l-4 ${getPriorityColor(task.priority)} border-t border-r border-b border-gray-100 p-6 hover:shadow-md transition duration-300`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  {/* Task Header */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mr-3">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>
                  
                  {/* Task Description */}
                  <p className="text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                  
                  {/* Task Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {task.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-2 w-2 bg-gray-300 rounded-full mr-2"></span>
                      <span>{task.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span className="capitalize">{task.priority} Priority</span>
                    </div>
                    {task.completedDate && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Completed: {task.completedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                  {task.status === 'completed' ? (
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reopen Task
                    </button>
                  ) : task.status === 'in-progress' ? (
                    <div className="flex gap-2">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Continue
                      </button>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </button>
                    </div>
                  ) : (
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'All your tasks will appear here'
              }
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
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

export default TasksPage;