# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in `lib/types` and import from there
- **Validation:** Use Zod schemas for all data validation - forms, API endpoints, and store actions
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
- Use Zod schemas for runtime validation with automatic TypeScript type inference
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer `unknown` over `any`
- Use type assertions sparingly with proper type guards
- Define validation schemas in `src/lib/types/schemas.ts` alongside type definitions

### Example Type Structure with Zod
```typescript
// src/lib/types/schemas.ts
import { z } from 'zod'

export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'done'])
export const PrioritySchema = z.enum(['high', 'medium', 'low'])

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long'),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  dueDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  aiGenerated: z.boolean(),
  originalPrompt: z.string().nullable()
})

export const CreateTaskSchema = TaskSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const UpdateTaskSchema = TaskSchema.partial().required({ id: true })

// Export inferred types
export type Task = z.infer<typeof TaskSchema>
export type TaskStatus = z.infer<typeof TaskStatusSchema>
export type Priority = z.infer<typeof PrioritySchema>
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>
```

```typescript
// src/lib/types/index.ts - Re-export for convenience
export * from './schemas'
```

## Svelte Component Standards

### Component Development Checklist
**REQUIRED for every UI component:**
1. ✅ **Component Implementation** - The `.svelte` file with proper TypeScript
2. ✅ **Storybook Stories** - Interactive documentation and testing (`.stories.svelte`)
3. ✅ **Unit Tests** - Automated testing for component logic
4. ✅ **JSDoc Documentation** - Clear usage guidelines

**Storybook Story Creation:**
- Use `yarn create-story src/lib/components/path/Component.svelte` to auto-generate
- Every component MUST have comprehensive stories showing all variants and states
- Stories serve as interactive documentation and visual testing

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

// Actions with Zod validation
export const taskActions = {
  add: (task: CreateTaskRequest) => {
    const validated = CreateTaskSchema.parse(task)
    const newTask = TaskSchema.parse({
      ...validated,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    tasks.update(prev => [...prev, newTask])
  },
  remove: (id: string) => tasks.update(prev => prev.filter(t => t.id !== id)),
  update: (id: string, updates: UpdateTaskRequest) => {
    const validated = UpdateTaskSchema.parse({ ...updates, id })
    tasks.update(prev => prev.map(t => t.id === id ? { ...t, ...validated, updatedAt: new Date() } : t))
  }
}
```

### State Update Patterns
- Never mutate store values directly
- Use functional updates with spread operators
- Keep derived state pure and performant
- Organize related actions together

## API & Service Standards

### Service Layer Structure with Zod Validation
```typescript
// lib/services/task-service.ts
import { TaskSchema, CreateTaskSchema, type Task, type CreateTaskRequest } from '$lib/types'
import { apiClient } from './api-client'
import { ZodError } from 'zod'

export class TaskService {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>('/tasks')
      // Validate response data
      return response.map(task => TaskSchema.parse(task))
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Invalid task data received:', error.errors)
      }
      console.error('Failed to fetch tasks:', error)
      throw error
    }
  }
  
  async createTask(data: CreateTaskRequest): Promise<Task> {
    try {
      // Validate input data
      const validatedData = CreateTaskSchema.parse(data)
      const response = await apiClient.post<Task>('/tasks', validatedData)
      // Validate response data
      return TaskSchema.parse(response)
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation failed:', error.errors)
        throw new Error(`Invalid task data: ${error.errors.map(e => e.message).join(', ')}`)
      }
      console.error('Failed to create task:', error)
      throw error
    }
  }
}

export const taskService = new TaskService()
```

### Zod Validation Standards

**Schema Organization:**
- Define all schemas in `src/lib/types/schemas.ts`
- Use descriptive schema names ending with "Schema" (e.g., `TaskSchema`)
- Export both schemas and inferred types from the same file
- Group related schemas together

**Validation Points:**
- **Forms**: Validate user input before submission
- **API Endpoints**: Validate request/response data
- **Store Actions**: Validate data before state updates
- **Service Layer**: Validate external API responses

**Error Handling:**
- Catch `ZodError` specifically and format user-friendly messages
- Use Zod's built-in error formatting for form validation
- Log detailed validation errors for debugging
- Provide specific field-level error feedback in UI components

**Schema Patterns:**
```typescript
// Base schema
export const TaskSchema = z.object({...})

// Derived schemas for different use cases
export const CreateTaskSchema = TaskSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateTaskSchema = TaskSchema.partial().required({ id: true })
export const TaskQuerySchema = z.object({ status: TaskStatusSchema.optional() })
```

### Error Handling Patterns
- Always handle errors at service boundaries
- Use consistent error response format with Zod validation errors
- Log errors with appropriate context including validation details
- Provide user-friendly error messages from Zod error formatting

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

### Zod Schema Testing
```typescript
// tests/unit/types/schemas.test.ts
import { TaskSchema, CreateTaskSchema, UpdateTaskSchema } from '$lib/types/schemas'

describe('TaskSchema', () => {
  test('validates valid task data', () => {
    const validTask = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiGenerated: false,
      originalPrompt: null
    }
    
    expect(() => TaskSchema.parse(validTask)).not.toThrow()
  })
  
  test('rejects invalid task data', () => {
    const invalidTask = { title: '', status: 'invalid' }
    expect(() => TaskSchema.parse(invalidTask)).toThrow()
  })
  
  test('provides meaningful error messages', () => {
    try {
      TaskSchema.parse({ title: '' })
    } catch (error) {
      expect(error.errors[0].message).toContain('Title is required')
    }
  })
})
```

### Testing Guidelines
- Test behavior, not implementation details
- Use meaningful test descriptions
- Mock external dependencies
- Test Zod schema validation with both valid and invalid data
- Verify error messages are user-friendly
- Test schema composition (omit, partial, etc.)
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