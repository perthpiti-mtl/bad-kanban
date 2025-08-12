<script lang="ts">
  import { onDestroy } from 'svelte'
  import { isTaskEditModalOpen, closeTaskEditModal, editingTaskId, updateTask, deleteTask, tasks } from '$lib/stores/tasks'
  import { UpdateTaskSchema } from '$lib/types/schemas'
  import type { Priority, Task } from '$lib/types'
  import { ZodError } from 'zod'
  
  // Form state
  let title = ''
  let description = ''
  let priority: Priority = 'medium'
  let dueDate = ''
  
  // Validation state
  let titleError = ''
  let validationErrors: Record<string, string> = {}
  let showSuccess = false
  let showDeleteConfirm = false
  
  // Modal reference for focus management
  let modalElement: HTMLDialogElement
  let currentTask: Task | null = null

  $: isOpen = $isTaskEditModalOpen
  $: taskId = $editingTaskId
  
  // Find the current task when taskId changes
  $: if (taskId && $tasks) {
    currentTask = $tasks.find(task => task.id === taskId) || null
    if (currentTask) {
      populateForm(currentTask)
    }
  }

  // Watch for modal open/close to manage focus and reset form
  $: if (isOpen && modalElement) {
    modalElement.showModal()
    // Focus the title input when modal opens
    setTimeout(() => {
      const titleInput = modalElement.querySelector('input[name="title"]') as HTMLInputElement
      titleInput?.focus()
    }, 100)
  } else if (modalElement && !isOpen) {
    modalElement.close()
  }

  function populateForm(task: Task) {
    title = task.title
    description = task.description
    priority = task.priority
    dueDate = task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  }

  function validateFormWithZod(): boolean {
    if (!currentTask) return false
    
    const formData = {
      id: currentTask.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    }

    try {
      UpdateTaskSchema.parse(formData)
      validationErrors = {}
      titleError = ''
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          const field = err.path[0] as string
          newErrors[field] = err.message
        })
        validationErrors = newErrors
        titleError = newErrors.title || ''
      }
      return false
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    
    if (!currentTask || !validateFormWithZod()) {
      return
    }

    // Update the task
    const updates = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    }

    updateTask(currentTask.id, updates)
    
    // Show success feedback
    showSuccess = true
    setTimeout(() => {
      closeTaskEditModal()
      listenForModalCloseAnimation()
    }, 1500)
  }

  function handleDelete() {
    if (!currentTask) return
    
    deleteTask(currentTask.id)
    closeTaskEditModal()
  }

  function confirmDelete() {
    showDeleteConfirm = true
  }

  function cancelDelete() {
    showDeleteConfirm = false
  }

  function resetForm() {
    title = ''
    description = ''
    priority = 'medium'
    dueDate = ''
    titleError = ''
    validationErrors = {}
    showDeleteConfirm = false
  }

  function handleModalClick(event: MouseEvent) {
    // Close modal if clicking backdrop
    if (event.target === modalElement) {
      resetAndCloseModal()
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (showDeleteConfirm) {
        cancelDelete()
      } else {
        resetAndCloseModal()
      }
    }
  }

  function handleCancel() {
    if (showDeleteConfirm) {
      cancelDelete()
    } else {
      resetAndCloseModal()
    }
  }

  function listenForModalCloseAnimation() {
    if (modalElement) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        // Only reset if the transition is on the modal itself or modal-box
        if (event.target === modalElement || (event.target as HTMLElement)?.classList?.contains('modal-box')) {
          showSuccess = false
          modalElement.removeEventListener('transitionend', handleTransitionEnd)
        }
      }
      modalElement.addEventListener('transitionend', handleTransitionEnd)
    }
  }

  function resetAndCloseModal() {
    resetForm()
    closeTaskEditModal()
    listenForModalCloseAnimation()
  }

  // Reactive validation for title (debounced for performance)
  let validationTimeout: NodeJS.Timeout
  $: if (title && (titleError || validationErrors.title)) {
    clearTimeout(validationTimeout)
    validationTimeout = setTimeout(() => {
      validateFormWithZod()
    }, 300)
  }

  // Cleanup timeout on destroy
  onDestroy(() => {
    if (validationTimeout) {
      clearTimeout(validationTimeout)
    }
  })
</script>

<svelte:window onkeydown={handleKeyDown} />

<dialog 
  bind:this={modalElement}
  class="modal modal-bottom sm:modal-middle"
  onclick={handleModalClick}
  data-testid="task-edit-modal"
>
  <div class="modal-box w-11/12 max-w-2xl">
    {#if showSuccess}
      <div class="alert alert-success mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Task updated successfully!</span>
      </div>
    {:else if showDeleteConfirm}
      <div class="text-center space-y-6">
        <h3 class="font-bold text-lg text-error">Delete Task</h3>
        <p class="text-base-content/70">
          Are you sure you want to delete "<strong>{currentTask?.title}</strong>"?
          <br>This action cannot be undone.
        </p>
        <div class="flex gap-4 justify-center">
          <button 
            type="button" 
            class="btn btn-ghost"
            onclick={cancelDelete}
            data-testid="cancel-delete-btn"
          >
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-error"
            onclick={handleDelete}
            data-testid="confirm-delete-btn"
          >
            Delete Task
          </button>
        </div>
      </div>
    {:else}
      <h3 class="font-bold text-lg mb-6">Edit Task</h3>
      
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Title Field -->
        <div class="form-control">
          <label class="label" for="edit-title">
            <span class="label-text font-medium">Title <span class="text-error">*</span></span>
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            placeholder="Enter task title..."
            class="input input-bordered w-full {titleError || validationErrors.title ? 'input-error' : ''}"
            bind:value={title}
            maxlength="100"
            required
            data-testid="edit-title-input"
          />
          {#if titleError || validationErrors.title}
            <div class="label">
              <span class="label-text-alt text-error">{titleError || validationErrors.title}</span>
            </div>
          {/if}
        </div>

        <!-- Description Field -->
        <div class="form-control">
          <label class="label" for="edit-description">
            <span class="label-text font-medium">Description</span>
          </label>
          <textarea
            id="edit-description"
            name="description"
            placeholder="Enter task description..."
            class="textarea textarea-bordered w-full h-24 resize-none {validationErrors.description ? 'textarea-error' : ''}"
            bind:value={description}
            maxlength="500"
            data-testid="edit-description-input"
          ></textarea>
          <div class="label">
            <span class="label-text-alt">{description.length}/500 characters</span>
            {#if validationErrors.description}
              <span class="label-text-alt text-error">{validationErrors.description}</span>
            {/if}
          </div>
        </div>

        <!-- Priority Field -->
        <div class="form-control">
          <label class="label" for="edit-priority">
            <span class="label-text font-medium">Priority</span>
          </label>
          <select
            id="edit-priority"
            name="priority"
            class="select select-bordered w-full"
            bind:value={priority}
            data-testid="edit-priority-select"
          >
            <option value="high">
              🔴 High Priority
            </option>
            <option value="medium">
              🟡 Medium Priority
            </option>
            <option value="low">
              🟢 Low Priority
            </option>
          </select>
        </div>

        <!-- Due Date Field -->
        <div class="form-control">
          <label class="label" for="edit-dueDate">
            <span class="label-text font-medium">Due Date</span>
          </label>
          <input
            id="edit-dueDate"
            name="dueDate"
            type="date"
            class="input input-bordered w-full"
            bind:value={dueDate}
            min={new Date().toISOString().split('T')[0]}
            data-testid="edit-due-date-input"
          />
          <div class="label">
            <span class="label-text-alt">Optional - Select a future date</span>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-error btn-outline mr-auto"
            onclick={confirmDelete}
            data-testid="delete-task-btn"
          >
            Delete
          </button>
          <button 
            type="button" 
            class="btn btn-ghost"
            onclick={handleCancel}
            data-testid="cancel-edit-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            disabled={!title.trim() || Object.keys(validationErrors).length > 0}
            data-testid="save-task-btn"
          >
            Save Changes
          </button>
        </div>
      </form>
    {/if}
  </div>
</dialog>

<style>
  /* Ensure modal is properly layered */
  .modal {
    z-index: 1000;
  }
  
  /* Improve focus visibility */
  .input:focus,
  .textarea:focus,
  .select:focus {
    outline: 2px solid hsl(var(--p));
    outline-offset: 2px;
  }
</style>