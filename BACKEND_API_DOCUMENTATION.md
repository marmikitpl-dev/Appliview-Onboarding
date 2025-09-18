# Onboarding Suite Backend API Documentation

## Overview

The Onboarding Suite is a FastAPI-based backend system designed to manage employee onboarding processes. It provides comprehensive APIs for user management, document handling, task assignment, training modules, and notifications.

**Base URL:** `http://localhost:8000/api/v1`

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Dashboard APIs](#dashboard-apis)
4. [Document Management](#document-management)
5. [Task Management](#task-management)
6. [Training Management](#training-management)
7. [Notifications](#notifications)
8. [Data Models](#data-models)
9. [Error Handling](#error-handling)
10. [Environment Configuration](#environment-configuration)

## Authentication

### JWT Bearer Token Authentication

All API endpoints (except `/healthz` and `/test-db`) require JWT authentication.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

### Login Endpoint

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

## User Management

### User Roles

- `candidate`: End users going through onboarding
- `hr`: HR personnel who manage candidates
- `admin`: System administrators with full access

### Endpoints

#### Get Current User
**GET** `/users/me`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "candidate",
  "org_id": 1,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create User
**POST** `/users/`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "full_name": "New User",
  "password": "tempPassword123",
  "role": "candidate",
  "org_id": 1,
  "notification_options": {
    "send_invite": true,
    "login_url": "http://localhost:5173"
  }
}
```

#### List Users
**GET** `/users/`

**Required Role:** HR or Admin

- Admin users see all users
- HR users see HR/admin users + candidates they created

#### Get User by ID
**GET** `/users/{user_id}`

**Access Control:**
- Users can access their own profile
- Admin can access any user
- HR can access candidates they created

#### Update User
**PUT** `/users/{user_id}`

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "is_active": true
}
```

#### List Users with Progress
**GET** `/users/with-progress`

**Required Role:** HR or Admin

Returns users with calculated progress percentages based on completed documents, tasks, and training.

## Dashboard APIs

### Candidate Dashboard
**GET** `/dashboard/candidate`

**Required Role:** Candidate

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "candidate@example.com",
    "full_name": "John Doe",
    "role": "candidate",
    "profile_complete": true
  },
  "stats": {
    "documents": {
      "total": 5,
      "submitted": 4,
      "approved": 3
    },
    "tasks": {
      "total": 8,
      "completed": 6
    },
    "training": {
      "total": 3,
      "completed": 2
    },
    "notifications": 5
  },
  "recent_activity": [
    {
      "id": 1,
      "title": "Document Approved",
      "message": "Your W-4 form has been approved.",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Admin/HR Dashboard Stats
**GET** `/dashboard/stats`

**Required Role:** HR or Admin

**Response:**
```json
{
  "candidates": {
    "total": 25,
    "active": 23,
    "completed": 85.5
  },
  "documents": {
    "total": 120,
    "pending": 15,
    "approved": 95,
    "rejected": 10
  },
  "tasks": {
    "total": 200,
    "assigned": 50,
    "completed": 150
  },
  "training": {
    "total": 75,
    "assigned": 25,
    "completed": 50
  },
  "recent_activity": [...]
}
```

### Document Trends
**GET** `/dashboard/document-trends`

**Required Role:** HR or Admin

Returns document submission trends over the last 6 months.

### Onboarding Progress
**GET** `/dashboard/onboarding-progress`

**Required Role:** HR or Admin

Returns candidate distribution across completion stages (0-25%, 26-50%, etc.).

## Document Management

### Document Categories

#### Create Category
**POST** `/documents/categories`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "name": "Tax Documents",
  "description": "Tax-related forms and documents",
  "org_id": 1
}
```

#### List Categories
**GET** `/documents/categories`

#### Get Category
**GET** `/documents/categories/{category_id}`

### Document Templates

#### Create Template
**POST** `/documents/templates`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "name": "W-4 Form",
  "description": "Employee's Withholding Certificate",
  "required_for_role": "candidate",
  "org_id": 1,
  "category_id": 1
}
```

#### List Templates
**GET** `/documents/templates`

#### Get Template
**GET** `/documents/templates/{template_id}`

### Document Submissions

#### Submit Document
**POST** `/documents/submissions`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `template_id`: Integer
- `file`: File upload

#### List My Submissions (Candidate)
**GET** `/documents/submissions/me`

#### List All Submissions (HR/Admin)
**GET** `/documents/submissions`

**Query Parameters:**
- `status`: Filter by status (submitted, approved, rejected)
- `candidate_id`: Filter by candidate

#### Review Document
**PUT** `/documents/submissions/{submission_id}/review`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Document looks good"
}
```

#### Download Document
**GET** `/documents/submissions/{submission_id}/download`

### Candidate Document Templates

#### Assign Templates to Candidate
**POST** `/documents/candidate-templates`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "candidate_user_id": 1,
  "template_assignments": [
    {
      "template_id": 1,
      "category_id": null,
      "use_all_defaults": false
    }
  ]
}
```

#### Get Candidate's Required Documents
**GET** `/documents/candidate-templates/{candidate_id}`

## Task Management

### Onboarding Tasks

#### Create Task Template
**POST** `/tasks/`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "title": "Complete Emergency Contact Form",
  "description": "Provide emergency contact information",
  "due_days_from_start": 3,
  "assignee_role": "candidate",
  "org_id": 1
}
```

#### List Task Templates
**GET** `/tasks/`

### Candidate Tasks

#### Get My Tasks (Candidate)
**GET** `/candidate-tasks/me`

**Response:**
```json
[
  {
    "id": 1,
    "candidate_user_id": 1,
    "task_id": 1,
    "status": "pending",
    "due_date": "2024-01-05",
    "completed_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "task": {
      "title": "Complete Emergency Contact Form",
      "description": "Provide emergency contact information"
    }
  }
]
```

#### Assign Task to Candidate
**POST** `/candidate-tasks/`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "candidate_user_id": 1,
  "task_id": 1,
  "due_date": "2024-01-05"
}
```

#### Update Task Status
**PUT** `/candidate-tasks/{task_id}`

**Request Body:**
```json
{
  "status": "done"
}
```

### Candidate Task Templates

#### Assign Task Templates to Candidate
**POST** `/tasks/candidate-templates`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "candidate_user_id": 1,
  "task_assignments": [
    {
      "task_id": 1,
      "use_all_defaults": false
    }
  ]
}
```

## Training Management

### Training Modules

#### Create Training Module
**POST** `/training/modules`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "title": "Security Awareness Training",
  "description": "Learn about company security policies",
  "content_url": "https://training.example.com/security",
  "duration_minutes": 60,
  "org_id": 1
}
```

#### List Training Modules
**GET** `/training/modules`

### Training Progress

#### Get My Training Progress (Candidate)
**GET** `/training/progress/me`

#### Assign Training to Candidate
**POST** `/training/assignments`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "candidate_user_id": 1,
  "module_id": 1,
  "due_date": "2024-01-10"
}
```

#### Update Training Progress
**PUT** `/training/progress/{progress_id}`

**Request Body:**
```json
{
  "status": "completed",
  "completion_percentage": 100
}
```

## Notifications

### Send Notification
**POST** `/notifications/send`

**Required Role:** HR or Admin

**Request Body:**
```json
{
  "recipient_id": 1,
  "title": "Welcome to the Company",
  "message": "Welcome! Please complete your onboarding tasks.",
  "notification_type": "general"
}
```

### Get My Notifications
**GET** `/notifications/me`

**Query Parameters:**
- `is_read`: Filter by read status
- `limit`: Number of notifications to return

### Mark Notification as Read
**PUT** `/notifications/{notification_id}/read`

### Notification Templates

#### Create Template
**POST** `/notifications/templates`

**Required Role:** HR or Admin

#### List Templates
**GET** `/notifications/templates`

## Data Models

### User Model
```typescript
interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'candidate' | 'hr' | 'admin';
  org_id: number | null;
  is_active: boolean;
  created_at: string;
}
```

### Document Models
```typescript
interface DocumentTemplate {
  id: number;
  name: string;
  description: string | null;
  required_for_role: string | null;
  org_id: number;
  category_id: number | null;
}

interface DocumentSubmission {
  id: number;
  candidate_user_id: number;
  template_id: number;
  file_path: string;
  status: 'submitted' | 'approved' | 'rejected';
  notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

interface DocumentCategory {
  id: number;
  name: string;
  description: string | null;
  org_id: number;
}
```

### Task Models
```typescript
interface OnboardingTask {
  id: number;
  title: string;
  description: string | null;
  due_days_from_start: number;
  assignee_role: 'candidate' | 'hr' | 'manager';
  org_id: number;
}

interface CandidateTask {
  id: number;
  candidate_user_id: number;
  task_id: number;
  status: 'pending' | 'in_progress' | 'done';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}
```

### Training Models
```typescript
interface TrainingModule {
  id: number;
  title: string;
  description: string | null;
  content_url: string | null;
  duration_minutes: number | null;
  org_id: number;
}

interface TrainingProgress {
  id: number;
  candidate_user_id: number;
  module_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  due_date: string | null;
}
```

### Notification Models
```typescript
interface NotificationLog {
  id: number;
  recipient_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationTemplate {
  id: number;
  name: string;
  subject: string;
  body_template: string;
  notification_type: string;
  org_id: number;
}
```

## Error Handling

### Standard Error Response
```json
{
  "detail": "Error message description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `422`: Unprocessable Entity (validation errors)
- `500`: Internal Server Error

### Role-Based Access Control

**Admin Role:**
- Full access to all endpoints
- Can manage all users, documents, tasks, and training
- Can view organization-wide statistics

**HR Role:**
- Can create and manage candidates they created
- Can assign documents, tasks, and training to their candidates
- Can view statistics for their candidates only
- Cannot access other HR users' candidates

**Candidate Role:**
- Can view and update their own profile
- Can submit documents and update task status
- Can view their own progress and notifications
- Cannot access administrative functions

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/onboarding_db

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=43200

# File Storage
FILE_STORAGE_DIR=/path/to/file/storage

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@onboardingsuite.com
EMAIL_FROM_NAME=Onboarding Suite
USE_TLS=True

# Notification Settings
ENABLE_EMAIL_NOTIFICATIONS=True
NOTIFICATION_SEND_RETRY_ATTEMPTS=3
NOTIFICATION_SEND_RETRY_DELAY=60

# Environment
ENV=development
```

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (web-candidate)
- `http://localhost:5174` (web-admin)
- `http://127.0.0.1:5173` (web-candidate alternative)
- `http://127.0.0.1:5174` (web-admin alternative)

## Integration Examples

### Frontend Authentication Flow

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
};

// Authenticated API call
const fetchUserProfile = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

### File Upload Example

```typescript
const uploadDocument = async (templateId: number, file: File) => {
  const formData = new FormData();
  formData.append('template_id', templateId.toString());
  formData.append('file', file);
  
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/v1/documents/submissions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
};
```

### WebSocket Integration

The backend supports real-time notifications through WebSocket connections. Connect to `/ws/notifications/{user_id}` with proper authentication.

## API Testing

### Health Check
**GET** `/healthz`

Returns `{"status": "ok"}` - no authentication required.

### Database Test
**GET** `/test-db`

Tests database connectivity and returns table information - no authentication required.

---

## Notes for Frontend Development

1. **Authentication**: Always include the JWT token in the Authorization header for protected endpoints.

2. **Role-Based UI**: Implement different UI components based on user roles (candidate, hr, admin).

3. **File Handling**: Use FormData for file uploads and handle file downloads with proper content disposition.

4. **Error Handling**: Implement proper error handling for all HTTP status codes.

5. **Real-time Updates**: Consider implementing WebSocket connections for real-time notifications.

6. **Pagination**: Some endpoints may return large datasets - implement pagination where needed.

7. **Validation**: Implement client-side validation that matches the backend schema validation.

8. **Progress Tracking**: Use the dashboard APIs to show user progress and statistics.

This documentation provides a comprehensive guide for integrating with the Onboarding Suite backend API. For additional details or clarifications, refer to the OpenAPI documentation available at `/docs` when the server is running.
