/**
 * Core task interface representing a work item in the Kanban board
 */
export interface Task {
  /** Unique identifier for the task */
  id: string
  /** Task title/summary */
  title: string
  /** Detailed task description */
  description: string
  /** Current status of the task */
  status: TaskStatus
  /** Task priority level */
  priority: Priority
  /** Optional due date */
  dueDate: Date | null
  /** Timestamp when task was created */
  createdAt: Date
  /** Timestamp when task was last updated */
  updatedAt: Date
  /** Flag indicating if task was AI-generated */
  aiGenerated: boolean
  /** Original AI prompt used to generate task (if applicable) */
  originalPrompt: string | null
}

/**
 * Task status enum defining workflow states
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done'

/**
 * Task priority levels for organizing work
 */
export type Priority = 'high' | 'medium' | 'low'

/**
 * Standard API response wrapper for type-safe server communication
 */
export interface ApiResponse<T> {
  /** Response payload */
  data: T
  /** Indicates if request was successful */
  success: boolean
  /** ISO timestamp of response */
  timestamp: string
}

/**
 * Type guard to check if a value is a valid TaskStatus
 */
export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && ['todo', 'in-progress', 'done'].includes(value)
}

/**
 * Type guard to check if a value is a valid Priority
 */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['high', 'medium', 'low'].includes(value)
}