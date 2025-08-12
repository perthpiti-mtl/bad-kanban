import { describe, test, expect } from 'vitest'
import { 
  TaskSchema, 
  CreateTaskSchema, 
  UpdateTaskSchema,
  TaskStatusSchema,
  PrioritySchema,
  ValidationHelpers,
  parseTask,
  parseCreateTaskRequest,
  parseUpdateTaskRequest
} from '$lib/types/schemas'
import { ZodError } from 'zod'

describe('TaskSchema', () => {
  const validTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    aiGenerated: false,
    originalPrompt: null
  }

  test('validates valid task data', () => {
    expect(() => TaskSchema.parse(validTask)).not.toThrow()
  })

  test('rejects invalid task ID format', () => {
    const invalidTask = { ...validTask, id: 'invalid-id' }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('rejects empty title', () => {
    const invalidTask = { ...validTask, title: '' }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('rejects title longer than 100 characters', () => {
    const invalidTask = { 
      ...validTask, 
      title: 'a'.repeat(101) 
    }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('rejects description longer than 500 characters', () => {
    const invalidTask = { 
      ...validTask, 
      description: 'a'.repeat(501) 
    }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('rejects invalid status', () => {
    const invalidTask = { ...validTask, status: 'invalid' }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('rejects invalid priority', () => {
    const invalidTask = { ...validTask, priority: 'invalid' }
    expect(() => TaskSchema.parse(invalidTask)).toThrow(ZodError)
  })

  test('provides meaningful error messages', () => {
    expect(() => TaskSchema.parse({ ...validTask, title: '' })).toThrow()
    try {
      TaskSchema.parse({ ...validTask, title: '' })
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError)
      if (error instanceof ZodError) {
        expect(error.issues).toBeDefined()
        expect(error.issues.length).toBeGreaterThan(0)
        const titleError = error.issues.find(err => err.path[0] === 'title')
        expect(titleError?.message).toBe('Title is required')
      }
    }
  })
})

describe('TaskStatusSchema', () => {
  test('accepts valid statuses', () => {
    expect(() => TaskStatusSchema.parse('todo')).not.toThrow()
    expect(() => TaskStatusSchema.parse('in-progress')).not.toThrow()
    expect(() => TaskStatusSchema.parse('done')).not.toThrow()
  })

  test('rejects invalid statuses', () => {
    expect(() => TaskStatusSchema.parse('invalid')).toThrow(ZodError)
    expect(() => TaskStatusSchema.parse('')).toThrow(ZodError)
  })
})

describe('PrioritySchema', () => {
  test('accepts valid priorities', () => {
    expect(() => PrioritySchema.parse('high')).not.toThrow()
    expect(() => PrioritySchema.parse('medium')).not.toThrow()
    expect(() => PrioritySchema.parse('low')).not.toThrow()
  })

  test('rejects invalid priorities', () => {
    expect(() => PrioritySchema.parse('invalid')).toThrow(ZodError)
    expect(() => PrioritySchema.parse('')).toThrow(ZodError)
  })
})

describe('CreateTaskSchema', () => {
  const validCreateTask = {
    title: 'New Task',
    description: 'Task description',
    status: 'todo' as const,
    priority: 'high' as const,
    dueDate: new Date(),
    aiGenerated: false,
    originalPrompt: null
  }

  test('validates valid create task data', () => {
    expect(() => CreateTaskSchema.parse(validCreateTask)).not.toThrow()
  })

  test('accepts data without id field', () => {
    expect(() => CreateTaskSchema.parse(validCreateTask)).not.toThrow()
  })

  test('successfully parses create task data', () => {
    const result = CreateTaskSchema.parse(validCreateTask)
    expect(result).toEqual(validCreateTask)
  })
})

describe('UpdateTaskSchema', () => {
  test('validates partial update with id', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Title'
    }
    expect(() => UpdateTaskSchema.parse(updateData)).not.toThrow()
  })

  test('requires id field', () => {
    const invalidData = { title: 'Updated Title' }
    expect(() => UpdateTaskSchema.parse(invalidData)).toThrow(ZodError)
  })

  test('accepts all fields as optional except id', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000'
    }
    expect(() => UpdateTaskSchema.parse(updateData)).not.toThrow()
  })
})

describe('Parser functions', () => {
  const validTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    aiGenerated: false,
    originalPrompt: null
  }

  test('parseTask returns valid task', () => {
    const result = parseTask(validTask)
    expect(result).toEqual(validTask)
  })

  test('parseTask throws on invalid data', () => {
    expect(() => parseTask({ ...validTask, title: '' })).toThrow(ZodError)
  })

  test('parseCreateTaskRequest works correctly', () => {
    const createData = {
      title: 'New Task',
      description: 'Description',
      status: 'todo' as const,
      priority: 'high' as const,
      dueDate: null,
      aiGenerated: false,
      originalPrompt: null
    }
    const result = parseCreateTaskRequest(createData)
    expect(result).toEqual(createData)
  })

  test('parseUpdateTaskRequest works correctly', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Title'
    }
    const result = parseUpdateTaskRequest(updateData)
    expect(result).toEqual(updateData)
  })
})

describe('ValidationHelpers', () => {
  test('isValidTitle validates correctly', () => {
    expect(ValidationHelpers.isValidTitle('Valid Title')).toBe(true)
    expect(ValidationHelpers.isValidTitle('')).toBe(false)
    expect(ValidationHelpers.isValidTitle('a'.repeat(101))).toBe(false)
  })

  test('isValidDescription validates correctly', () => {
    expect(ValidationHelpers.isValidDescription('Valid description')).toBe(true)
    expect(ValidationHelpers.isValidDescription('')).toBe(true) // Empty is allowed
    expect(ValidationHelpers.isValidDescription('a'.repeat(501))).toBe(false)
  })

  test('getFieldError returns correct error message', () => {
    const schema = TaskSchema
    const invalidData = { 
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: '',
      description: '',
      status: 'todo' as const,
      priority: 'high' as const,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiGenerated: false,
      originalPrompt: null
    }
    
    const error = ValidationHelpers.getFieldError(schema, invalidData, 'title')
    expect(error).toBe('Title is required')
  })

  test('getFieldError returns null for valid data', () => {
    const schema = TaskSchema
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Valid Title',
      description: 'Description',
      status: 'todo' as const,
      priority: 'high' as const,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiGenerated: false,
      originalPrompt: null
    }
    
    const error = ValidationHelpers.getFieldError(schema, validData, 'title')
    expect(error).toBeNull()
  })
})