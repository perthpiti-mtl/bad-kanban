<script lang="ts">
  import type { Task } from '$lib/types'
  import KanbanBoard from '$lib/components/kanban/KanbanBoard.svelte'
  import { sampleTasks } from '$lib/data/sample-tasks'
  
  // Sample data for demonstration
  let tasks: Task[] = sampleTasks
  
  // Page metadata for better SEO and accessibility
  const pageTitle = 'BMad Kanban Board'
  const pageDescription = 'Task management with visual Kanban board interface'
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<div class="min-h-screen bg-base-200 flex flex-col">
  <header class="navbar bg-base-100 shadow-sm">
    <div class="container mx-auto">
      <div class="flex-1">
        <h1 class="text-xl font-bold text-base-content">
          {pageTitle}
        </h1>
      </div>
      <div class="flex-none">
        <span class="text-sm text-base-content/70">
          {tasks.length} total tasks
        </span>
      </div>
    </div>
  </header>
  
  <main class="flex-1 py-6">
    <KanbanBoard {tasks} />
  </main>
</div>
