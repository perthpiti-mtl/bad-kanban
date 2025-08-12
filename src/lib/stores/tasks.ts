import { writable, derived } from 'svelte/store'
import type { Task } from '$lib/types'
import { UpdateTaskSchema, CreateTaskSchema } from '$lib/types/schemas'

// Task store for managing all tasks
export const tasks = writable<Task[]>([])

// Modal state stores
export const isTaskModalOpen = writable(false)
export const isTaskEditModalOpen = writable(false)
export const editingTaskId = writable<string | null>(null)

// Derived stores for tasks by status
export const todoTasks = derived(tasks, $tasks => 
  $tasks.filter(task => task.status === 'todo')
)

export const inProgressTasks = derived(tasks, $tasks => 
  $tasks.filter(task => task.status === 'in-progress')
)

export const doneTasks = derived(tasks, $tasks => 
  $tasks.filter(task => task.status === 'done')
)

// Task management functions
export function addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const newTask: Task = {
    ...taskData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  tasks.update(currentTasks => [...currentTasks, newTask])
  return newTask
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
  // Validate update data with Zod schema
  const updateData = { id, ...updates }
  try {
    UpdateTaskSchema.parse(updateData)
  } catch (error) {
    console.error('Invalid task update data:', error)
    throw new Error('Task update validation failed')
  }

  tasks.update(currentTasks => 
    currentTasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    )
  )
}

export function deleteTask(id: string) {
  tasks.update(currentTasks => currentTasks.filter(task => task.id !== id))
}

// Local storage persistence
const STORAGE_KEY = 'kanban_tasks'

// Auto-save functionality with subscription management
let autoSaveUnsubscribe: (() => void) | null = null

export function saveTasksToLocalStorage() {
  // This function now only handles immediate saves when needed
  if (typeof window !== 'undefined') {
    let currentTasks: Task[] = []
    const unsubscribe = tasks.subscribe(value => {
      currentTasks = value
    })
    unsubscribe()
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks))
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error)
    }
  }
}

export function enableAutoSave() {
  if (typeof window !== 'undefined' && !autoSaveUnsubscribe) {
    autoSaveUnsubscribe = tasks.subscribe(currentTasks => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks))
      } catch (error) {
        console.warn('Failed to auto-save tasks to localStorage:', error)
      }
    })
  }
}

export function disableAutoSave() {
  if (autoSaveUnsubscribe) {
    autoSaveUnsubscribe()
    autoSaveUnsubscribe = null
  }
}

export function loadTasksFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedTasks: Task[] = JSON.parse(stored)
        // Convert date strings back to Date objects
        const restoredTasks = parsedTasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }))
        tasks.set(restoredTasks)
      }
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error)
      tasks.set([])
    }
  }
}

// Modal control functions
export function openTaskModal() {
  isTaskModalOpen.set(true)
}

export function closeTaskModal() {
  isTaskModalOpen.set(false)
}

export function openTaskEditModal(taskId: string) {
  editingTaskId.set(taskId)
  isTaskEditModalOpen.set(true)
}

export function closeTaskEditModal() {
  isTaskEditModalOpen.set(false)
  editingTaskId.set(null)
}