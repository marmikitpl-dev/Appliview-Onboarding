import { useState } from "react";
import Navigation from "../components/Navigation";
import {
  Play,
  Clock,
  Star,
  Calendar,
  Search,
  Brain,
  Shield,
  AlertTriangle,
  Heart,
  DollarSign,
  Users,
  Target,
  GraduationCap,
  Building,
} from "lucide-react";

interface TrainingModule {
  id: number;
  name: string;
  description: string;
  duration: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  rating: number;
  enrolledUsers: number;
  icon: React.ComponentType<any>;
  tags: string[];
  estimatedCompletion: string;
}

const TrainingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hardcoded mock data for UI testing
  const modules: TrainingModule[] = [
    {
      id: 1,
      name: "Company Orientation",
      description: "Learn about our company history, mission, values, and organizational structure",
      duration: "1 hr",
      category: "Onboarding",
      difficulty: "Beginner",
      status: "completed",
      progress: 100,
      rating: 4.8,
      enrolledUsers: 1250,
      icon: Building,
      tags: ["Required", "New Hire"],
      estimatedCompletion: "2024-09-10"
    },
    {
      id: 2,
      name: "Risk Assessment",
      description: "Understanding workplace risks and safety procedures for a secure work environment",
      duration: "1 hr",
      category: "Onboarding",
      difficulty: "Beginner",
      status: "in-progress",
      progress: 65,
      rating: 4.6,
      enrolledUsers: 980,
      icon: AlertTriangle,
      tags: ["Required", "Safety"],
      estimatedCompletion: "2024-09-15"
    },
    {
      id: 3,
      name: "Cybersecurity Fundamentals",
      description: "Essential cybersecurity practices, threat awareness, and data protection protocols",
      duration: "2 hrs",
      category: "Security",
      difficulty: "Intermediate",
      status: "not-started",
      progress: 0,
      rating: 4.9,
      enrolledUsers: 1100,
      icon: Shield,
      tags: ["Required", "Security"],
      estimatedCompletion: "2024-09-20"
    },
    {
      id: 4,
      name: "Security Awareness",
      description: "Advanced security protocols and best practices for information protection",
      duration: "1 hr",
      category: "Security",
      difficulty: "Intermediate",
      status: "not-started",
      progress: 0,
      rating: 4.7,
      enrolledUsers: 850,
      icon: Shield,
      tags: ["Required", "Security"],
      estimatedCompletion: "2024-09-20"
    },
    {
      id: 5,
      name: "Health & Wellness",
      description: "Employee wellness programs, mental health resources, and work-life balance",
      duration: "45 min",
      category: "Wellness",
      difficulty: "Beginner",
      status: "not-started",
      progress: 0,
      rating: 4.5,
      enrolledUsers: 720,
      icon: Heart,
      tags: ["Optional", "Wellness"],
      estimatedCompletion: "2024-09-25"
    },
    {
      id: 6,
      name: "Financial Planning",
      description: "Understanding benefits, retirement planning, and financial wellness resources",
      duration: "1.5 hrs",
      category: "Benefits",
      difficulty: "Intermediate",
      status: "not-started",
      progress: 0,
      rating: 4.4,
      enrolledUsers: 650,
      icon: DollarSign,
      tags: ["Optional", "Benefits"],
      estimatedCompletion: "2024-09-30"
    }
  ];

  const updateModuleProgress = (moduleId: number, status: string, progress: number) => {
    console.log(`Updating module ${moduleId} to status: ${status}, progress: ${progress}%`);
  };


  const categories = [
    "All Categories",
    "Onboarding",
    "Compliance",
    "Technical Skills",
    "Soft Skills",
  ];

  // Get difficulty badge
  const getDifficultyBadge = (difficulty: TrainingModule["difficulty"]) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty]}`}
      >
        {difficulty}
      </span>
    );
  };

  // Filter modules
  const filteredModules = modules.filter((module) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      module.category === selectedCategory;
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Training statistics
  const trainingStats = {
    total: modules.length,
    notStarted: modules.filter((m) => m.status === "not-started").length,
    inProgress: modules.filter((m) => m.status === "in-progress").length,
    completed: modules.filter((m) => m.status === "completed").length,
    totalHours: modules.reduce((acc, module) => {
      const hours = parseFloat(module.duration.match(/[\d.]+/)![0]);
      return acc + hours;
    }, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Training Modules
          </h1>
          <p className="text-gray-600">
            Enhance your skills with our comprehensive training programs
          </p>
        </div>

        {/* Training Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
              <p className="text-blue-100">
                Complete your training to unlock new opportunities
              </p>
            </div>
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{trainingStats.total}</div>
              <div className="text-sm text-blue-100">Total Modules</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-ce nter">
              <div className="text-2xl font-bold">
                {trainingStats.totalHours.toFixed(1)}h
              </div>
              <div className="text-sm text-blue-100">Total Duration</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-blue-100">Completion</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-blue-100">Certificates</div>
            </div>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {trainingStats.notStarted}
            </div>
            <div className="text-sm text-gray-600">Not Started</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {trainingStats.inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {trainingStats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
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
                  placeholder="Search training modules..."
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
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300 group"
              >
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-200 transition duration-200">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition duration-200">
                        {module.name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    NOT STARTED
                  </span>
                </div>

                {/* Module Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {module.description}
                </p>

                {/* Module Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getDifficultyBadge(module.difficulty)}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {module.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{module.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {module.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        tag === "Required"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Module Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>
                      {module.enrolledUsers.toLocaleString()} enrolled
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Due: {module.estimatedCompletion}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => {
                    if (module.status === 'not-started') {
                      updateModuleProgress(module.id, 'in_progress', 0);
                    } else if (module.status === 'in-progress') {
                      updateModuleProgress(module.id, 'completed', 100);
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center group"
                >
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition duration-200" />
                  {module.status === 'not-started' ? 'Start Module' : 
                   module.status === 'in-progress' ? 'Mark Complete' : 'Completed'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No training modules found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "All Categories"
                ? "Try adjusting your search or filter criteria"
                : "Training modules will appear here"}
            </p>
            {(searchTerm || selectedCategory !== "All Categories") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Learning Path Suggestion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Learning Path
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            We recommend starting with the required onboarding modules, then
            progressing to technical skills based on your role.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              1. Required Modules (4 modules)
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              2. Role-Specific Training (3 modules)
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              3. Advanced Skills (3 modules)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;
