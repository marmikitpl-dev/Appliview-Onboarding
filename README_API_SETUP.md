# API Configuration Setup

This project has been configured to work with the Onboarding Suite Backend API. Here's how to set it up:

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Application Configuration
VITE_APP_NAME=Onboarding Portal
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true
```

## Backend API Requirements

The frontend expects the backend to be running on `http://localhost:8000` with the following endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user profile

### Dashboard
- `GET /api/v1/dashboard/candidate` - Get candidate dashboard data
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Documents
- `GET /api/v1/documents/templates` - Get document templates
- `GET /api/v1/documents/categories` - Get document categories
- `GET /api/v1/documents/submissions/me` - Get user's document submissions
- `POST /api/v1/documents/submissions` - Submit a document

### Tasks
- `GET /api/v1/tasks/` - Get task templates
- `GET /api/v1/candidate-tasks/me` - Get user's tasks
- `PUT /api/v1/candidate-tasks/{id}` - Update task status

### Training
- `GET /api/v1/training/modules` - Get training modules
- `GET /api/v1/training/progress/me` - Get user's training progress
- `PUT /api/v1/training/progress/{id}` - Update training progress

### Notifications
- `GET /api/v1/notifications/me` - Get user's notifications
- `PUT /api/v1/notifications/{id}/read` - Mark notification as read

## Key Features Implemented

### 1. Authentication System
- JWT token-based authentication
- Automatic token refresh handling
- Persistent login state
- Role-based access control

### 2. Document Management
- Document template selection
- File upload with progress tracking
- Document status tracking (submitted, approved, rejected)
- Category-based organization

### 3. Task Management
- Task status updates (pending, in-progress, done)
- Real-time progress tracking
- Due date management
- Task completion tracking

### 4. Training System
- Training module progress tracking
- Status updates (not-started, in-progress, completed)
- Completion percentage tracking
- Category-based filtering

### 5. Dashboard
- Real-time progress statistics
- Activity tracking
- Notification management
- Overall completion percentage

## Data Flow

1. **Authentication**: User logs in → JWT token stored → All API calls include token
2. **Data Loading**: Components load → API calls made → Data stored in Zustand stores
3. **User Actions**: User interacts → API calls made → Local state updated
4. **Real-time Updates**: Data refreshed automatically after actions

## Error Handling

- Network errors are caught and displayed to users
- Authentication errors redirect to login
- Form validation errors are shown inline
- Loading states are managed throughout the app

## Development Notes

- All API calls are centralized in `src/services/api.ts`
- State management uses Zustand with persistence
- TypeScript interfaces match backend API documentation
- Error handling is consistent across all components
- Loading states provide good UX during API calls

## Testing the Integration

1. Start the backend server on `http://localhost:8000`
2. Update the `VITE_API_BASE_URL` in your environment file
3. Start the frontend with `npm run dev`
4. Login with valid credentials from your backend
5. Test document upload, task completion, and training progress

The frontend will automatically handle authentication, data loading, and user interactions with the backend API.
