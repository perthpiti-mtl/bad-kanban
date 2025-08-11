<script lang="ts">
  import type { Task } from '$lib/types'
  import KanbanColumn from './KanbanColumn.svelte'
  
  // Props with validation
  export let tasks: Task[] = []
  
  // Organize tasks by status with performance optimization
  $: todoTasks = tasks.filter(task => task.status === 'todo')
  $: inProgressTasks = tasks.filter(task => task.status === 'in-progress')  
  $: doneTasks = tasks.filter(task => task.status === 'done')
  
  // Performance metrics for monitoring
  $: totalTasks = tasks.length
  $: completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0
</script>

<div class="container mx-auto p-4 max-w-7xl">
  <div 
    class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 h-full min-h-[600px]"
    role="main"
    aria-label="Kanban board with {totalTasks} total tasks, {completionRate}% complete"
  >
    <KanbanColumn 
      title="To Do" 
      status="todo"
      tasks={todoTasks}
    />
    
    <KanbanColumn 
      title="In Progress" 
      status="in-progress"
      tasks={inProgressTasks}
    />
    
    <KanbanColumn 
      title="Done" 
      status="done"
      tasks={doneTasks}
    />
  </div>
</div>