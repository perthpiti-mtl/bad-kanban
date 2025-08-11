import type { StorybookConfig } from '@storybook/sveltekit'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest'
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	viteFinal: async (config: any) => {
		// Fix for Yarn PnP virtual paths in Storybook
		config.server = config.server || {}
		config.server.fs = config.server.fs || {}
		config.server.fs.allow = [
			...(config.server.fs.allow || []),
			'.yarn',
			'../.yarn',
			'../../.yarn',
			process.cwd(),
			`${process.env.HOME}/.yarn`
		]
		return config
	}
}
export default config
