# Unified Project Structure

## Complete Directory Structure

```
bmad-kanban-board/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yml             # Test and build pipeline
│       └── deploy.yml         # Docker build and deploy
├── src/                       # SvelteKit application
│   ├── lib/
│   │   ├── components/        # Svelte components
│   │   │   ├── ui/            # Reusable DaisyUI components
│   │   │   ├── kanban/        # Kanban-specific components
│   │   │   ├── forms/         # Form components
│   │   │   └── layout/        # Layout components
│   │   ├── stores/            # Svelte stores for state
│   │   │   ├── tasks.ts
│   │   │   ├── ui.ts
│   │   │   └── ai.ts
│   │   ├── services/          # Frontend service layer
│   │   │   ├── api.ts
│   │   │   ├── task-service.ts
│   │   │   └── storage.ts
│   │   ├── server/            # Server-side code
│   │   │   ├── services/      # Backend services
│   │   │   │   ├── task-service.ts
│   │   │   │   └── ai-service.ts
│   │   │   ├── storage/       # Data access layer
│   │   │   │   └── localStorage-adapter.ts
│   │   │   └── validation/    # Request validation
│   │   │       └── schemas.ts
│   │   ├── types/             # Shared TypeScript types
│   │   │   └── index.ts
│   │   └── utils/             # Shared utilities
│   │       ├── date-helpers.ts
│   │       ├── drag-drop.ts
│   │       └── validation.ts
│   ├── routes/                # SvelteKit routes
│   │   ├── +layout.svelte     # Root layout
│   │   ├── +page.svelte       # Main Kanban board
│   │   ├── +error.svelte      # Error boundary
│   │   └── api/               # API endpoints
│   │       ├── tasks/
│   │       │   ├── +server.ts
│   │       │   └── [id]/+server.ts
│   │       ├── ai/
│   │       │   ├── create-task/+server.ts
│   │       │   └── search/+server.ts
│   │       └── health/+server.ts
│   ├── static/                # Static assets
│   │   ├── favicon.ico
│   │   └── robots.txt
│   └── app.html              # HTML template
├── tests/                     # Test suites
│   ├── unit/                 # Vitest unit tests
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/          # API integration tests
│   │   └── api/
│   └── e2e/                  # Playwright E2E tests
│       ├── kanban.spec.ts
│       └── ai-features.spec.ts
├── docker/                   # Docker configuration
│   ├── Dockerfile           # Multi-stage production build
│   ├── docker-compose.yml   # Local development setup
│   └── .dockerignore
├── scripts/                  # Build and deployment scripts
│   ├── build.sh
│   ├── test.sh
│   └── deploy.sh
├── docs/                     # Project documentation
│   ├── prd.md
│   ├── architecture/        # Sharded architecture docs
│   │   ├── index.md
│   │   ├── tech-stack.md
│   │   ├── data-models.md
│   │   └── [other-arch-files].md
│   ├── stories/             # Development stories
│   └── development-guide.md
├── .env.example             # Environment variables template
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tailwind.config.js      # Tailwind/DaisyUI configuration
├── vite.config.ts          # Vite configuration
├── svelte.config.js        # SvelteKit configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md              # Project overview and setup
```

## Directory Purposes

### Source Code (`src/`)

#### Component Organization (`lib/components/`)
- **`ui/`** - Reusable DaisyUI-based components (Button, Modal, Toast, etc.)
- **`kanban/`** - Kanban-specific components (KanbanBoard, KanbanColumn, TaskCard)
- **`forms/`** - Form-related components (TaskForm, AITaskCreator, SearchBar)
- **`layout/`** - Layout components (Header, Navigation, ErrorBoundary)

#### State Management (`lib/stores/`)
- **`tasks.ts`** - Task data and CRUD operations
- **`ui.ts`** - UI state (loading, errors, modals)
- **`ai.ts`** - AI service state and request tracking

#### Service Layer (`lib/services/`)
- **`api.ts`** - HTTP client and API communication
- **`task-service.ts`** - Task business logic and data operations
- **`storage.ts`** - localStorage abstraction and data persistence

#### Server-Side Code (`lib/server/`)
- **`services/`** - Backend business logic and external API integration
- **`storage/`** - Data access layer and storage adapters
- **`validation/`** - Request/response validation schemas

#### Shared Code (`lib/types/` & `lib/utils/`)
- **`types/`** - TypeScript interfaces and type definitions
- **`utils/`** - Shared utility functions and helpers

#### Routing (`routes/`)
- **`+layout.svelte`** - Root application layout
- **`+page.svelte`** - Main Kanban board page
- **`api/`** - SvelteKit API routes for REST endpoints

### Testing (`tests/`)

#### Test Organization
- **`unit/`** - Component and function unit tests
- **`integration/`** - API endpoint and service integration tests
- **`e2e/`** - End-to-end user workflow tests

### Infrastructure

#### Docker (`docker/`)
- **`Dockerfile`** - Multi-stage production container build
- **`docker-compose.yml`** - Local development environment
- **`.dockerignore`** - Docker build context exclusions

#### Scripts (`scripts/`)
- **`build.sh`** - Production build automation
- **`test.sh`** - Test suite execution
- **`deploy.sh`** - Deployment automation

#### Documentation (`docs/`)
- **`architecture/`** - Sharded architecture documentation
- **`stories/`** - Development stories and specifications
- **`prd.md`** - Product Requirements Document

### Configuration Files

#### Development Tools
- **`.eslintrc.js`** - JavaScript/TypeScript linting rules
- **`.prettierrc`** - Code formatting configuration
- **`tsconfig.json`** - TypeScript compiler options

#### Build & Framework
- **`vite.config.ts`** - Vite build tool configuration
- **`svelte.config.js`** - SvelteKit framework configuration
- **`tailwind.config.js`** - Tailwind CSS and DaisyUI setup

#### Environment
- **`.env.example`** - Environment variable template
- **`package.json`** - Dependencies, scripts, and project metadata

## File Naming Conventions

### Components
- **Svelte Components**: PascalCase with `.svelte` extension
  - `TaskCard.svelte`, `KanbanBoard.svelte`
- **TypeScript Files**: kebab-case with `.ts` extension
  - `task-service.ts`, `api-client.ts`

### Routes
- **SvelteKit Routes**: Follow SvelteKit conventions
  - `+page.svelte`, `+layout.svelte`, `+server.ts`
  - Dynamic routes: `[id]/+server.ts`

### Tests
- **Test Files**: Match source file with `.test.ts` suffix
  - `TaskCard.test.ts`, `task-service.test.ts`

### Configuration
- **Config Files**: Use standard names for tooling recognition
  - `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`

## Import Path Standards

### Path Aliases (configured in `vite.config.ts`)
```typescript
// Absolute imports using $lib alias
import { TaskCard } from '$lib/components/kanban/TaskCard.svelte'
import type { Task } from '$lib/types'
import { taskService } from '$lib/services/task-service'

// API routes
import type { RequestHandler } from './$types'
```

### Import Organization
```typescript
// 1. External libraries
import { writable } from 'svelte/store'
import type { Task } from '$lib/types'

// 2. Internal modules (services, utilities)
import { apiClient } from '$lib/services/api'
import { validateTask } from '$lib/utils/validation'

// 3. Relative imports (same directory)
import './Component.svelte'
```

## Build Output Structure

### Development
- Vite dev server serves from `src/`
- Hot module replacement for rapid development
- Source maps for debugging

### Production
- Optimized bundle in `build/` directory
- Static assets with cache-friendly names
- Server-side rendering for initial page load

This structure supports:
- **Scalability**: Clear separation of concerns and modular organization
- **Maintainability**: Consistent file organization and naming
- **Developer Experience**: Logical grouping and easy navigation
- **Build Optimization**: Efficient bundling and code splitting