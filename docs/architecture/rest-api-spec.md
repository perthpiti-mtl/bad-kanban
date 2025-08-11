# REST API Specification

## OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: BMad Method Kanban Board API
  version: 1.0.0
  description: REST API for AI-enhanced Kanban task management demonstration
servers:
  - url: http://localhost:5173/api
    description: Local development server
  - url: https://bmad-kanban.example.com/api
    description: Production server

paths:
  /tasks:
    get:
      summary: Get all tasks
      description: Retrieve all tasks from localStorage
      parameters:
        - name: status
          in: query
          description: Filter tasks by status
          required: false
          schema:
            type: string
            enum: [todo, in-progress, done]
        - name: priority
          in: query
          description: Filter tasks by priority
          required: false
          schema:
            type: string
            enum: [high, medium, low]
      responses:
        '200':
          description: List of tasks
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create new task
      description: Create a new task (manual or AI-assisted)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskRequest'
      responses:
        '201':
          description: Task created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '400':
          description: Invalid request data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /tasks/{id}:
    get:
      summary: Get task by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Task details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '404':
          description: Task not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      summary: Update task
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTaskRequest'
      responses:
        '200':
          description: Task updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '404':
          description: Task not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      summary: Delete task
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Task deleted successfully
        '404':
          description: Task not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /ai/create-task:
    post:
      summary: AI-powered task creation
      description: Create task from natural language input using Vercel AI SDK
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                  description: Natural language task description
                  example: "I need to prepare for tomorrow's client presentation"
              required:
                - prompt
      responses:
        '200':
          description: AI-generated task created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '400':
          description: Invalid prompt or AI service error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: AI service rate limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /ai/search:
    post:
      summary: AI-powered task search
      description: Search tasks using natural language queries
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: Natural language search query
                  example: 'show me tasks related to presentations'
              required:
                - query
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
                  query:
                    type: string
                  relevanceScores:
                    type: array
                    items:
                      type: number
                      description: Relevance score (0-1) for each result
        '400':
          description: Invalid search query
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: string
          example: 'task-123-abc'
        title:
          type: string
          example: 'Prepare client presentation'
        description:
          type: string
          example: 'Create slides and talking points for Q4 review meeting'
        status:
          type: string
          enum: [todo, in-progress, done]
          example: 'todo'
        priority:
          type: string
          enum: [high, medium, low]
          example: 'high'
        dueDate:
          type: string
          format: date-time
          nullable: true
          example: '2025-08-12T09:00:00Z'
        createdAt:
          type: string
          format: date-time
          example: '2025-08-11T10:30:00Z'
        updatedAt:
          type: string
          format: date-time
          example: '2025-08-11T10:30:00Z'
        aiGenerated:
          type: boolean
          example: true
        originalPrompt:
          type: string
          nullable: true
          example: "I need to prepare for tomorrow's client presentation"
      required:
        - id
        - title
        - description
        - status
        - priority
        - createdAt
        - updatedAt
        - aiGenerated

    CreateTaskRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        priority:
          type: string
          enum: [high, medium, low]
          default: 'medium'
        dueDate:
          type: string
          format: date-time
          nullable: true
      required:
        - title

    UpdateTaskRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        status:
          type: string
          enum: [todo, in-progress, done]
        priority:
          type: string
          enum: [high, medium, low]
        dueDate:
          type: string
          format: date-time
          nullable: true

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              example: 'TASK_NOT_FOUND'
            message:
              type: string
              example: 'Task with specified ID does not exist'
            details:
              type: object
              nullable: true
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              example: 'req-abc123'
          required:
            - code
            - message
            - timestamp
            - requestId
```

## API Implementation Notes

### SvelteKit API Routes Structure
```
src/routes/api/
├── tasks/
│   ├── +server.ts              # GET/POST /api/tasks
│   └── [id]/
│       └── +server.ts          # GET/PUT/DELETE /api/tasks/[id]
├── ai/
│   ├── create-task/
│   │   └── +server.ts          # POST /api/ai/create-task
│   └── search/
│       └── +server.ts          # POST /api/ai/search
└── health/
    └── +server.ts              # GET /api/health
```

### Error Handling
All API endpoints use consistent error response format:
- Standard HTTP status codes
- Structured error objects with code, message, timestamp
- Request ID for debugging and tracing
- Detailed error context when applicable

### AI Integration
- Vercel AI SDK handles OpenAI API calls
- Streaming responses for real-time user feedback
- Rate limiting and error handling built-in
- Fallback behavior when AI services unavailable

### Authentication
- Not implemented in MVP (public demo)
- Future enhancement would add JWT tokens
- Current endpoints are open access