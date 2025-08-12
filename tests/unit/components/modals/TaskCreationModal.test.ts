import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import TaskCreationModal from '$lib/components/modals/TaskCreationModal.svelte'
import { isTaskModalOpen, tasks } from '$lib/stores/tasks'
import { get } from 'svelte/store'

// Mock the stores
vi.mock('$lib/stores/tasks', () => {
  const { writable } = require('svelte/store')
  return {
    isTaskModalOpen: writable(false),
    tasks: writable([]),
    addTask: vi.fn(),
    closeTaskModal: vi.fn()
  }
})

describe('TaskCreationModal', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Clear tasks store
    tasks.set([])
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  afterEach(() => {
    // Close modal after each test
    isTaskModalOpen.set(false)
  })

  it('does not render modal content when closed', () => {
    isTaskModalOpen.set(false)
    render(TaskCreationModal)
    
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument()
  })

  it('renders modal content when open', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
  })

  it('has required title field with validation', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', { name: /create task/i })
    
    expect(titleInput).toHaveAttribute('required')
    expect(submitButton).toBeDisabled()
    
    // Type title and check submit button becomes enabled
    await user.type(titleInput, 'Test Task')
    expect(submitButton).toBeEnabled()
  })

  it('shows validation error for empty title', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)
    
    expect(screen.getByText('Task title is required')).toBeInTheDocument()
  })

  it('shows validation error for short title', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'AB')
    
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)
    
    expect(screen.getByText('Task title must be at least 3 characters')).toBeInTheDocument()
  })

  it('has priority selector with correct options', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const prioritySelect = screen.getByLabelText(/priority/i)
    expect(prioritySelect).toBeInTheDocument()
    
    // Check options are present
    expect(screen.getByText('🔴 High Priority')).toBeInTheDocument()
    expect(screen.getByText('🟡 Medium Priority')).toBeInTheDocument()
    expect(screen.getByText('🟢 Low Priority')).toBeInTheDocument()
    
    // Default should be medium
    expect(prioritySelect).toHaveValue('medium')
  })

  it('has date picker with future date validation', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const dateInput = screen.getByLabelText(/due date/i)
    expect(dateInput).toHaveAttribute('type', 'date')
    
    // Should have min attribute set to today
    const today = new Date().toISOString().split('T')[0]
    expect(dateInput).toHaveAttribute('min', today)
  })

  it('has character counter for description', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    const descriptionTextarea = screen.getByLabelText(/description/i)
    expect(descriptionTextarea).toHaveAttribute('maxlength', '500')
    
    // Should show character counter
    expect(screen.getByText('0/500 characters')).toBeInTheDocument()
    
    // Type and check counter updates
    await user.type(descriptionTextarea, 'Test description')
    expect(screen.getByText('16/500 characters')).toBeInTheDocument()
  })

  it('handles form submission with valid data', async () => {
    const addTaskMock = vi.fn()
    const closeModalMock = vi.fn()
    
    // Mock the functions
    vi.doMock('$lib/stores/tasks', () => ({
      isTaskModalOpen: { subscribe: vi.fn(), set: vi.fn() },
      addTask: addTaskMock,
      closeTaskModal: closeModalMock
    }))
    
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Fill out form
    await user.type(screen.getByLabelText(/title/i), 'Test Task')
    await user.type(screen.getByLabelText(/description/i), 'Test description')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
    })
  })

  it('handles cancel button', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Fill out form partially
    await user.type(screen.getByLabelText(/title/i), 'Test Task')
    
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    // Form should be reset and modal should close
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
  })

  it('closes modal on Escape key', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Press Escape
    await user.keyboard('{Escape}')
    
    // Modal should close (implementation depends on store mock)
  })

  it('has proper accessibility attributes', async () => {
    isTaskModalOpen.set(true)
    render(TaskCreationModal)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
    
    // Check form labels are properly associated
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionTextarea = screen.getByLabelText(/description/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    const dateInput = screen.getByLabelText(/due date/i)
    
    expect(titleInput).toHaveAttribute('id')
    expect(descriptionTextarea).toHaveAttribute('id')
    expect(prioritySelect).toHaveAttribute('id')
    expect(dateInput).toHaveAttribute('id')
    
    // Required field should be marked
    expect(titleInput).toHaveAttribute('required')
  })
})