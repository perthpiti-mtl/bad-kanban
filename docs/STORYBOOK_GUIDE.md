# Storybook Component Stories Guide

This guide outlines best practices for creating and maintaining component stories in our Storybook setup.

## Overview

Storybook is integrated into our SvelteKit project to provide:
- Interactive component development and testing
- Visual documentation for UI components
- Isolated component testing environments
- Design system consistency checks

## Getting Started

### Running Storybook

```bash
# Start Storybook development server
yarn storybook

# Build Storybook for production
yarn build-storybook
```

Storybook will be available at `http://localhost:6006`

## Story Structure

### File Naming Convention

Stories should be placed alongside their components with the `.stories.svelte` extension:

```
src/lib/components/
├── ui/
│   ├── Button.svelte
│   └── Button.stories.svelte
├── kanban/
│   ├── TaskCard.svelte
│   ├── TaskCard.stories.svelte
│   ├── KanbanColumn.svelte
│   └── KanbanColumn.stories.svelte
```

### Basic Story Template

```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import YourComponent from './YourComponent.svelte'

	const { Story } = defineMeta({
		title: 'Components/Category/YourComponent',
		component: YourComponent,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'Brief description of what this component does and its purpose.'
				}
			}
		},
		argTypes: {
			// Define controls for component props
			propName: {
				description: 'Description of the prop',
				control: 'text' // or 'select', 'boolean', 'object', etc.
			}
		},
		args: {
			// Default values for props
			propName: 'default value'
		}
	})
</script>

<!-- Default story -->
<Story name="Default" />

<!-- Variant stories -->
<Story name="Variant Name" args={{ propName: 'variant value' }} />
```

## Story Categories

### Title Hierarchy

Use consistent title patterns for organization:

- `Components/UI/ComponentName` - Basic UI components (buttons, inputs, etc.)
- `Components/Layout/ComponentName` - Layout components (headers, sidebars, etc.)
- `Components/Kanban/ComponentName` - Kanban-specific components
- `Components/Forms/ComponentName` - Form-related components
- `Pages/PageName` - Full page components

### Required Stories

Each component should include these essential stories:

1. **Default** - Component with default props
2. **All Variants** - Each major visual or functional variant
3. **Edge Cases** - Empty states, error states, loading states
4. **Interactive States** - Hover, focus, active, disabled states

## Best Practices

### 1. Comprehensive Coverage

Create stories for all significant component states:

```svelte
<!-- Basic variants -->
<Story name="Default" />
<Story name="Primary" args={{ variant: 'primary' }} />
<Story name="Secondary" args={{ variant: 'secondary' }} />

<!-- States -->
<Story name="Loading" args={{ loading: true }} />
<Story name="Error" args={{ error: 'Something went wrong' }} />
<Story name="Empty" args={{ items: [] }} />

<!-- Interactive states -->
<Story name="Disabled" args={{ disabled: true }} />
<Story name="With Long Content" args={{ content: 'Very long text...' }} />
```

### 2. Realistic Data

Use realistic, representative data in your stories:

```svelte
<script module>
	// Create realistic sample data
	const sampleUser = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: '/images/avatars/john-doe.jpg'
	}

	const sampleTasks = [
		{
			id: '1',
			title: 'Implement user authentication',
			description: 'Create comprehensive auth system...',
			// ... realistic task properties
		}
	]
</script>
```

### 3. Controls Configuration

Provide meaningful controls for props:

```svelte
argTypes: {
	size: {
		description: 'Size variant of the component',
		control: 'select',
		options: ['small', 'medium', 'large']
	},
	disabled: {
		description: 'Whether the component is disabled',
		control: 'boolean'
	},
	items: {
		description: 'Array of items to display',
		control: 'object'
	}
}
```

### 4. Documentation

Add comprehensive documentation:

```svelte
parameters: {
	docs: {
		description: {
			component: `
				# ComponentName
				
				Brief description of the component's purpose and use cases.
				
				## Usage
				
				- When to use this component
				- Key features and capabilities
				- Any important constraints or considerations
			`
		}
	}
}
```

### 5. Accessibility

Include accessibility-focused stories:

```svelte
<Story 
	name="Keyboard Navigation" 
	parameters={{
		docs: {
			description: {
				story: 'Test keyboard navigation with Tab, Enter, and arrow keys.'
			}
		}
	}}
/>

<Story 
	name="Screen Reader" 
	parameters={{
		docs: {
			description: {
				story: 'Verify proper screen reader announcements and ARIA labels.'
			}
		}
	}}
/>
```

## Component-Specific Guidelines

### Form Components

- Include validation states (valid, invalid, pending)
- Show different input types and configurations
- Demonstrate form submission handling

### Data Display Components

- Show empty states, loading states, and error states
- Include examples with minimal and maximum data
- Demonstrate sorting, filtering, and pagination

### Interactive Components

- Show all interaction states (hover, active, focus, disabled)
- Include keyboard navigation examples
- Demonstrate event handling

## Integration with Testing

Stories can be used for automated testing:

```typescript
// Component.test.ts
import { composeStories } from '@storybook/svelte'
import * as stories from './Component.stories.svelte'

const { Default, Loading, Error } = composeStories(stories)

test('renders default state correctly', () => {
	render(Default())
	// Test assertions
})
```

## Maintenance

### Regular Updates

- Update stories when component APIs change
- Add new stories for new features or variants
- Remove obsolete stories for deprecated functionality

### Review Process

- Include story updates in component change reviews
- Verify stories render correctly after component changes
- Update documentation strings as needed

### Performance

- Use realistic but minimal data sets for performance
- Avoid creating stories with excessive data that slow down Storybook
- Use lazy loading for heavy components when possible

## Available Addons

Our Storybook setup includes these addons:

- **@storybook/addon-docs** - Automatic documentation generation
- **@storybook/addon-a11y** - Accessibility testing and reporting
- **@storybook/addon-vitest** - Integration with Vitest testing
- **@chromatic-com/storybook** - Visual regression testing

## Troubleshooting

### Common Issues

1. **Styles not loading** - Ensure `../src/app.css` is imported in `.storybook/preview.ts`
2. **Type errors** - Check that all types are properly imported and exported
3. **Stories not appearing** - Verify the file follows the naming convention `*.stories.svelte`

### Getting Help

- Check the [Storybook documentation](https://storybook.js.org/docs)
- Review existing stories in the codebase for examples
- Test stories in isolation to identify issues

---

By following this guide, you'll create comprehensive, maintainable component stories that improve development workflow and documentation quality.