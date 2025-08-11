# Components

## System Components Overview

The BMad Kanban Board architecture is composed of several key components that work together to provide a cohesive AI-enhanced task management experience.

## Web Application Layer

**Responsibility:** Primary SvelteKit application handling UI rendering, user interactions, and client-side state management with localStorage persistence.

**Key Interfaces:**
- HTTP endpoints for API communication
- Browser localStorage API for data persistence
- Drag and drop events for task movement
- Real-time UI updates via Svelte reactivity

**Dependencies:** AI Service Layer, Browser APIs, DaisyUI components

**Technology Stack:** SvelteKit, TypeScript, Svelte Stores, DaisyUI, Tailwind CSS

## AI Service Layer

**Responsibility:** Abstracts AI functionality using Vercel AI SDK for task creation and semantic search, providing streaming responses and error handling.

**Key Interfaces:**
- REST API endpoints `/api/ai/create-task` and `/api/ai/search`
- Vercel AI SDK streaming interface
- OpenAI provider integration
- Task data transformation pipeline

**Dependencies:** OpenAI API, Vercel AI SDK, Data Models

**Technology Stack:** Vercel AI SDK, OpenAI API, SvelteKit API routes, TypeScript

## Data Management Layer

**Responsibility:** Handles all data persistence, retrieval, and synchronization using localStorage as the primary storage mechanism with reactive state updates.

**Key Interfaces:**
- localStorage read/write operations
- Svelte store subscriptions and updates
- Data validation and serialization
- State synchronization across components

**Dependencies:** Browser localStorage, Svelte Stores, TypeScript interfaces

**Technology Stack:** Browser localStorage API, Svelte Stores, TypeScript

## API Gateway Component

**Responsibility:** SvelteKit API routes providing RESTful interface for task CRUD operations and AI service coordination.

**Key Interfaces:**
- HTTP REST API endpoints
- Request/response validation
- Error handling and formatting
- AI service orchestration

**Dependencies:** Data Management Layer, AI Service Layer

**Technology Stack:** SvelteKit API routes, TypeScript, HTTP standards

## UI Component Library

**Responsibility:** Reusable Svelte components built on DaisyUI foundation, providing consistent, accessible, and responsive user interface elements.

**Key Interfaces:**
- Svelte component props and events
- DaisyUI component integration
- Tailwind CSS utility classes
- Accessibility (ARIA) attributes

**Dependencies:** DaisyUI, Tailwind CSS, Svelte framework

**Technology Stack:** Svelte, DaisyUI, Tailwind CSS, TypeScript

## Container Runtime

**Responsibility:** Docker containerization providing consistent deployment environment and dependency management across development and production.

**Key Interfaces:**
- HTTP port exposure (5173)
- Environment variable configuration
- Health check endpoints
- Multi-stage build optimization

**Dependencies:** Node.js runtime, SvelteKit build system

**Technology Stack:** Docker, Alpine Linux, Node.js

## Component Architecture Diagram

```mermaid
graph TB
    User[User] --> WebApp[Web Application Layer]

    subgraph "SvelteKit Container"
        WebApp --> UILib[UI Component Library]
        WebApp --> DataMgmt[Data Management Layer]
        WebApp --> APIGateway[API Gateway Component]

        APIGateway --> AIService[AI Service Layer]
        DataMgmt --> LocalStorage[(localStorage)]

        subgraph "AI Integration"
            AIService --> AISDK[Vercel AI SDK]
            AISDK --> OpenAI[OpenAI API]
        end
    end

    subgraph "External Services"
        OpenAI
    end

    subgraph "Browser Environment"
        LocalStorage
        UILib --> DaisyUI[DaisyUI Components]
        UILib --> Tailwind[Tailwind CSS]
    end

    Container[Docker Container] -.-> WebApp

    style "SvelteKit Container" fill:#e3f2fd
    style "AI Integration" fill:#f3e5f5
    style "Browser Environment" fill:#e8f5e8
    style "External Services" fill:#fff3e0
```

## Component Interactions

### Data Flow
1. **User Input** → Web Application Layer
2. **State Changes** → Data Management Layer → localStorage
3. **AI Requests** → API Gateway → AI Service Layer → OpenAI API
4. **UI Updates** → UI Component Library → DaisyUI components

### Component Dependencies
- **Web Application Layer** depends on all other components
- **AI Service Layer** is isolated and can be disabled without breaking core functionality
- **Data Management Layer** provides persistence abstraction
- **UI Component Library** handles all visual presentation
- **Container Runtime** encapsulates the entire application

### Scalability Considerations
- Each component is designed for independent scaling
- AI Service Layer can be enhanced with caching and rate limiting
- Data Management Layer can be migrated to external databases
- UI Component Library supports progressive enhancement