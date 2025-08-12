import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '$lib/components/kanban/KanbanBoard.svelte'
import { tasks, isTaskModalOpen } from '$lib/stores/tasks'
import { get } from 'svelte/store'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Task Creation Flow Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Clear all stores
    tasks.set([])
    isTaskModalOpen.set(false)
    
    // Clear localStorage mocks
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('completes full task creation flow from FAB click to task appearance', async () => {
    render(KanbanBoard)
    
    // Initially no tasks should be visible
    expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    // Modal should open
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Fill out the task form
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionTextarea = screen.getByLabelText(/description/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    
    await user.type(titleInput, 'Integration Test Task')
    await user.type(descriptionTextarea, 'This is a test task created during integration testing')
    await user.selectOptions(prioritySelect, 'high')
    
    // Submit the form
    const createButton = screen.getByRole('button', { name: /create task/i })
    await user.click(createButton)
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
    })
    
    // Wait for modal to close automatically
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Task should appear in the "To Do" column
    await waitFor(() => {
      expect(screen.getByText('Integration Test Task')).toBeInTheDocument()
    })
    
    // Verify task was added to store
    const currentTasks = get(tasks)
    expect(currentTasks).toHaveLength(1)
    expect(currentTasks[0].title).toBe('Integration Test Task')
    expect(currentTasks[0].description).toBe('This is a test task created during integration testing')
    expect(currentTasks[0].priority).toBe('high')
    expect(currentTasks[0].status).toBe('todo')
  })

  it('handles task creation with minimal data', async () => {
    render(KanbanBoard)
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Only fill required title field
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'Minimal Task')
    
    // Submit the form
    const createButton = screen.getByRole('button', { name: /create task/i })
    await user.click(createButton)
    
    // Should show success and create task
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
    })
    
    // Wait for modal to close and task to appear
    await waitFor(() => {
      expect(screen.getByText('Minimal Task')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Verify task defaults
    const currentTasks = get(tasks)
    expect(currentTasks).toHaveLength(1)
    expect(currentTasks[0].title).toBe('Minimal Task')
    expect(currentTasks[0].description).toBe('')
    expect(currentTasks[0].priority).toBe('medium') // Default priority
    expect(currentTasks[0].dueDate).toBeNull()
    expect(currentTasks[0].status).toBe('todo')
  })

  it('handles task creation with due date', async () => {
    render(KanbanBoard)
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Fill out form with due date
    const titleInput = screen.getByLabelText(/title/i)
    const dueDateInput = screen.getByLabelText(/due date/i)
    
    await user.type(titleInput, 'Task with Due Date')
    
    // Set due date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = tomorrow.toISOString().split('T')[0]
    
    await user.type(dueDateInput, tomorrowString)
    
    // Submit the form
    const createButton = screen.getByRole('button', { name: /create task/i })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
    })
    
    // Verify task with due date
    await waitFor(() => {
      const currentTasks = get(tasks)
      expect(currentTasks).toHaveLength(1)
      expect(currentTasks[0].title).toBe('Task with Due Date')
      expect(currentTasks[0].dueDate).toBeInstanceOf(Date)
    }, { timeout: 2000 })
  })

  it('validates form and prevents invalid submissions', async () => {
    render(KanbanBoard)
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Try to submit without title
    const createButton = screen.getByRole('button', { name: /create task/i })
    expect(createButton).toBeDisabled()
    
    // Type very short title
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'Ab')
    
    // Submit should show validation error
    await user.click(createButton)
    
    expect(screen.getByText('Task title must be at least 3 characters')).toBeInTheDocument()
    
    // No task should be created
    const currentTasks = get(tasks)
    expect(currentTasks).toHaveLength(0)
  })

  it('handles modal cancellation without creating task', async () => {
    render(KanbanBoard)
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Fill out form partially
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'Cancelled Task')
    
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    // Modal should close without creating task
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()
    })
    
    // No task should be created
    const currentTasks = get(tasks)
    expect(currentTasks).toHaveLength(0)
    
    // Task should not appear in board
    expect(screen.queryByText('Cancelled Task')).not.toBeInTheDocument()
  })

  it('persists tasks to localStorage', async () => {
    render(KanbanBoard)
    
    // Click FAB to open modal
    const fab = screen.getByRole('button', { name: /create new task/i })
    await user.click(fab)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Create a task
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'Persistent Task')
    
    const createButton = screen.getByRole('button', { name: /create task/i })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
    })
    
    // Verify localStorage.setItem was called
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kanban_tasks',
        expect.stringContaining('Persistent Task')
      )
    })
  })

  it('handles keyboard accessibility for modal', async () => {
    render(KanbanBoard)
    
    // Click FAB with keyboard
    const fab = screen.getByRole('button', { name: /create new task/i })
    fab.focus()
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Title input should be focused
    const titleInput = screen.getByLabelText(/title/i)
    await waitFor(() => {
      expect(titleInput).toHaveFocus()
    })
    
    // Tab navigation should work
    await user.keyboard('{Tab}')
    const descriptionTextarea = screen.getByLabelText(/description/i)
    expect(descriptionTextarea).toHaveFocus()
    
    // Escape should close modal
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()
    })
  })
})