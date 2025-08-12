<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Task } from '$lib/types'
  
  // Constants
  const DESCRIPTION_TRUNCATE_LENGTH = 100
  const PRIORITY_CLASSES = {
    high: 'badge-error',
    medium: 'badge-warning',
    low: 'badge-info'
  } as const
  
  const PRIORITY_LABELS = {
    high: 'High Priority',
    medium: 'Medium Priority', 
    low: 'Low Priority'
  } as const
  
  // Props
  export let task: Task
  export let variant: 'default' | 'compact' = 'default'
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    click: { task: Task }
    edit: { taskId: string }
  }>()
  
  // Reactive statements
  $: priorityClass = getPriorityClass(task.priority)
  $: priorityLabel = getPriorityLabel(task.priority)
  $: isCompact = variant === 'compact'
  $: shouldTruncate = task.description.length > DESCRIPTION_TRUNCATE_LENGTH
  $: truncatedDescription = shouldTruncate 
    ? task.description.slice(0, DESCRIPTION_TRUNCATE_LENGTH) + '...' 
    : task.description
  
  // Functions
  function handleClick() {
    dispatch('click', { task })
    dispatch('edit', { taskId: task.id })
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }
  
  function getPriorityClass(priority: Task['priority']): string {
    return PRIORITY_CLASSES[priority] || 'badge-ghost'
  }
  
  function getPriorityLabel(priority: Task['priority']): string {
    return PRIORITY_LABELS[priority] || 'Unknown Priority'
  }
</script>

<div 
  class="card bg-base-100 shadow-sm border border-base-300 hover:bg-base-50 hover:shadow-md transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 {isCompact ? 'card-compact' : ''}"
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeydown}
  aria-labelledby="task-{task.id}-title"
  aria-describedby="task-{task.id}-desc task-{task.id}-priority"
  data-testid="task-card"
  data-task-id={task.id}
>
  <div class="card-body {isCompact ? 'p-3' : 'p-4'}">
    <div class="flex items-start justify-between gap-2 mb-2">
      <h3 
        id="task-{task.id}-title"
        class="card-title {isCompact ? 'text-sm' : 'text-base'} font-medium text-base-content line-clamp-2"
      >
        {task.title}
      </h3>
      <div 
        class="badge {priorityClass} badge-sm flex-shrink-0"
        aria-label={priorityLabel}
        id="task-{task.id}-priority"
      >
        {task.priority}
      </div>
    </div>
    
    <div class="relative">
      <p 
        id="task-{task.id}-desc"
        class="text-sm text-base-content/70 leading-relaxed {isCompact ? 'line-clamp-2' : 'line-clamp-3'}"
        class:tooltip={shouldTruncate}
        data-tip={shouldTruncate ? task.description : ''}
      >
        {shouldTruncate ? truncatedDescription : task.description}
      </p>
    </div>
    
    {#if task.dueDate}
      <div class="flex items-center gap-1 mt-2 text-xs text-base-content/60">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
    {/if}
    
    {#if task.aiGenerated}
      <div class="flex items-center gap-1 mt-2">
        <div class="badge badge-outline badge-xs">
          <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          AI Generated
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>