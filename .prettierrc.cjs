module.exports = {
	useTabs: true,
	printWidth: 100,
	// tabWidth: 2,
	semi: false,
	trailingComma: 'none',
	singleQuote: true,
	plugins: [require('prettier-plugin-svelte')],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		},
		{
			files: '**/*.svx',
			options: { parser: 'markdown' }
		},
		{
			files: '**/*.ts',
			options: { parser: 'typescript' }
		},
		{
			files: '**/CHANGELOG.md',
			options: {
				requirePragma: true
			}
		}
	]
}
