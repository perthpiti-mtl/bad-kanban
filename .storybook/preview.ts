import type { Preview } from '@storybook/sveltekit'
import '../src/app.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#ffffff',
				},
				{
					name: 'dark',
					value: '#1d232a',
				},
			],
		},
	}
}

export default preview
