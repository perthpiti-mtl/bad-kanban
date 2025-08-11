# Component Development Workflow

This document outlines the complete workflow for developing UI components with Storybook integration in our project.

## Overview

Every UI component in our project should have:
1. ✅ **Component Implementation** - The `.svelte` file
2. ✅ **Storybook Stories** - Interactive documentation and testing
3. ✅ **Unit Tests** - Automated testing for component logic
4. ✅ **Documentation** - Clear usage guidelines

## Development Process

### 1. Create Component

First, create your component in the appropriate directory:

```bash
# Component structure
src/lib/components/
├── ui/           # Basic UI components (buttons, inputs, etc.)
├── layout/       # Layout components (headers, sidebars, etc.)
├── forms/        # Form-related components
├── kanban/       # Domain-specific components
└── shared/       # Shared/common components
```

### 2. Create Storybook Story

**Automated Method (Recommended):**
```bash
# Create story automatically
yarn create-story src/lib/components/ui/MyComponent.svelte
```

**Manual Method:**
Create `ComponentName.stories.svelte` alongside your component following the [Storybook Guide](./STORYBOOK_GUIDE.md).

### 3. Develop in Storybook

Start Storybook for interactive development:

```bash
yarn storybook
# Opens at http://localhost:6006
```

**Note:** If you encounter Yarn PnP issues with Storybook, try:
```bash
# Alternative: Use Node.js resolution
yarn config set nodeLinker node-modules
yarn install
yarn storybook
```

### 4. Create Unit Tests

Add unit tests in the `tests/unit/components/` directory:

```typescript
// tests/unit/components/ui/MyComponent.test.ts
import { render } from '@testing-library/svelte'
import MyComponent from '$lib/components/ui/MyComponent.svelte'

describe('MyComponent', () => {
  test('renders correctly', () => {
    const { getByRole } = render(MyComponent, { 
      props: { /* test props */ } 
    })
    
    // Add assertions
  })
})
```

Run tests:
```bash
yarn test:unit
```

### 5. Development Checklist

Before considering a component complete, ensure:

#### Component Implementation
- [ ] Component follows established coding standards
- [ ] Props are properly typed with TypeScript
- [ ] Component handles edge cases (empty data, loading states, errors)
- [ ] Accessibility attributes are included (ARIA labels, roles, etc.)
- [ ] Component is responsive and works on mobile
- [ ] CSS classes follow Tailwind/DaisyUI conventions

#### Storybook Stories
- [ ] Default story shows typical usage
- [ ] Stories cover all prop variants
- [ ] Edge cases are demonstrated (empty states, long content, etc.)
- [ ] Interactive states are shown (hover, focus, disabled)
- [ ] Component description and prop documentation is complete
- [ ] Stories use realistic sample data

#### Testing
- [ ] Unit tests cover main functionality
- [ ] Edge cases are tested
- [ ] Event handlers are tested
- [ ] All tests pass (`yarn test:unit`)

#### Documentation
- [ ] Component has clear JSDoc comments
- [ ] Props are documented with descriptions
- [ ] Usage examples are provided in stories
- [ ] Any special setup or dependencies are noted

## Component Story Patterns

### Basic UI Components

For buttons, inputs, badges, etc.:

```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Button from './Button.svelte'

	const { Story } = defineMeta({
		title: 'Components/UI/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['primary', 'secondary', 'outline']
			},
			size: {
				control: 'select', 
				options: ['sm', 'md', 'lg']
			},
			disabled: { control: 'boolean' }
		}
	})
</script>

<Story name="Primary" args={{ variant: 'primary', children: 'Click me' }} />
<Story name="Secondary" args={{ variant: 'secondary', children: 'Click me' }} />
<Story name="Disabled" args={{ disabled: true, children: 'Can\\'t click' }} />
```

### Data Display Components

For components that display data:

```svelte
<Story name="Default" args={{ items: sampleData }} />
<Story name="Empty State" args={{ items: [] }} />
<Story name="Loading" args={{ loading: true }} />
<Story name="Error State" args={{ error: 'Failed to load data' }} />
<Story name="Large Dataset" args={{ items: largeDataset }} />
```

### Form Components

For input and form components:

```svelte
<Story name="Default" />
<Story name="With Value" args={{ value: 'Sample input' }} />
<Story name="Invalid" args={{ error: 'This field is required' }} />
<Story name="Disabled" args={{ disabled: true }} />
<Story name="With Help Text" args={{ help: 'Enter your email address' }} />
```

## Testing Strategy

### Unit Tests

Focus on testing:
- Component rendering with different props
- Event handling and user interactions
- Edge cases and error states
- Accessibility features

### Storybook Testing

Storybook stories serve as:
- Visual regression tests (with Chromatic)
- Integration tests for component interactions
- Documentation for component usage
- Manual testing environment

### Example Test Structure

```typescript
describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    status: 'todo',
    priority: 'medium'
  }

  test('renders task information correctly', () => {
    const { getByText } = render(TaskCard, { props: { task: mockTask } })
    expect(getByText('Test Task')).toBeInTheDocument()
    expect(getByText('Test description')).toBeInTheDocument()
  })

  test('handles click events', async () => {
    const { component, getByRole } = render(TaskCard, { 
      props: { task: mockTask } 
    })
    
    let clickedTask
    component.$on('click', (event) => {
      clickedTask = event.detail.task
    })

    await fireEvent.click(getByRole('button'))
    expect(clickedTask).toEqual(mockTask)
  })

  test('truncates long descriptions', () => {
    const longTask = {
      ...mockTask,
      description: 'A'.repeat(200) // Very long description
    }
    
    const { container } = render(TaskCard, { props: { task: longTask } })
    const description = container.querySelector('[data-testid="task-description"]')
    expect(description.textContent.length).toBeLessThan(200)
  })
})
```

## Quality Gates

Before marking a component as complete:

1. **All tests pass**: `yarn test:unit`
2. **Linting passes**: `yarn lint`
3. **Type checking passes**: `yarn type-check`
4. **Storybook builds successfully**: `yarn build-storybook`
5. **Manual testing in Storybook**: All stories render correctly
6. **Accessibility testing**: Use Storybook's a11y addon
7. **Responsive testing**: Test on different screen sizes

## Maintenance

### Updating Existing Components

When modifying components:

1. Update the component implementation
2. Update or add new stories for changed behavior
3. Update tests to match new functionality
4. Update documentation if API changes
5. Run full test suite to ensure no regressions

### Deprecating Components

When removing components:

1. Mark as deprecated in stories with warning
2. Update documentation with migration guide
3. Remove after appropriate transition period

## Common Patterns

### Loading States
```svelte
{#if loading}
  <div class="skeleton h-4 w-full"></div>
{:else}
  <!-- Component content -->
{/if}
```

### Error States
```svelte
{#if error}
  <div class="alert alert-error">
    <span>{error}</span>
  </div>
{/if}
```

### Empty States
```svelte
{#if items.length === 0}
  <div class="text-center py-8 text-gray-500">
    No items to display
  </div>
{/if}
```

## Resources

- [Storybook Guide](./STORYBOOK_GUIDE.md) - Detailed Storybook usage
- [Testing Strategy](./architecture/testing-strategy.md) - Testing guidelines
- [Coding Standards](./architecture/coding-standards.md) - Code quality standards
- [Component Architecture](./architecture/components.md) - Component design patterns

---

Following this workflow ensures consistent, well-tested, and documented components that enhance developer experience and maintain code quality.