<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import KanbanBoard from './KanbanBoard.svelte'
	import { sampleTasks } from '$lib/data/sample-tasks'

	// Create a smaller set of sample tasks for stories
	const storyTasks = [
		// Todo tasks
		{
			id: 'board-task-1',
			title: 'Implement user authentication',
			description: 'Create comprehensive user authentication system with JWT tokens, login, and registration.',
			status: 'todo',
			priority: 'high',
			dueDate: new Date('2025-08-20'),
			createdAt: new Date('2025-08-10'),
			updatedAt: new Date('2025-08-10'),
			aiGenerated: false,
			originalPrompt: null
		},
		{
			id: 'board-task-2',
			title: 'Set up CI/CD pipeline',
			description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
			status: 'todo',
			priority: 'medium',
			dueDate: new Date('2025-08-25'),
			createdAt: new Date('2025-08-09'),
			updatedAt: new Date('2025-08-09'),
			aiGenerated: true,
			originalPrompt: 'Create a CI/CD setup task'
		},
		// In progress tasks
		{
			id: 'board-task-3',
			title: 'Database optimization',
			description: 'Optimize slow database queries and implement proper indexing.',
			status: 'in-progress',
			priority: 'high',
			dueDate: new Date('2025-08-15'),
			createdAt: new Date('2025-08-07'),
			updatedAt: new Date('2025-08-11'),
			aiGenerated: false,
			originalPrompt: null
		},
		{
			id: 'board-task-4',
			title: 'Payment gateway integration',
			description: 'Integrate Stripe payment processing with webhook support.',
			status: 'in-progress',
			priority: 'medium',
			dueDate: new Date('2025-08-22'),
			createdAt: new Date('2025-08-05'),
			updatedAt: new Date('2025-08-10'),
			aiGenerated: false,
			originalPrompt: null
		},
		// Done tasks
		{
			id: 'board-task-5',
			title: 'Development environment setup',
			description: 'Configure local development environment with proper tooling and linting.',
			status: 'done',
			priority: 'high',
			dueDate: null,
			createdAt: new Date('2025-08-01'),
			updatedAt: new Date('2025-08-05'),
			aiGenerated: false,
			originalPrompt: null
		},
		{
			id: 'board-task-6',
			title: 'Project structure setup',
			description: 'Establish foundational project structure with proper folder organization.',
			status: 'done',
			priority: 'medium',
			dueDate: null,
			createdAt: new Date('2025-08-01'),
			updatedAt: new Date('2025-08-03'),
			aiGenerated: false,
			originalPrompt: null
		}
	]

	const { Story } = defineMeta({
		title: 'Components/Kanban/KanbanBoard',
		component: KanbanBoard,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'Complete Kanban board component that organizes tasks into columns by status (Todo, In Progress, Done). Displays task counts and completion rates.'
				}
			},
			layout: 'fullscreen'
		},
		argTypes: {
			tasks: {
				description: 'Array of all tasks to be organized into columns',
				control: 'object'
			}
		},
		args: {
			tasks: storyTasks
		}
	})
</script>

<!-- Default board with sample tasks -->
<Story name="Default" />

<!-- Empty board -->
<Story 
	name="Empty Board" 
	args={{
		tasks: []
	}} 
/>

<!-- Board with only todo tasks -->
<Story 
	name="Todo Only" 
	args={{
		tasks: storyTasks.filter(task => task.status === 'todo')
	}} 
/>

<!-- Board with tasks in progress -->
<Story 
	name="In Progress Focus" 
	args={{
		tasks: [
			...storyTasks.filter(task => task.status === 'in-progress'),
			{
				id: 'extra-progress-1',
				title: 'API documentation',
				description: 'Create comprehensive API documentation for all endpoints.',
				status: 'in-progress',
				priority: 'low',
				dueDate: new Date('2025-08-30'),
				createdAt: new Date('2025-08-06'),
				updatedAt: new Date('2025-08-11'),
				aiGenerated: true,
				originalPrompt: 'Generate API documentation task'
			}
		]
	}} 
/>

<!-- Board with completed project -->
<Story 
	name="Mostly Complete" 
	args={{
		tasks: [
			// One remaining task
			storyTasks.filter(task => task.status === 'todo')[0],
			// All done tasks plus extras
			...storyTasks.filter(task => task.status === 'done'),
			{
				id: 'extra-done-1',
				title: 'Security audit completed',
				description: 'Comprehensive security review of authentication and API endpoints.',
				status: 'done',
				priority: 'high',
				dueDate: null,
				createdAt: new Date('2025-08-03'),
				updatedAt: new Date('2025-08-07'),
				aiGenerated: false,
				originalPrompt: null
			},
			{
				id: 'extra-done-2',
				title: 'Unit tests written',
				description: 'Created comprehensive unit tests for utility functions.',
				status: 'done',
				priority: 'medium',
				dueDate: null,
				createdAt: new Date('2025-08-04'),
				updatedAt: new Date('2025-08-08'),
				aiGenerated: true,
				originalPrompt: 'Create unit testing task'
			}
		]
	}} 
/>

<!-- Board with full sample data -->
<Story 
	name="Full Sample Data" 
	args={{
		tasks: sampleTasks
	}} 
/>