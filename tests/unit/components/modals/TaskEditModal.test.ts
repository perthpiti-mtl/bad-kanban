import { render, fireEvent, screen } from '@testing-library/svelte'
import { expect, test, describe, beforeEach, vi } from 'vitest'
import TaskEditModal from '$lib/components/modals/TaskEditModal.svelte'
import type { Task } from '$lib/types'
import { tasks, isTaskEditModalOpen, editingTaskId } from '$lib/stores/tasks'
import { get } from 'svelte/store'

// Mock task data
const mockTask: Task = {
  id: 'test-task-1',
  title: 'Test Task Title',
  description: 'Test task description for editing',
  status: 'todo',
  priority: 'high',
  dueDate: new Date('2025-08-20'),
  createdAt: new Date('2025-08-10'),
  updatedAt: new Date('2025-08-10'),
  aiGenerated: false,
  originalPrompt: null
}

describe('TaskEditModal', () => {
  beforeEach(() => {
    // Reset stores before each test
    tasks.set([mockTask])
    isTaskEditModalOpen.set(false)
    editingTaskId.set(null)
  })

  test('renders modal when open with task data', async () => {
    // Set up the modal to be open with a task
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)
    
    // Check that modal is rendered
    const modal = container.querySelector('[data-testid="task-edit-modal"]')
    expect(modal).toBeInTheDocument()

    // Check form fields are pre-populated
    const titleInput = container.querySelector('[data-testid="edit-title-input"]') as HTMLInputElement
    const descriptionInput = container.querySelector('[data-testid="edit-description-input"]') as HTMLTextAreaElement
    const prioritySelect = container.querySelector('[data-testid="edit-priority-select"]') as HTMLSelectElement

    expect(titleInput?.value).toBe(mockTask.title)
    expect(descriptionInput?.value).toBe(mockTask.description)
    expect(prioritySelect?.value).toBe(mockTask.priority)
  })

  test('validates form fields with Zod schema', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const titleInput = container.querySelector('[data-testid="edit-title-input"]') as HTMLInputElement
    const saveButton = container.querySelector('[data-testid="save-task-btn"]') as HTMLButtonElement

    // Clear title to trigger validation error
    await fireEvent.input(titleInput, { target: { value: '' } })

    // Save button should be disabled with empty title
    expect(saveButton.disabled).toBe(true)

    // Check for validation error message
    const errorMessage = container.querySelector('.text-error')
    expect(errorMessage).toBeInTheDocument()
  })

  test('shows delete confirmation dialog when delete button clicked', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const deleteButton = container.querySelector('[data-testid="delete-task-btn"]') as HTMLButtonElement
    await fireEvent.click(deleteButton)

    // Check confirmation dialog is shown
    const confirmDeleteBtn = container.querySelector('[data-testid="confirm-delete-btn"]')
    const cancelDeleteBtn = container.querySelector('[data-testid="cancel-delete-btn"]')
    
    expect(confirmDeleteBtn).toBeInTheDocument()
    expect(cancelDeleteBtn).toBeInTheDocument()
    expect(container.textContent).toContain('Are you sure you want to delete')
  })

  test('cancels delete confirmation when cancel clicked', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    // Open delete confirmation
    const deleteButton = container.querySelector('[data-testid="delete-task-btn"]') as HTMLButtonElement
    await fireEvent.click(deleteButton)

    // Cancel the delete
    const cancelDeleteBtn = container.querySelector('[data-testid="cancel-delete-btn"]') as HTMLButtonElement
    await fireEvent.click(cancelDeleteBtn)

    // Should return to edit form
    expect(container.querySelector('[data-testid="edit-title-input"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="confirm-delete-btn"]')).not.toBeInTheDocument()
  })

  test('handles form submission with valid data', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const titleInput = container.querySelector('[data-testid="edit-title-input"]') as HTMLInputElement
    const form = container.querySelector('form') as HTMLFormElement

    // Update title
    await fireEvent.input(titleInput, { target: { value: 'Updated Task Title' } })

    // Submit form
    await fireEvent.submit(form)

    // Should show success message
    expect(container.textContent).toContain('Task updated successfully!')
  })

  test('handles ESC key to close modal', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    render(TaskEditModal)

    // Simulate ESC key press
    await fireEvent.keyDown(window, { key: 'Escape' })

    // Modal should be closed
    expect(get(isTaskEditModalOpen)).toBe(false)
    expect(get(editingTaskId)).toBeNull()
  })

  test('handles backdrop click to close modal', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const modal = container.querySelector('[data-testid="task-edit-modal"]') as HTMLDialogElement

    // Click backdrop (the modal element itself)
    await fireEvent.click(modal)

    // Modal should be closed
    expect(get(isTaskEditModalOpen)).toBe(false)
  })

  test('disables save button when validation errors exist', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const titleInput = container.querySelector('[data-testid="edit-title-input"]') as HTMLInputElement
    const saveButton = container.querySelector('[data-testid="save-task-btn"]') as HTMLButtonElement

    // Set invalid title (too long)
    await fireEvent.input(titleInput, { 
      target: { value: 'a'.repeat(101) } 
    })

    expect(saveButton.disabled).toBe(true)
  })

  test('populates due date field correctly', async () => {
    editingTaskId.set(mockTask.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const dueDateInput = container.querySelector('[data-testid="edit-due-date-input"]') as HTMLInputElement
    
    // Should be populated with the task's due date in YYYY-MM-DD format
    expect(dueDateInput?.value).toBe('2025-08-20')
  })

  test('handles task with null due date', async () => {
    const taskWithoutDate = { ...mockTask, dueDate: null }
    tasks.set([taskWithoutDate])
    editingTaskId.set(taskWithoutDate.id)
    isTaskEditModalOpen.set(true)

    const { container } = render(TaskEditModal)

    const dueDateInput = container.querySelector('[data-testid="edit-due-date-input"]') as HTMLInputElement
    
    // Should be empty when no due date
    expect(dueDateInput?.value).toBe('')
  })
})