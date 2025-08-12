<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Task, TaskStatus } from '$lib/types'
  import TaskCard from './TaskCard.svelte'
  
  // Props with validation
  export let title: string
  export let tasks: Task[] = []
  export let status: TaskStatus | undefined = undefined
  
  // Event dispatcher for parent communication
  const dispatch = createEventDispatcher<{
    taskClick: { task: Task; column: string }
    taskEdit: { taskId: string }
  }>()
  
  // Derived state for better performance
  $: taskCount = tasks.length
  $: isEmpty = taskCount === 0
  
  // Generate unique id for accessibility
  $: columnId = `kanban-column-${title.toLowerCase().replace(/\s+/g, '-')}`
  
  // Use status for styling and future functionality
  $: columnClass = status ? `kanban-column-${status}` : ''
  
  // Event handlers
  function handleTaskClick(event: CustomEvent<{ task: Task }>) {
    const { task } = event.detail
    dispatch('taskClick', { task, column: title })
  }

  function handleTaskEdit(event: CustomEvent<{ taskId: string }>) {
    const { taskId } = event.detail
    dispatch('taskEdit', { taskId })
  }
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
      
      {#each tasks as task (task.id)}
        <div role="listitem">
          <TaskCard {task} on:click={handleTaskClick} on:edit={handleTaskEdit} />
        </div>
      {/each}
    </div>
  </div>
</div>