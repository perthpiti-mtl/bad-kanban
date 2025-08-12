// Re-export Zod schemas and inferred types
export * from './schemas'

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