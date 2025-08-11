<script lang="ts">
  import type { Task, TaskStatus } from '$lib/types'
  
  // Props with validation
  export let title: string
  export let tasks: Task[] = []
  export let status: TaskStatus | undefined = undefined
  
  // Derived state for better performance
  $: taskCount = tasks.length
  $: isEmpty = taskCount === 0
  
  // Generate unique id for accessibility
  $: columnId = `kanban-column-${title.toLowerCase().replace(/\s+/g, '-')}`
  
  // Use status for styling and future functionality
  $: columnClass = status ? `kanban-column-${status}` : ''
</script>

<div class="card bg-base-100 shadow-sm h-full border border-base-300 {columnClass}" role="region" aria-labelledby="{columnId}-heading">
  <div class="card-body p-4 sm:p-6">
    <h2 
      id="{columnId}-heading" 
      class="card-title text-lg sm:text-xl font-semibold text-base-content mb-4"
      aria-describedby="{columnId}-count"
    >
      {title}
      <span id="{columnId}-count" class="sr-only">{taskCount} tasks</span>
    </h2>
    
    <div 
      class="flex-1 space-y-3 sm:space-y-4 min-h-[200px] md:min-h-[400px]"
      role="list"
      aria-label="{title} tasks"
    >
      {#if isEmpty}
        <div class="flex items-center justify-center h-32 text-base-content/60" role="status">
          <p class="text-sm" aria-live="polite">No tasks yet</p>
        </div>
      {/if}
      
      <!-- Future TaskCard components will go here -->
      {#each tasks as task (task.id)}
        <button 
          class="p-3 sm:p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full text-left"
          aria-describedby="task-{task.id}-desc"
          type="button"
        >
          <h3 class="font-medium text-sm sm:text-base" id="task-{task.id}-title">
            {task.title}
          </h3>
          <p 
            id="task-{task.id}-desc" 
            class="text-xs sm:text-sm text-base-content/70 mt-1"
          >
            {task.description}
          </p>
        </button>
      {/each}
    </div>
  </div>
</div>