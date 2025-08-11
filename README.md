# BMad - AI-Enhanced Kanban Board

A modern, AI-enhanced Kanban board built with SvelteKit, featuring comprehensive component documentation via Storybook.

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Start Storybook for component development
yarn storybook
```

## Component Development

This project follows a comprehensive component development workflow with mandatory Storybook stories:

### Creating Components
```bash
# 1. Create your component
# src/lib/components/ui/MyComponent.svelte

# 2. Generate Storybook story automatically
yarn create-story src/lib/components/ui/MyComponent.svelte

# 3. Start interactive development
yarn storybook  # Opens http://localhost:6007
```

### Development Requirements
Every UI component must have:
- ✅ Component implementation (.svelte)
- ✅ Storybook stories (.stories.svelte) - **REQUIRED**
- ✅ Unit tests (.test.ts)
- ✅ Documentation (JSDoc)

## Available Scripts

```bash
# Development
yarn dev                  # Start development server
yarn storybook           # Start Storybook (component dev/docs)

# Component Creation  
yarn create-story <path> # Generate story for component

# Quality Assurance
yarn test:unit           # Run unit tests
yarn lint                # Check code quality
yarn type-check          # TypeScript validation
yarn format              # Format code

# Build
yarn build               # Production build
yarn build-storybook     # Build Storybook for deployment

# Docker Commands
./scripts/build.sh       # Build Docker image
./scripts/test.sh        # Test Docker container
./scripts/deploy.sh      # Deploy to production
```

## Docker Deployment

The application is containerized using Docker with multi-stage builds for optimized production deployment.

### Prerequisites

- Docker ^24.0.0
- Docker Compose (for development)
- 2GB+ available memory

### Quick Docker Setup

```bash
# Build the Docker image
./scripts/build.sh

# Test the container
./scripts/test.sh

# Deploy to production
./scripts/deploy.sh
```

### Development with Docker Compose

```bash
# Development mode with hot reload
docker-compose --profile dev up app-dev

# Production mode
docker-compose up app

# Build and run
docker-compose up --build app
```

### Manual Docker Commands

```bash
# Build image
docker build -f docker/Dockerfile -t bmad-kanban:latest .

# Run production container
docker run -d \
  --name bmad-kanban \
  -p 3000:3000 \
  -e NODE_ENV=production \
  bmad-kanban:latest

# Check health
curl http://localhost:3000/api/health
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Health Check Configuration  
HEALTH_CHECK_INTERVAL=30
HEALTH_CHECK_TIMEOUT=10

# Performance Configuration
NODE_OPTIONS="--max-old-space-size=512"
```

### Container Features

- **Multi-stage build**: Optimized for production (Alpine Linux)
- **Non-root user**: Runs as dedicated `sveltekit` user for security
- **Health checks**: Built-in health monitoring at `/api/health`
- **Development support**: Hot reload with volume mounts
- **Security**: Minimal attack surface with Alpine base image

### Troubleshooting

#### Container Won't Start
```bash
# Check container logs
docker logs bmad-kanban

# Check image exists
docker images | grep bmad-kanban

# Verify port availability
lsof -i :3000
```

#### Health Check Fails
```bash
# Test health endpoint directly
curl -v http://localhost:3000/api/health

# Check container health status
docker inspect --format='{{.State.Health.Status}}' bmad-kanban
```

#### Build Failures
```bash
# Clear Docker cache
docker system prune -f

# Build with no cache
docker build --no-cache -f docker/Dockerfile -t bmad-kanban:latest .

# Check Docker daemon
docker info
```

## Documentation

- [Component Development Workflow](docs/COMPONENT_DEVELOPMENT_WORKFLOW.md) - Complete development process
- [Storybook Guide](docs/STORYBOOK_GUIDE.md) - Story creation best practices  
- [AI Developer Prompts](docs/AI_DEVELOPER_PROMPTS.md) - Templates for AI-assisted development
- [Architecture](docs/architecture/) - Technical architecture and standards

## Technology Stack

- **Frontend**: SvelteKit, TypeScript, DaisyUI, Tailwind CSS
- **Documentation**: Storybook with interactive component testing
- **Testing**: Vitest, Testing Library
- **Containerization**: Docker with multi-stage builds, Alpine Linux
- **Development**: AI-assisted development with BMad method

## Project Structure

```
src/
├── lib/
│   ├── components/           # UI components
│   │   ├── ui/              # Basic UI components  
│   │   ├── kanban/          # Kanban-specific components
│   │   └── *.stories.svelte # Storybook stories (required)
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
├── routes/                  # SvelteKit routes
│   └── api/health/          # Health check endpoint
└── stories/                 # Example Storybook stories

docker/                      # Docker configuration
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml       # Local development setup
└── .dockerignore           # Docker build context exclusions

scripts/                     # Build and deployment automation
├── build.sh                 # Docker image build script
├── test.sh                  # Container testing script
└── deploy.sh                # Production deployment script

docs/                        # Project documentation
tests/                       # Unit tests
.env.example                 # Environment configuration template
```

## Storybook Integration

Access interactive component documentation at **http://localhost:6007**

Features:
- Interactive component testing
- Visual regression testing capability
- Accessibility testing with a11y addon
- Comprehensive component documentation
- Theme switching (light/dark)

---

Built with the BMad development method - comprehensive, AI-enhanced, and documentation-driven development.
