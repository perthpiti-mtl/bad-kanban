<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import KanbanColumn from './KanbanColumn.svelte'

	// Sample tasks for different scenarios
	const sampleTasks = [
		{
			id: 'col-task-1',
			title: 'Implement user authentication',
			description: 'Create login and registration functionality with JWT tokens.',
			status: 'todo',
			priority: 'high',
			dueDate: new Date('2025-08-20'),
			createdAt: new Date('2025-08-10'),
			updatedAt: new Date('2025-08-11'),
			aiGenerated: false,
			originalPrompt: null
		},
		{
			id: 'col-task-2',
			title: 'Set up CI/CD pipeline',
			description: 'Configure automated testing and deployment with GitHub Actions.',
			status: 'todo',
			priority: 'medium',
			dueDate: new Date('2025-08-25'),
			createdAt: new Date('2025-08-09'),
			updatedAt: new Date('2025-08-09'),
			aiGenerated: true,
			originalPrompt: 'Create a CI/CD task'
		},
		{
			id: 'col-task-3',
			title: 'Update documentation',
			description: 'Review and update project documentation.',
			status: 'todo',
			priority: 'low',
			dueDate: null,
			createdAt: new Date('2025-08-08'),
			updatedAt: new Date('2025-08-08'),
			aiGenerated: false,
			originalPrompt: null
		}
	]

	const { Story } = defineMeta({
		title: 'Components/Kanban/KanbanColumn',
		component: KanbanColumn,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'A column component for the Kanban board that displays a list of tasks with a title and task count. Handles empty states and task interactions.'
				}
			},
			layout: 'padded'
		},
		argTypes: {
			title: {
				description: 'Column title displayed at the top',
				control: 'text'
			},
			tasks: {
				description: 'Array of tasks to display in the column',
				control: 'object'
			},
			status: {
				description: 'Task status this column represents (optional)',
				control: 'select',
				options: ['todo', 'in-progress', 'done', undefined]
			}
		},
		args: {
			title: 'To Do',
			tasks: sampleTasks,
			status: 'todo'
		}
	})
</script>

<!-- Default column with tasks -->
<Story name="Default" />

<!-- Empty column -->
<Story 
	name="Empty Column" 
	args={{
		title: 'Done',
		tasks: [],
		status: 'done'
	}} 
/>

<!-- In Progress column -->
<Story 
	name="In Progress" 
	args={{
		title: 'In Progress',
		tasks: [
			{
				id: 'progress-task-1',
				title: 'Database optimization',
				description: 'Optimize slow database queries identified in performance audit.',
				status: 'in-progress',
				priority: 'high',
				dueDate: new Date('2025-08-15'),
				createdAt: new Date('2025-08-07'),
				updatedAt: new Date('2025-08-11'),
				aiGenerated: false,
				originalPrompt: null
			},
			{
				id: 'progress-task-2',
				title: 'Payment gateway integration',
				description: 'Implement Stripe payment processing with webhook support.',
				status: 'in-progress',
				priority: 'high',
				dueDate: new Date('2025-08-22'),
				createdAt: new Date('2025-08-05'),
				updatedAt: new Date('2025-08-10'),
				aiGenerated: false,
				originalPrompt: null
			}
		],
		status: 'in-progress'
	}} 
/>

<!-- Done column with completed tasks -->
<Story 
	name="Done Column" 
	args={{
		title: 'Done',
		tasks: [
			{
				id: 'done-task-1',
				title: 'Development environment setup',
				description: 'Configure local development environment with proper tooling.',
				status: 'done',
				priority: 'high',
				dueDate: null,
				createdAt: new Date('2025-08-01'),
				updatedAt: new Date('2025-08-05'),
				aiGenerated: false,
				originalPrompt: null
			}
		],
		status: 'done'
	}} 
/>

<!-- Column with single task -->
<Story 
	name="Single Task" 
	args={{
		title: 'Review',
		tasks: [sampleTasks[0]],
		status: undefined
	}} 
/>

<!-- Column with many tasks (scrollable) -->
<Story 
	name="Many Tasks" 
	args={{
		title: 'Backlog',
		tasks: [
			...sampleTasks,
			...sampleTasks.map((task, index) => ({
				...task,
				id: `extra-task-${index}`,
				title: `${task.title} (Copy ${index + 1})`
			})),
			...sampleTasks.map((task, index) => ({
				...task,
				id: `extra-task-2-${index}`,
				title: `${task.title} (Variant ${index + 1})`
			}))
		],
		status: 'todo'
	}} 
/>