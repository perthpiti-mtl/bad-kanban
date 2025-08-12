<script lang="ts">
  import { onMount } from 'svelte'
  import KanbanColumn from './KanbanColumn.svelte'
  import FloatingActionButton from '$lib/components/ui/FloatingActionButton.svelte'
  import TaskCreationModal from '$lib/components/modals/TaskCreationModal.svelte'
  import TaskEditModal from '$lib/components/modals/TaskEditModal.svelte'
  import { tasks, todoTasks, inProgressTasks, doneTasks, loadTasksFromLocalStorage, openTaskModal, openTaskEditModal, enableAutoSave, disableAutoSave } from '$lib/stores/tasks'
  
  // Load tasks from localStorage when component mounts
  onMount(() => {
    loadTasksFromLocalStorage()
    enableAutoSave()
    
    // Cleanup auto-save subscription on component destroy
    return () => {
      disableAutoSave()
    }
  })
  
  // Performance metrics for monitoring
  $: totalTasks = $tasks.length
  $: completionRate = totalTasks > 0 ? Math.round(($doneTasks.length / totalTasks) * 100) : 0

  function handleCreateTask() {
    openTaskModal()
  }

  function handleTaskEdit(event: CustomEvent<{ taskId: string }>) {
    const { taskId } = event.detail
    openTaskEditModal(taskId)
  }
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
      tasks={$todoTasks}
      on:taskEdit={handleTaskEdit}
    />
    
    <KanbanColumn 
      title="In Progress" 
      status="in-progress"
      tasks={$inProgressTasks}
      on:taskEdit={handleTaskEdit}
    />
    
    <KanbanColumn 
      title="Done" 
      status="done"
      tasks={$doneTasks}
      on:taskEdit={handleTaskEdit}
    />
  </div>
  
  <!-- Floating Action Button -->
  <FloatingActionButton onclick={handleCreateTask} />
  
  <!-- Task Creation Modal -->
  <TaskCreationModal />
  
  <!-- Task Edit Modal -->
  <TaskEditModal />
</div>