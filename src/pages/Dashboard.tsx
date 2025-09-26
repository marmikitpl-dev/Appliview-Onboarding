import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useDashboardStore, useAuthStore } from '../stores';
import { 
  Upload,
  Play,
  Eye,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  CheckSquare,
  FileText,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Hardcoded mock data for UI testing
  const candidateDashboard = {
    stats: {
      documents: {
        total: 8,
        submitted: 5,
        approved: 3,
        pending: 2
      },
      tasks: {
        total: 12,
        completed: 7,
        inProgress: 3,
        pending: 2
      },
      training: {
        total: 15,
        completed: 8,
        inProgress: 4,
        pending: 3
      }
    }
  };
  
  const isLoading = false;
  const error = null;

  // Calculate overall progress with safe navigation
  const overallProgress = candidateDashboard?.stats ? 
    Math.round(((candidateDashboard.stats.documents?.approved || 0) + 
                 (candidateDashboard.stats.tasks?.completed || 0) + 
                 (candidateDashboard.stats.training?.completed || 0)) / 
                Math.max(1, (candidateDashboard.stats.documents?.total || 0) + 
                 (candidateDashboard.stats.tasks?.total || 0) + 
                 (candidateDashboard.stats.training?.total || 0)) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state briefly, then continue with empty data
  if (error && !candidateDashboard) {
    console.warn('Dashboard error:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'John Smith'}!</h1>
              <p className="text-gray-600 mt-1">Let's continue your onboarding journey</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{overallProgress}% Complete</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Onboarding Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{width: `${overallProgress}%`}}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {candidateDashboard?.stats ? 
                  (candidateDashboard.stats.documents?.approved || 0) + 
                  (candidateDashboard.stats.tasks?.completed || 0) + 
                  (candidateDashboard.stats.training?.completed || 0) : 0}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {candidateDashboard?.stats ? 
                  ((candidateDashboard.stats.documents?.submitted || 0) - (candidateDashboard.stats.documents?.approved || 0)) +
                  ((candidateDashboard.stats.tasks?.total || 0) - (candidateDashboard.stats.tasks?.completed || 0)) +
                  ((candidateDashboard.stats.training?.total || 0) - (candidateDashboard.stats.training?.completed || 0)) : 0}
              </div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {candidateDashboard?.stats?.documents ? 
                  (candidateDashboard.stats.documents.total || 0) - (candidateDashboard.stats.documents.submitted || 0) : 0}
              </div>
              <div className="text-sm text-gray-700">Pending</div>
            </div>
          </div>
        </div>

        {/* Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tasks Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Tasks</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {candidateDashboard?.stats?.tasks ? `${candidateDashboard.stats.tasks.completed || 0}/${candidateDashboard.stats.tasks.total || 0}` : '0/0'}
                </div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{width: candidateDashboard?.stats?.tasks && candidateDashboard.stats.tasks.total > 0 ? `${((candidateDashboard.stats.tasks.completed || 0) / candidateDashboard.stats.tasks.total) * 100}%` : '0%'}}
                ></div>
              </div>
              <p className="text-sm text-green-600 font-medium flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {candidateDashboard?.stats?.tasks && (candidateDashboard.stats.tasks.completed || 0) === (candidateDashboard.stats.tasks.total || 0) ? 
                  'All tasks completed!' : 
                  `${candidateDashboard?.stats?.tasks ? (candidateDashboard.stats.tasks.total || 0) - (candidateDashboard.stats.tasks.completed || 0) : 0} tasks remaining`}
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition duration-200"
            >
              View Tasks →
            </button>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Documents</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {candidateDashboard?.stats?.documents ? `${candidateDashboard.stats.documents.submitted || 0}/${candidateDashboard.stats.documents.total || 0}` : '0/0'}
                </div>
                <div className="text-xs text-gray-500">submitted</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: candidateDashboard?.stats?.documents && candidateDashboard.stats.documents.total > 0 ? `${((candidateDashboard.stats.documents.submitted || 0) / candidateDashboard.stats.documents.total) * 100}%` : '0%'}}
                ></div>
              </div>
              <p className="text-sm text-orange-600 font-medium">
                {candidateDashboard?.stats?.documents ? `${(candidateDashboard.stats.documents.total || 0) - (candidateDashboard.stats.documents.submitted || 0)} documents remaining` : '0 documents remaining'}
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/documents')}
              className="w-full text-orange-600 hover:text-orange-700 font-medium text-sm py-2 hover:bg-orange-50 rounded-lg transition duration-200"
            >
              Upload Documents →
            </button>
          </div>

          {/* Training Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Training</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {candidateDashboard?.stats?.training ? `${candidateDashboard.stats.training.completed || 0}/${candidateDashboard.stats.training.total || 0}` : '0/0'}
                </div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{width: candidateDashboard?.stats?.training && candidateDashboard.stats.training.total > 0 ? `${((candidateDashboard.stats.training.completed || 0) / candidateDashboard.stats.training.total) * 100}%` : '0%'}}
                ></div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {candidateDashboard?.stats?.training && (candidateDashboard.stats.training.completed || 0) === 0 ? 
                  'Ready to start learning' : 
                  `${candidateDashboard?.stats?.training ? (candidateDashboard.stats.training.total || 0) - (candidateDashboard.stats.training.completed || 0) : 0} modules remaining`}
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/training')}
              className="w-full text-purple-600 hover:text-purple-700 font-medium text-sm py-2 hover:bg-purple-50 rounded-lg transition duration-200"
            >
              Start Training →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/documents')}
              className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition duration-200 group"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition duration-200">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-blue-700">Upload Documents</div>
                <div className="text-xs text-blue-600">Submit required forms</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/training')}
              className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition duration-200 group"
            >
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition duration-200">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-green-700">Start Training</div>
                <div className="text-xs text-green-600">Begin learning modules</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/tasks')}
              className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition duration-200 group"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition duration-200">
                <CheckSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-purple-700">View Tasks</div>
                <div className="text-xs text-purple-600">Check task status</div>
              </div>
            </button>

            <button className="flex items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition duration-200 group">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition duration-200">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-orange-700">Check Progress</div>
                <div className="text-xs text-orange-600">View detailed status</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckSquare className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Task Completed</div>
                  <div className="text-sm text-gray-600">Profile setup finished</div>
                </div>
                <div className="text-xs text-gray-500">2h ago</div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Document Uploaded</div>
                  <div className="text-sm text-gray-600">I9 Form submitted</div>
                </div>
                <div className="text-xs text-gray-500">1d ago</div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Account Created</div>
                  <div className="text-sm text-gray-600">Welcome to the team!</div>
                </div>
                <div className="text-xs text-gray-500">3d ago</div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Complete Training</div>
                  <div className="text-sm text-gray-600">10 modules remaining</div>
                </div>
                <div className="text-xs text-red-600 font-medium">Due in 7 days</div>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Submit Documents</div>
                  <div className="text-sm text-gray-600">7 forms pending</div>
                </div>
                <div className="text-xs text-yellow-600 font-medium">Due in 14 days</div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">First Day</div>
                  <div className="text-sm text-gray-600">Your official start date</div>
                </div>
                <div className="text-xs text-blue-600 font-medium">Sep 15, 2025</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
