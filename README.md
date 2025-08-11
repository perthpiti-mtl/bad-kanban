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
└── stories/                 # Example Storybook stories

docs/                        # Project documentation
tests/                       # Unit tests
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
