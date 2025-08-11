<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import TaskCard from './TaskCard.svelte'

	// Sample task data for stories
	const baseTask = {
		id: 'story-task-1',
		title: 'Sample Task Title',
		description: 'This is a sample task description that shows how the task card component renders with different content lengths and properties.',
		status: 'todo',
		priority: 'medium',
		dueDate: new Date('2025-08-20'),
		createdAt: new Date('2025-08-10'),
		updatedAt: new Date('2025-08-11'),
		aiGenerated: false,
		originalPrompt: null
	}

	const { Story } = defineMeta({
		title: 'Components/Kanban/TaskCard',
		component: TaskCard,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'A reusable task card component for displaying task information in the Kanban board. Supports different variants, priorities, and interactive states.'
				}
			}
		},
		argTypes: {
			task: {
				description: 'Task object containing all task data',
				control: 'object'
			},
			variant: {
				description: 'Visual variant of the task card',
				control: 'select',
				options: ['default', 'compact']
			}
		},
		args: {
			task: baseTask,
			variant: 'default'
		}
	})
</script>

<!-- Default task card -->
<Story name="Default" />

<!-- Compact variant -->
<Story name="Compact" args={{ variant: 'compact' }} />

<!-- High priority task -->
<Story 
	name="High Priority" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-high',
			title: 'Critical Bug Fix Required',
			priority: 'high',
			description: 'This is a high priority task that needs immediate attention. The bug affects user authentication and must be resolved quickly.'
		}
	}} 
/>

<!-- Low priority task -->
<Story 
	name="Low Priority" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-low',
			title: 'Update Documentation',
			priority: 'low',
			description: 'Review and update the project documentation to reflect recent changes.'
		}
	}} 
/>

<!-- AI Generated task -->
<Story 
	name="AI Generated" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-ai',
			title: 'Implement OAuth Integration',
			aiGenerated: true,
			originalPrompt: 'Create a task for implementing OAuth authentication',
			description: 'Integrate OAuth authentication with Google and GitHub providers for seamless user login experience.'
		}
	}} 
/>

<!-- Task without due date -->
<Story 
	name="No Due Date" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-no-date',
			title: 'Research New Technologies',
			dueDate: null,
			description: 'Explore new frontend technologies and frameworks that could benefit the project.'
		}
	}} 
/>

<!-- Task with long description -->
<Story 
	name="Long Description" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-long',
			title: 'Complex Feature Implementation',
			description: 'This is a very long task description that demonstrates how the component handles text truncation and tooltips when the content exceeds the maximum display length. The description includes multiple sentences with detailed information about the task requirements, acceptance criteria, and implementation notes. This helps developers understand how the component behaves with real-world content that might be quite lengthy and detailed.'
		}
	}} 
/>

<!-- Task in different statuses -->
<Story 
	name="In Progress Status" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-progress',
			title: 'Database Optimization',
			status: 'in-progress',
			priority: 'high',
			description: 'Optimize database queries for better performance and scalability.'
		}
	}} 
/>

<Story 
	name="Done Status" 
	args={{
		task: {
			...baseTask,
			id: 'story-task-done',
			title: 'Setup Development Environment',
			status: 'done',
			priority: 'high',
			description: 'Configure local development environment with proper tooling and dependencies.'
		}
	}} 
/>