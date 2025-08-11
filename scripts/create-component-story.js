#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, basename, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function createStoryTemplate(componentPath, componentName) {
	const template = `<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import ${componentName} from './${componentName}.svelte'

	const { Story } = defineMeta({
		title: 'Components/TODO/${componentName}',
		component: ${componentName},
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'TODO: Add component description'
				}
			}
		},
		argTypes: {
			// TODO: Add prop controls
		},
		args: {
			// TODO: Add default args
		}
	})
</script>

<!-- Default story -->
<Story name="Default" />

<!-- TODO: Add more story variants -->
<Story name="Example Variant" args={{ /* TODO: Add variant props */ }} />
`

	return template
}

function main() {
	const componentPath = process.argv[2]
	
	if (!componentPath) {
		console.error('Usage: node create-component-story.js <path-to-component>')
		console.error('Example: node create-component-story.js src/lib/components/MyComponent.svelte')
		process.exit(1)
	}

	if (!existsSync(componentPath)) {
		console.error(`Component file not found: ${componentPath}`)
		process.exit(1)
	}

	const componentName = basename(componentPath, '.svelte')
	const componentDir = dirname(componentPath)
	const storyPath = join(componentDir, `${componentName}.stories.svelte`)

	if (existsSync(storyPath)) {
		console.error(`Story file already exists: ${storyPath}`)
		process.exit(1)
	}

	const storyContent = createStoryTemplate(componentPath, componentName)
	
	try {
		writeFileSync(storyPath, storyContent)
		console.log(`✅ Created story file: ${storyPath}`)
		console.log('\\n📝 Next steps:')
		console.log('1. Update the title in defineMeta to match your component category')
		console.log('2. Add component description in the docs parameter')
		console.log('3. Define argTypes for component props')
		console.log('4. Add default args')
		console.log('5. Create story variants for different states/props')
		console.log('6. Run "yarn storybook" to see your stories')
	} catch (error) {
		console.error(`Error creating story file: ${error.message}`)
		process.exit(1)
	}
}

main()