# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in `lib/types` and import from there
- **API Calls:** Never make direct HTTP calls - use the service layer
- **Environment Variables:** Access only through config objects, never process.env directly
- **Error Handling:** All API routes must use the standard error handler
- **State Updates:** Never mutate state directly - use proper state management patterns

## Naming Conventions

| Element         | Frontend             | Backend    | Example             |
| --------------- | -------------------- | ---------- | ------------------- |
| Components      | PascalCase           | -          | `UserProfile.svelte`|
| Hooks           | camelCase with 'use' | -          | `useAuth.ts`        |
| API Routes      | -                    | kebab-case | `/api/user-profile` |
| Database Tables | -                    | snake_case | `user_profiles`     |
| Types/Interfaces| PascalCase           | PascalCase | `TaskStatus`        |
| Variables       | camelCase            | camelCase  | `taskId`            |
| Constants       | UPPER_SNAKE_CASE     | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Files           | kebab-case           | kebab-case | `task-service.ts`   |

## TypeScript Standards

### Strict Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Type Definitions
- Always define explicit return types for functions
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `unknown` over `any`
- Use type assertions sparingly with proper type guards

### Example Type Structure
```typescript
// src/lib/types/index.ts
export interface Task {
  id: string
  title: string
  status: TaskStatus
  // ... other properties
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface ApiResponse<T> {
  data: T
  success: boolean
  timestamp: string
}
```

## Svelte Component Standards

### Component Structure
```svelte
<script lang="ts">
  // 1. Imports (external libraries first, then local)
  import { createEventDispatcher } from 'svelte'
  import type { Task } from '$lib/types'
  
  // 2. Props (with defaults where appropriate)
  export let task: Task
  export let variant: 'default' | 'compact' = 'default'
  
  // 3. Event dispatcher
  const dispatch = createEventDispatcher<{
    click: { task: Task }
    delete: { taskId: string }
  }>()
  
  // 4. Reactive statements
  $: isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  
  // 5. Functions
  function handleClick() {
    dispatch('click', { task })
  }
</script>

<!-- Template with proper accessibility -->
<div
  class="card {variant === 'compact' ? 'card-compact' : ''}"
  class:overdue={isOverdue}
  on:click={handleClick}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
>
  <!-- Content -->
</div>

<style>
  /* Scoped styles using Tailwind utilities preferred */
  .overdue {
    @apply border-l-4 border-l-error;
  }
</style>
```

### Component Props
- Always type props explicitly
- Use `export let` syntax with TypeScript types
- Provide sensible defaults for optional props
- Document complex props with JSDoc comments

### Event Handling
- Use `createEventDispatcher` for parent communication
- Type event payloads explicitly
- Prefer semantic event names (`submit`, `cancel`, `delete`)

## CSS & Styling Standards

### DaisyUI + Tailwind Approach
- Prefer DaisyUI component classes over custom CSS
- Use Tailwind utilities for spacing, colors, typography
- Custom CSS only when DaisyUI/Tailwind insufficient
- Maintain responsive-first design approach

### Class Organization
```svelte
<!-- Preferred order: layout, spacing, colors, typography, effects -->
<div class="flex flex-col gap-4 p-6 bg-base-100 text-base-content rounded-lg shadow-lg">
  <!-- Content -->
</div>
```

## State Management Standards

### Svelte Stores
```typescript
// stores/tasks.ts
import { writable, derived } from 'svelte/store'
import type { Task } from '$lib/types'

// Core state
export const tasks = writable<Task[]>([])

// Derived state
export const tasksByStatus = derived(tasks, ($tasks) => {
  return {
    todo: $tasks.filter(t => t.status === 'todo'),
    'in-progress': $tasks.filter(t => t.status === 'in-progress'),
    done: $tasks.filter(t => t.status === 'done')
  }
})

// Actions
export const taskActions = {
  add: (task: Task) => tasks.update(prev => [...prev, task]),
  remove: (id: string) => tasks.update(prev => prev.filter(t => t.id !== id)),
  update: (id: string, updates: Partial<Task>) => 
    tasks.update(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
}
```

### State Update Patterns
- Never mutate store values directly
- Use functional updates with spread operators
- Keep derived state pure and performant
- Organize related actions together

## API & Service Standards

### Service Layer Structure
```typescript
// lib/services/task-service.ts
import type { Task, CreateTaskRequest } from '$lib/types'
import { apiClient } from './api-client'

export class TaskService {
  async getTasks(): Promise<Task[]> {
    try {
      return await apiClient.get<Task[]>('/tasks')
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      throw error
    }
  }
  
  async createTask(data: CreateTaskRequest): Promise<Task> {
    // Implementation with proper error handling
  }
}

export const taskService = new TaskService()
```

### Error Handling Patterns
- Always handle errors at service boundaries
- Use consistent error response format
- Log errors with appropriate context
- Provide user-friendly error messages

## Testing Standards

### Unit Test Structure
```typescript
// tests/unit/components/TaskCard.test.ts
import { render, fireEvent } from '@testing-library/svelte'
import TaskCard from '$lib/components/TaskCard.svelte'
import type { Task } from '$lib/types'

const mockTask: Task = {
  id: 'test-1',
  title: 'Test Task',
  // ... other required properties
}

describe('TaskCard', () => {
  test('renders task information', () => {
    const { getByText } = render(TaskCard, { task: mockTask })
    expect(getByText('Test Task')).toBeInTheDocument()
  })
  
  test('emits click event', async () => {
    // Test implementation
  })
})
```

### Testing Guidelines
- Test behavior, not implementation details
- Use meaningful test descriptions
- Mock external dependencies
- Maintain high test coverage for critical paths

## Performance Standards

### Bundle Optimization
- Use dynamic imports for large components
- Implement proper code splitting
- Optimize images and assets
- Monitor bundle size regularly

### Runtime Performance
- Avoid expensive computations in reactive statements
- Use derived stores for computed state
- Implement proper memoization where needed
- Profile performance in development

## Security Standards

### Input Validation
- Validate all user inputs on both client and server
- Sanitize data before displaying
- Use proper CSRF protection
- Implement rate limiting for APIs

### Data Security
- Never expose sensitive data to client
- Use environment variables for secrets
- Implement proper error handling without data leaks
- Follow OWASP security guidelines