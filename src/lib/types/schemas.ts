import { z } from 'zod'

// Task status enum schema
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'done'])

// Priority enum schema
export const PrioritySchema = z.enum(['high', 'medium', 'low'])

// Main task schema with validation rules
export const TaskSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  dueDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  aiGenerated: z.boolean(),
  originalPrompt: z.string().nullable()
})

// Schema for creating new tasks (omits generated fields)
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  dueDate: z.date().nullable(),
  aiGenerated: z.boolean(),
  originalPrompt: z.string().nullable()
})

// Schema for updating tasks (all fields optional except id)
export const UpdateTaskSchema = TaskSchema.partial().required({ id: true })

// Schema for task queries/filtering
export const TaskQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: PrioritySchema.optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional()
})

// Export inferred types for TypeScript
export type Task = z.infer<typeof TaskSchema>
export type TaskStatus = z.infer<typeof TaskStatusSchema>
export type Priority = z.infer<typeof PrioritySchema>
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>
export type TaskQuery = z.infer<typeof TaskQuerySchema>

// Helper function to safely parse and validate data
export function parseTask(data: unknown): Task {
  return TaskSchema.parse(data)
}

export function parseCreateTaskRequest(data: unknown): CreateTaskRequest {
  return CreateTaskSchema.parse(data)
}

export function parseUpdateTaskRequest(data: unknown): UpdateTaskRequest {
  return UpdateTaskSchema.parse(data)
}

// Validation helpers for form fields
export const ValidationHelpers = {
  isValidTitle: (title: string): boolean => {
    try {
      z.string().min(1).max(100).parse(title)
      return true
    } catch {
      return false
    }
  },
  
  isValidDescription: (description: string): boolean => {
    try {
      z.string().max(500).parse(description)
      return true
    } catch {
      return false
    }
  },
  
  getFieldError: (schema: z.ZodSchema, data: unknown, field: string): string | null => {
    try {
      schema.parse(data)
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues?.find(err => err.path[0] === field)
        return fieldError?.message ?? null
      }
      return null
    }
  }
}