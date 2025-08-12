<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TaskCreationModal from './TaskCreationModal.svelte'
  import { isTaskModalOpen, tasks } from '$lib/stores/tasks'

  const { Story } = defineMeta({
    title: 'Modals/TaskCreationModal',
    component: TaskCreationModal,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: 'A comprehensive task creation modal with form validation, accessibility features, and success feedback. Integrates with Svelte stores for state management.'
        }
      }
    }
  })
</script>

<script>
  function openModal() {
    isTaskModalOpen.set(true)
  }

  function closeModal() {
    isTaskModalOpen.set(false)
  }

  function clearTasks() {
    tasks.set([])
  }
</script>

<!-- Default Modal Demo -->
<Story name="Modal Demo">
  <div class="p-6">
    <div class="mb-4 space-x-2">
      <button class="btn btn-primary" onclick={openModal}>
        🚀 Open Task Creation Modal
      </button>
      <button class="btn btn-ghost" onclick={closeModal}>
        ✕ Close Modal
      </button>
      <button class="btn btn-outline btn-sm" onclick={clearTasks}>
        🗑️ Clear Tasks ({$tasks.length})
      </button>
    </div>
    
    <div class="alert alert-info mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <div><strong>Modal Status:</strong> {$isTaskModalOpen ? 'Open' : 'Closed'}</div>
        <div><strong>Tasks Created:</strong> {$tasks.length}</div>
      </div>
    </div>
    
    <div class="prose max-w-none">
      <h3>Task Creation Modal</h3>
      <p>This modal allows users to create new tasks with:</p>
      <ul>
        <li>Required title field with validation</li>
        <li>Optional description (up to 500 characters)</li>
        <li>Priority selection with visual indicators</li>
        <li>Optional due date picker (future dates only)</li>
        <li>Success feedback on task creation</li>
      </ul>
      <p><strong>Accessibility features:</strong></p>
      <ul>
        <li>Focus management - automatically focuses title input</li>
        <li>Keyboard navigation (ESC to close, Tab to navigate)</li>
        <li>Screen reader friendly labels and descriptions</li>
        <li>Clear error messaging</li>
      </ul>
    </div>

    <!-- Display created tasks for demo -->
    {#if $tasks.length > 0}
      <div class="mt-6">
        <h4 class="font-bold mb-3">Created Tasks ({$tasks.length}):</h4>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          {#each $tasks as task}
            <div class="card bg-base-100 shadow-sm compact">
              <div class="card-body p-3">
                <div class="flex items-start justify-between">
                  <div>
                    <h5 class="font-semibold text-sm">{task.title}</h5>
                    {#if task.description}
                      <p class="text-xs text-base-content/70 mt-1">{task.description}</p>
                    {/if}
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="badge badge-sm {task.priority === 'high' ? 'badge-error' : task.priority === 'medium' ? 'badge-warning' : 'badge-success'}">
                      {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                    </span>
                    {#if task.dueDate}
                      <span class="text-xs text-base-content/60">Due: {task.dueDate.toLocaleDateString()}</span>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <TaskCreationModal />
  </div>
</Story>

<!-- Form Validation Demo -->
<Story name="Form Features">
  <div class="p-6">
    <div class="stats shadow mb-4">
      <div class="stat">
        <div class="stat-title">Modal State</div>
        <div class="stat-value text-lg">{$isTaskModalOpen ? 'Open' : 'Closed'}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Tasks Created</div>
        <div class="stat-value text-lg">{$tasks.length}</div>
      </div>
    </div>
    
    <div class="mb-4 flex gap-2 flex-wrap">
      <button class="btn btn-primary" onclick={openModal}>
        🚀 Test Form Validation
      </button>
      <button class="btn btn-secondary" onclick={closeModal}>
        ✕ Close Modal
      </button>
      <button class="btn btn-outline btn-sm" onclick={clearTasks}>
        🗑️ Clear All Tasks
      </button>
    </div>
    
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div class="card bg-base-100 shadow compact">
        <div class="card-body">
          <h4 class="card-title text-base">Form Validation</h4>
          <ul class="space-y-1">
            <li>• Title required (min 3 characters)</li>
            <li>• Description optional (max 500 chars)</li>
            <li>• Real-time character count</li>
            <li>• Clear error messaging</li>
          </ul>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow compact">
        <div class="card-body">
          <h4 class="card-title text-base">Priority Options</h4>
          <ul class="space-y-1">
            <li>🔴 High Priority</li>
            <li>🟡 Medium Priority (default)</li>
            <li>🟢 Low Priority</li>
          </ul>
        </div>
      </div>
    </div>

    <TaskCreationModal />
  </div>
</Story>

<!-- Accessibility Demo -->
<Story name="Accessibility">
  <div class="p-6">
    <div class="flex gap-2 mb-4">
      <button class="btn btn-primary" onclick={openModal}>
        🚀 Test Accessibility Features
      </button>
      <button class="btn btn-ghost" onclick={closeModal}>
        ✕ Force Close
      </button>
    </div>
    
    <div class="alert alert-success mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <div>Fully accessible with keyboard navigation, screen reader support, and WCAG compliance.</div>
        <div class="text-sm opacity-75 mt-1">Modal is currently: <strong>{$isTaskModalOpen ? 'OPEN' : 'CLOSED'}</strong></div>
      </div>
    </div>
    
    <div class="mt-4">
      <h4 class="font-bold mb-2">Keyboard Navigation:</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><kbd class="kbd kbd-sm">Tab</kbd> Navigate between fields</div>
        <div><kbd class="kbd kbd-sm">Escape</kbd> Close modal</div>
        <div><kbd class="kbd kbd-sm">Enter</kbd> Submit form</div>
        <div><kbd class="kbd kbd-sm">Space</kbd> Toggle buttons</div>
      </div>
    </div>

    <TaskCreationModal />
  </div>
</Story>