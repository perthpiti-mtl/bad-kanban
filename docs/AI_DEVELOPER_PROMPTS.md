# AI Developer Prompts & Guidelines

This document provides standard prompts and checklists for AI developers working on the BMad project to ensure consistent component development practices.

## Component Development Prompt Template

When asked to create any UI component, always follow this template:

```
I need to create a comprehensive [ComponentName] component. Please:

1. **Create the component** at src/lib/components/[category]/[ComponentName].svelte
   - Follow TypeScript best practices from docs/architecture/coding-standards.md
   - Include proper accessibility attributes
   - Use DaisyUI and Tailwind CSS styling
   - Implement proper event handling with createEventDispatcher

2. **Create Storybook stories** using:
   - Run: `yarn create-story src/lib/components/[category]/[ComponentName].svelte`
   - Or create manually at [ComponentName].stories.svelte
   - Include these essential stories:
     * Default state
     * All visual/functional variants
     * Edge cases (empty, loading, error states)
     * Interactive states (hover, focus, disabled)
     * Accessibility testing scenarios

3. **Create unit tests** at tests/unit/components/[category]/[ComponentName].test.ts
   - Test component rendering with different props
   - Test event handling and user interactions
   - Test edge cases and error states
   - Test accessibility features

4. **Verify integration**:
   - Run `yarn storybook` to test stories work
   - Run `yarn test:unit` to ensure tests pass
   - Run `yarn type-check` for TypeScript validation
   - Run `yarn lint` for code quality

This ensures every component has interactive documentation, testing, and follows our established patterns.
```

## Quick Component Creation Checklist

Copy this checklist when creating components:

```markdown
## Component Development Checklist

### 🔧 Implementation
- [ ] Component created in correct directory structure
- [ ] TypeScript types defined for all props
- [ ] Proper accessibility attributes (ARIA labels, roles, etc.)
- [ ] Event handlers use createEventDispatcher
- [ ] DaisyUI/Tailwind styling applied
- [ ] Responsive design considerations
- [ ] Error handling for edge cases

### 📚 Storybook Stories  
- [ ] Stories file created ([ComponentName].stories.svelte)
- [ ] Default story implemented
- [ ] All prop variants covered
- [ ] Edge cases demonstrated (empty, loading, error)
- [ ] Interactive states shown (hover, focus, disabled)
- [ ] Component documentation added
- [ ] ArgTypes defined for all props
- [ ] Stories use realistic sample data

### ✅ Testing
- [ ] Unit test file created
- [ ] Component rendering tests
- [ ] Event handling tests
- [ ] Edge case tests
- [ ] Accessibility tests
- [ ] All tests passing

### 🔍 Verification
- [ ] `yarn storybook` - Stories render correctly
- [ ] `yarn test:unit` - All tests pass
- [ ] `yarn type-check` - No TypeScript errors
- [ ] `yarn lint` - Code quality standards met
- [ ] Manual testing in browser
- [ ] Accessibility testing with screen reader
```

## Storybook Story Requirements

Every component story file must include:

### Essential Stories
1. **Default** - Component with typical props
2. **All Variants** - Each visual or functional variant
3. **Edge Cases** - Empty states, error states, loading states
4. **Interactive States** - Hover, focus, active, disabled
5. **Accessibility** - Keyboard navigation, screen reader testing

### Story Template Structure
```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import ComponentName from './ComponentName.svelte'

	const { Story } = defineMeta({
		title: 'Components/[Category]/ComponentName',
		component: ComponentName,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'Detailed component description with usage guidelines'
				}
			}
		},
		argTypes: {
			// Define controls for all props
		},
		args: {
			// Default prop values
		}
	})
</script>

<!-- Required stories -->
<Story name="Default" />
<Story name="Variant Example" args={{ variant: 'example' }} />
<Story name="Edge Case" args={{ items: [] }} />
<Story name="Interactive State" args={{ disabled: true }} />
```

## Common Component Patterns

### Form Components
Always include these stories for form elements:
```svelte
<Story name="Default" />
<Story name="With Value" args={{ value: 'example' }} />
<Story name="Invalid State" args={{ error: 'Required field' }} />
<Story name="Disabled" args={{ disabled: true }} />
<Story name="With Help Text" args={{ help: 'Helper guidance' }} />
```

### Data Display Components  
Always include these stories for data display:
```svelte
<Story name="With Data" args={{ items: sampleData }} />
<Story name="Empty State" args={{ items: [] }} />
<Story name="Loading State" args={{ loading: true }} />
<Story name="Error State" args={{ error: 'Failed to load' }} />
<Story name="Large Dataset" args={{ items: largeDataset }} />
```

### Interactive Components
Always include these stories for buttons, cards, etc.:
```svelte
<Story name="Default" />
<Story name="Hover State" parameters={{ pseudo: { hover: true } }} />
<Story name="Active State" parameters={{ pseudo: { active: true } }} />
<Story name="Focus State" parameters={{ pseudo: { focus: true } }} />
<Story name="Disabled" args={{ disabled: true }} />
```

## Development Workflow Commands

Standard commands to use during development:

```bash
# Create component story automatically
yarn create-story src/lib/components/ui/ComponentName.svelte

# Start interactive development
yarn storybook  # Opens http://localhost:6007

# Run quality checks
yarn test:unit     # Unit tests
yarn type-check    # TypeScript validation  
yarn lint          # Code quality
yarn format        # Code formatting

# Build verification
yarn build         # Production build
yarn build-storybook  # Storybook build
```

## Accessibility Requirements

Every component must include:

### ARIA Attributes
- `role` - Semantic role of the element
- `aria-label` - Accessible name when text content isn't sufficient
- `aria-describedby` - Reference to description elements
- `aria-expanded` - For collapsible elements
- `aria-disabled` - For disabled interactive elements

### Keyboard Navigation
- `tabindex` - Proper tab order
- Keyboard event handlers (Enter, Space, Arrow keys)
- Focus management for complex components
- Escape key handling for modals/overlays

### Screen Reader Support
- Semantic HTML elements when possible
- Clear, descriptive text content
- Status updates with `aria-live` regions
- Proper heading hierarchy

## Error Prevention

Common issues to avoid:

### Component Issues
- Missing TypeScript types for props
- No event handling for keyboard navigation
- Missing accessibility attributes
- Hardcoded styling instead of DaisyUI/Tailwind
- Direct state mutation instead of proper patterns

### Story Issues
- Missing story variants
- No edge case coverage
- Unrealistic sample data
- Missing component documentation
- No interactive state examples

### Testing Issues
- Testing implementation details vs behavior
- Missing accessibility tests
- No event handling tests
- Insufficient edge case coverage

## Integration with BMad Agents

When working with BMad specialist agents:

### For PM/PO Agents
- Always request component requirements that include story specifications
- Ask for accessibility requirements upfront
- Define all component variants and states needed

### For Developer Agents
- Reference this document for component creation standards
- Always create stories as part of component development
- Use the automated story creation tool: `yarn create-story`

### For QA Agents  
- Use Storybook stories as test scenarios
- Verify accessibility with built-in a11y addon
- Test all story variants for visual regression

---

Following these guidelines ensures every component is well-documented, thoroughly tested, and follows established project standards.