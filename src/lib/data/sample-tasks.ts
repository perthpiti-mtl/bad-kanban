import type { Task } from '$lib/types'

/**
 * Sample task data for demonstration and testing purposes
 * Includes realistic content with various priorities, statuses, and use cases
 */
export const sampleTasks: Task[] = [
  // TODO Tasks
  {
    id: 'task-001',
    title: 'Implement user authentication system',
    description: 'Design and develop a comprehensive user authentication system with login, registration, password reset, and JWT token management. Include proper validation and security measures.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2025-08-20'),
    createdAt: new Date('2025-08-10'),
    updatedAt: new Date('2025-08-10'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-002',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing, building, and deployment pipeline using GitHub Actions. Include test coverage reporting and deployment to staging/production environments.',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2025-08-25'),
    createdAt: new Date('2025-08-09'),
    updatedAt: new Date('2025-08-09'),
    aiGenerated: true,
    originalPrompt: 'Create a task for setting up continuous integration and deployment'
  },
  {
    id: 'task-003',
    title: 'Update project documentation',
    description: 'Review and update README, API docs, and deployment guides to reflect recent changes.',
    status: 'todo',
    priority: 'low',
    dueDate: null,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-004',
    title: 'Design mobile-responsive navigation',
    description: 'Create a responsive navigation component that works seamlessly across desktop, tablet, and mobile devices. Include hamburger menu for mobile and proper touch targets.',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2025-08-18'),
    createdAt: new Date('2025-08-11'),
    updatedAt: new Date('2025-08-11'),
    aiGenerated: true,
    originalPrompt: 'Generate a task for creating mobile-friendly navigation'
  },
  
  // IN PROGRESS Tasks
  {
    id: 'task-005',
    title: 'Optimize database queries for performance',
    description: 'Analyze and optimize slow database queries identified in the performance audit. Add proper indexing, refactor complex joins, and implement query caching where appropriate.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2025-08-15'),
    createdAt: new Date('2025-08-07'),
    updatedAt: new Date('2025-08-11'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-006',
    title: 'Integrate third-party payment gateway',
    description: 'Implement Stripe payment processing with support for credit cards, webhooks for payment confirmation, and proper error handling for failed transactions.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2025-08-22'),
    createdAt: new Date('2025-08-05'),
    updatedAt: new Date('2025-08-10'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-007',
    title: 'Implement real-time notifications',
    description: 'Build a notification system using WebSockets to provide users with real-time updates on important events, status changes, and system messages.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date('2025-08-30'),
    createdAt: new Date('2025-08-06'),
    updatedAt: new Date('2025-08-11'),
    aiGenerated: true,
    originalPrompt: 'Create a task for adding real-time notifications to the application'
  },
  
  // DONE Tasks
  {
    id: 'task-008',
    title: 'Set up development environment',
    description: 'Configure local development environment with proper tooling, linting, formatting, and testing setup. Document the setup process for new team members.',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-05'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-009',
    title: 'Create initial project structure',
    description: 'Establish the foundational project structure with proper folder organization, configuration files, and basic routing setup.',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-03'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-010',
    title: 'Design color scheme and typography',
    description: 'Define the visual design system including color palette, typography scale, spacing system, and component styling guidelines using Tailwind CSS and DaisyUI.',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: new Date('2025-08-02'),
    updatedAt: new Date('2025-08-04'),
    aiGenerated: true,
    originalPrompt: 'Generate a task for creating the design system'
  },
  {
    id: 'task-011',
    title: 'Conduct security audit',
    description: 'Perform comprehensive security review of authentication, data validation, and API endpoints. Generate report with findings and recommendations.',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: new Date('2025-08-03'),
    updatedAt: new Date('2025-08-07'),
    aiGenerated: false,
    originalPrompt: null
  },
  {
    id: 'task-012',
    title: 'Write unit tests for utility functions',
    description: 'Create comprehensive unit tests for all utility functions in the utils directory, ensuring edge cases are covered and maintaining high code coverage.',
    status: 'done',
    priority: 'low',
    dueDate: null,
    createdAt: new Date('2025-08-04'),
    updatedAt: new Date('2025-08-08'),
    aiGenerated: true,
    originalPrompt: 'Create a task for writing tests for utility functions'
  }
]