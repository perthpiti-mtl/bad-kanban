# Testing Strategy

## Testing Pyramid

```
                  E2E Tests (Playwright)
                 /                    \
            Integration Tests (Vitest API)
               /                        \
          Frontend Unit Tests    Backend Unit Tests
             (Vitest)               (Vitest)
```

## Test Organization

### Frontend Tests

```
tests/unit/
├── components/
│   ├── KanbanBoard.test.ts
│   ├── TaskCard.test.ts
│   └── AITaskCreator.test.ts
├── stores/
│   ├── tasks.test.ts
│   └── ui.test.ts
└── services/
    ├── api.test.ts
    └── task-service.test.ts
```

### Backend Tests

```
tests/integration/
├── api/
│   ├── tasks.test.ts
│   └── ai.test.ts
└── services/
    ├── task-service.test.ts
    └── ai-service.test.ts
```

### E2E Tests

```
tests/e2e/
├── kanban-basic.spec.ts      # Core Kanban functionality
├── ai-features.spec.ts       # AI task creation and search
├── responsive.spec.ts        # Mobile and tablet testing
└── accessibility.spec.ts     # A11y compliance testing
```

## Testing Frameworks

### Unit & Integration Testing - Vitest
- **Fast execution**: Vite-native testing with excellent TypeScript support
- **Modern features**: Built-in mocking, snapshots, and coverage reporting
- **SvelteKit integration**: Native support for SvelteKit project structure

### E2E Testing - Playwright
- **Cross-browser support**: Tests run on Chrome, Firefox, Safari, and Edge
- **Mobile testing**: Responsive design testing with device emulation
- **Reliable interactions**: Auto-waiting and retry mechanisms for stable tests

### Component Testing - Svelte Testing Library
- **Behavior-focused**: Test component behavior rather than implementation details
- **Accessibility support**: Built-in accessibility testing utilities
- **Event simulation**: Realistic user interaction testing

## Test Examples

### Frontend Component Test

```typescript
// tests/unit/components/TaskCard.test.ts
import { render, fireEvent } from '@testing-library/svelte'
import TaskCard from '$lib/components/kanban/TaskCard.svelte'
import type { Task } from '$lib/types'

const mockTask: Task = {
	id: 'test-1',
	title: 'Test Task',
	description: 'Test Description',
	status: 'todo',
	priority: 'medium',
	dueDate: null,
	createdAt: '2025-08-11T10:00:00Z',
	updatedAt: '2025-08-11T10:00:00Z',
	aiGenerated: false,
	originalPrompt: null
}

test('TaskCard renders task information', () => {
	const { getByText } = render(TaskCard, { task: mockTask })

	expect(getByText('Test Task')).toBeInTheDocument()
	expect(getByText('Test Description')).toBeInTheDocument()
})

test('TaskCard emits click event', async () => {
	const { component, container } = render(TaskCard, { task: mockTask })

	let clickedTask: Task | null = null
	component.$on('click', (event) => {
		clickedTask = event.detail.task
	})

	await fireEvent.click(container.querySelector('.card'))
	expect(clickedTask).toEqual(mockTask)
})
```

### Backend API Test

```typescript
// tests/integration/api/tasks.test.ts
import { expect, test, beforeEach } from 'vitest'
import { taskService } from '$lib/server/services/task-service'

beforeEach(() => {
	// Clear test data
	taskService.clearAll()
})

test('POST /api/tasks creates new task', async () => {
	const taskData = {
		title: 'New Task',
		description: 'Task description',
		priority: 'high' as const
	}

	const task = await taskService.createTask(taskData)

	expect(task.id).toBeDefined()
	expect(task.title).toBe('New Task')
	expect(task.status).toBe('todo')
	expect(task.createdAt).toBeDefined()
})

test('GET /api/tasks filters by status', async () => {
	// Create test tasks
	await taskService.createTask({ title: 'Todo Task', status: 'todo' })
	await taskService.createTask({ title: 'Done Task', status: 'done' })

	const todoTasks = await taskService.getTasks({ status: 'todo' })
	const doneTasks = await taskService.getTasks({ status: 'done' })

	expect(todoTasks).toHaveLength(1)
	expect(doneTasks).toHaveLength(1)
	expect(todoTasks[0].title).toBe('Todo Task')
	expect(doneTasks[0].title).toBe('Done Task')
})
```

### E2E Test

```typescript
// tests/e2e/kanban-basic.spec.ts
import { test, expect } from '@playwright/test'

test('user can create and move tasks', async ({ page }) => {
	await page.goto('/')

	// Create new task
	await page.click('[data-testid="add-task-btn"]')
	await page.fill('[data-testid="task-title"]', 'E2E Test Task')
	await page.fill('[data-testid="task-description"]', 'Created by E2E test')
	await page.click('[data-testid="save-task"]')

	// Verify task appears in To Do column
	await expect(page.locator('[data-testid="todo-column"] .task-card')).toContainText(
		'E2E Test Task'
	)

	// Drag task to In Progress
	await page.dragAndDrop(
		'[data-testid="todo-column"] .task-card',
		'[data-testid="in-progress-column"]'
	)

	// Verify task moved
	await expect(page.locator('[data-testid="in-progress-column"] .task-card')).toContainText(
		'E2E Test Task'
	)
})

test('responsive layout works on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE

	await page.goto('/')

	// Verify mobile layout
	await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible()
	await expect(page.locator('[data-testid="mobile-column-tabs"]')).toBeVisible()
})
```

### AI Service Test

```typescript
// tests/integration/ai/ai-service.test.ts
import { test, expect, vi } from 'vitest'
import { aiService } from '$lib/server/services/ai-service'

// Mock OpenAI API
vi.mock('openai', () => ({
	default: class MockOpenAI {
		chat = {
			completions: {
				create: vi.fn().mockResolvedValue({
					choices: [{
						message: {
							content: JSON.stringify({
								title: 'Prepare client presentation',
								description: 'Create slides for tomorrow meeting',
								priority: 'high'
							})
						}
					}]
				})
			}
		}
	}
}))

test('creates task from natural language prompt', async () => {
	const prompt = "I need to prepare for tomorrow's client presentation"
	
	const result = await aiService.createTaskFromPrompt(prompt)

	expect(result.title).toBe('Prepare client presentation')
	expect(result.description).toContain('slides')
	expect(result.priority).toBe('high')
	expect(result.aiGenerated).toBe(true)
	expect(result.originalPrompt).toBe(prompt)
})
```

## Testing Standards

### Unit Test Guidelines
- **Test behavior, not implementation**: Focus on what the component does, not how
- **Use descriptive test names**: Clearly describe the scenario being tested
- **Follow AAA pattern**: Arrange, Act, Assert for test structure
- **Mock external dependencies**: Isolate units under test
- **Test edge cases**: Include error conditions and boundary values

### Integration Test Guidelines
- **Test API contracts**: Verify request/response formats and status codes
- **Test data flow**: Ensure data flows correctly through service layers
- **Test error handling**: Verify proper error responses and recovery
- **Use realistic data**: Test with data similar to production scenarios

### E2E Test Guidelines
- **Test user workflows**: Focus on complete user journeys
- **Use data-testid attributes**: Stable selectors that don't change with styling
- **Test responsive design**: Verify functionality across device sizes
- **Test accessibility**: Include keyboard navigation and screen reader support
- **Keep tests independent**: Each test should be able to run in isolation

## Coverage Requirements

### Coverage Targets
- **Unit Tests**: 90% line coverage minimum
- **Integration Tests**: 80% API endpoint coverage
- **E2E Tests**: 100% critical user flow coverage

### Coverage Configuration

```javascript
// vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
}
```

## Test Data Management

### Test Fixtures
```typescript
// tests/fixtures/tasks.ts
export const mockTasks = {
  todoTask: {
    id: 'todo-1',
    title: 'Todo Task',
    status: 'todo' as const,
    // ... other properties
  },
  inProgressTask: {
    id: 'progress-1', 
    title: 'In Progress Task',
    status: 'in-progress' as const,
    // ... other properties
  }
}
```

### Test Utilities
```typescript
// tests/utils/test-helpers.ts
export function createMockTask(overrides = {}) {
  return {
    id: 'mock-task-' + Math.random(),
    title: 'Mock Task',
    description: 'Mock Description',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false,
    originalPrompt: null,
    ...overrides
  }
}
```

## CI/CD Integration

### Test Automation
- **Pre-commit hooks**: Run linting and unit tests before commits
- **Pull request checks**: Full test suite must pass before merging
- **Deployment gates**: E2E tests must pass before production deployment
- **Scheduled testing**: Nightly runs of full test suite including performance tests

### Test Reporting
- **Coverage reports**: Generated and uploaded to CI dashboard
- **Test results**: Detailed failure reports with stack traces
- **Performance metrics**: Track test execution times and optimize slow tests
- **Visual regression**: Screenshot comparisons for UI consistency