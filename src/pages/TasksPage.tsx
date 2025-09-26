import { useState } from "react";
import Navigation from "../components/Navigation";
import {
  CheckCircle,
  Clock,
  RotateCcw,
  AlertCircle,
  Calendar,
  Search,
  Plus,
  Edit3,
  CheckSquare,
} from "lucide-react";

type TaskStatus = "completed" | "in-progress" | "pending" | "blocked";
type TaskPriority = "high" | "medium" | "low";

const TasksPage = () => {
  // Hardcoded mock data for UI testing
  const tasks = [
    {
      id: 1,
      candidateTaskId: 1,
      title: "Complete Profile Setup",
      description: "Fill out your personal information, contact details, and emergency contacts in your employee profile.",
      status: "completed" as const,
      priority: "high" as const,
      category: "onboarding",
      dueDate: "2024-09-15",
      completedAt: "2024-09-10"
    },
    {
      id: 2,
      candidateTaskId: 2,
      title: "Review Employee Handbook",
      description: "Read through the complete employee handbook and acknowledge understanding of company policies and procedures.",
      status: "in-progress" as const,
      priority: "high" as const,
      category: "documentation",
      dueDate: "2024-09-20",
      completedAt: null
    },
    {
      id: 3,
      candidateTaskId: 3,
      title: "Submit Tax Documents",
      description: "Upload your W-4 form and any other required tax documentation for payroll setup.",
      status: "pending" as const,
      priority: "medium" as const,
      category: "hr",
      dueDate: "2024-09-25",
      completedAt: null
    },
    {
      id: 4,
      candidateTaskId: 4,
      title: "IT Equipment Setup",
      description: "Schedule a meeting with IT to receive your laptop, phone, and access credentials.",
      status: "pending" as const,
      priority: "high" as const,
      category: "it",
      dueDate: "2024-09-18",
      completedAt: null
    },
    {
      id: 5,
      candidateTaskId: 5,
      title: "Complete Security Training",
      description: "Complete the mandatory cybersecurity awareness training and pass the assessment.",
      status: "blocked" as const,
      priority: "medium" as const,
      category: "training",
      dueDate: "2024-09-30",
      completedAt: null
    },
    {
      id: 6,
      candidateTaskId: 6,
      title: "Meet Your Team",
      description: "Schedule introductory meetings with your direct team members and key stakeholders.",
      status: "pending" as const,
      priority: "low" as const,
      category: "social",
      dueDate: "2024-10-05",
      completedAt: null
    }
  ];

  const progress = {
    totalTasks: 6,
    completedTasks: 1,
    inProgressTasks: 1,
    overdueTasks: 0
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [localFilterStatus, setLocalFilterStatus] = useState("all");

  const updateTaskStatus = (candidateTaskId: number, status: string) => {
    console.log(`Updating task ${candidateTaskId} to status: ${status}`);
    // Mock function for UI testing
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocalFilterStatus("all");
  };

  // Get status badge component
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            COMPLETED
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            IN PROGRESS
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            PENDING
          </span>
        );
      case "blocked":
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3 mr-1" />
            BLOCKED
          </span>
        );
      default:
        return null;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  // Filter tasks based on store state and local filter
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      localFilterStatus === "all" || task.status === localFilterStatus;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Task statistics from store progress
  const taskStats = {
    total: progress.totalTasks,
    completed: progress.completedTasks,
    inProgress: progress.inProgressTasks,
    pending:
      progress.totalTasks - progress.completedTasks - progress.inProgressTasks,
    overdue: progress.overdueTasks,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Onboarding Tasks
          </h1>
          <p className="text-gray-600">
            Track and complete your onboarding tasks to get started
          </p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {taskStats.total}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {taskStats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {taskStats.inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {taskStats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {taskStats.overdue}
            </div>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "completed", "in-progress", "pending", "blocked"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setLocalFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                      localFilterStatus === status
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {status === "all"
                      ? "All Tasks"
                      : status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl shadow-sm border-l-4 ${getPriorityColor(
                task.priority
              )} border-t border-r border-b border-gray-100 p-6 hover:shadow-md transition duration-300`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  {/* Task Header */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mr-3">
                      {task.title}
                    </h3>
                    {getStatusBadge(task.status)}
                  </div>

                  {/* Task Description */}
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Task Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-2 w-2 bg-gray-300 rounded-full mr-2"></span>
                      <span className="capitalize">{task.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="capitalize">
                        {task.priority} Priority
                      </span>
                    </div>
                    {task.completedAt && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>
                          Completed:{" "}
                          {new Date(task.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                  {task.status === "completed" ? (
                    <button
                      onClick={() => task.candidateTaskId && updateTaskStatus(task.candidateTaskId, "pending")}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reopen Task
                    </button>
                  ) : task.status === "in-progress" ? (
                    <div className="flex gap-2">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Continue
                      </button>
                      <button
                        onClick={() => task.candidateTaskId && updateTaskStatus(task.candidateTaskId, "done")}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => task.candidateTaskId && updateTaskStatus(task.candidateTaskId, "in_progress")}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || localFilterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All your tasks will appear here"}
            </p>
            {(searchQuery || localFilterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLocalFilterStatus("all");
                  clearFilters();
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
