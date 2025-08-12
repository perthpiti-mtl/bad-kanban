<script lang="ts">
  import { isTaskModalOpen, closeTaskModal, addTask } from '$lib/stores/tasks'
  import type { Priority } from '$lib/types'
  
  // Form state
  let title = ''
  let description = ''
  let priority: Priority = 'medium'
  let dueDate = ''
  
  // Validation state
  let titleError = ''
  let showSuccess = false
  
  // Modal reference for focus management
  let modalElement: HTMLDialogElement

  $: isOpen = $isTaskModalOpen

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

  function validateForm(): boolean {
    titleError = ''
    
    if (!title.trim()) {
      titleError = 'Task title is required'
      return false
    }
    
    if (title.trim().length < 3) {
      titleError = 'Task title must be at least 3 characters'
      return false
    }
    
    return true
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Create the task
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'todo' as const,
      aiGenerated: false,
      originalPrompt: null
    }

    addTask(taskData)
    
    // Show success feedback
    showSuccess = true
    setTimeout(() => {
      resetForm()
      closeTaskModal()
      listenForModalCloseAnimation()
    }, 1500)
  }

  function resetForm() {
    title = ''
    description = ''
    priority = 'medium'
    dueDate = ''
    titleError = ''
  }

  function handleModalClick(event: MouseEvent) {
    // Close modal if clicking backdrop
    if (event.target === modalElement) {
      resetAndCloseModal()
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      resetAndCloseModal()
    }
  }

  function handleCancel() {
    resetAndCloseModal()
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
    closeTaskModal()
    listenForModalCloseAnimation()
  }

  // Reactive validation for title
  $: if (title && titleError) {
    validateForm()
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<dialog 
  bind:this={modalElement}
  class="modal modal-bottom sm:modal-middle"
  onclick={handleModalClick}
>
  <div class="modal-box w-11/12 max-w-2xl">
    {#if showSuccess}
      <div class="alert alert-success mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Task created successfully!</span>
      </div>
    {:else}
      <h3 class="font-bold text-lg mb-6">Create New Task</h3>
      
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Title Field -->
        <div class="form-control">
          <label class="label" for="title">
            <span class="label-text font-medium">Title <span class="text-error">*</span></span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task title..."
            class="input input-bordered w-full {titleError ? 'input-error' : ''}"
            bind:value={title}
            maxlength="100"
            required
          />
          {#if titleError}
            <div class="label">
              <span class="label-text-alt text-error">{titleError}</span>
            </div>
          {/if}
        </div>

        <!-- Description Field -->
        <div class="form-control">
          <label class="label" for="description">
            <span class="label-text font-medium">Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter task description..."
            class="textarea textarea-bordered w-full h-24 resize-none"
            bind:value={description}
            maxlength="500"
          ></textarea>
          <div class="label">
            <span class="label-text-alt">{description.length}/500 characters</span>
          </div>
        </div>

        <!-- Priority Field -->
        <div class="form-control">
          <label class="label" for="priority">
            <span class="label-text font-medium">Priority</span>
          </label>
          <select
            id="priority"
            name="priority"
            class="select select-bordered w-full"
            bind:value={priority}
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
          <label class="label" for="dueDate">
            <span class="label-text font-medium">Due Date</span>
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            class="input input-bordered w-full"
            bind:value={dueDate}
            min={new Date().toISOString().split('T')[0]}
          />
          <div class="label">
            <span class="label-text-alt">Optional - Select a future date</span>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-ghost"
            onclick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            disabled={!title.trim()}
          >
            Create Task
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