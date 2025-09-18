# AppliView Onboarding Portal

A modern, responsive onboarding portal built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Login Page** - Secure authentication with modern design
- **Dashboard** - Progress overview and quick actions
- **Tasks Page** - Task management with filtering and search
- **Documents Page** - Document upload and management with drag & drop
- **Training Page** - Learning management system with modules

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Package Manager**: Yarn

## 📦 Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

4. Preview production build:
```bash
yarn preview
```

## 🎨 Design System

The project follows the design guidelines from the onboarding guide:

### Colors
- **Primary Blue**: #2563eb (#3b82f6 hover)
- **Indigo**: #4f46e5 (#6366f1 hover)
- **Success Green**: #16a34a (#15803d hover)
- **Warning Orange**: #ea580c (#dc2626 hover)
- **Error Red**: #dc2626 (#b91c1c hover)

### Typography
- **Primary Font**: Inter, system-ui, sans-serif
- **Monospace**: Monaco, Menlo, Ubuntu Mono, monospace

## 🔐 Demo Credentials

For testing the login functionality:
- **Email**: candidate@example.com
- **Password**: password

## 📁 Project Structure

```
src/
├── components/          # Shared components
│   └── Navigation.tsx   # Main navigation component
├── pages/              # Page components
│   ├── LoginPage.tsx   # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── TasksPage.tsx   # Task management
│   ├── DocumentsPage.tsx # Document management
│   └── TrainingPage.tsx # Training modules
├── App.tsx             # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🌟 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### Interactive Elements
- Animated progress bars
- Hover effects and transitions
- Real-time search and filtering
- Drag & drop file uploads

### Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🚀 Deployment

The project is configured for easy deployment to platforms like Netlify, Vercel, or any static hosting service.

1. Build the project:
```bash
yarn build
```

2. Deploy the `dist` folder to your hosting platform.

## 📋 Development Guidelines

- Use TypeScript for type safety
- Follow React functional components with hooks
- Implement proper error handling
- Use Tailwind utility classes for styling
- Maintain consistent component structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
