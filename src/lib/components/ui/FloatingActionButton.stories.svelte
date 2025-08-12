<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import FloatingActionButton from './FloatingActionButton.svelte'

  const { Story } = defineMeta({
    title: 'UI/FloatingActionButton',
    component: FloatingActionButton,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: 'A floating action button that triggers task creation modal. Positioned fixed in bottom-right corner with full accessibility support.'
        }
      }
    },
    argTypes: {
      onclick: { 
        description: 'Click handler function',
        action: 'clicked'
      }
    }
  })

  function handleClick() {
    console.log('FAB clicked')
  }
</script>

<!-- Default FAB -->
<Story name="Default" args={{ onclick: handleClick }}>
  <div class="h-96 relative">
    <FloatingActionButton onclick={handleClick} />
    <p class="p-4 text-base-content">
      The floating action button appears in the bottom-right corner.
      Click it or use keyboard navigation (Tab + Enter/Space) to trigger the action.
    </p>
  </div>
</Story>

<!-- Mobile View -->
<Story name="Mobile View" args={{ onclick: handleClick }}>
  <div class="max-w-sm mx-auto h-96 relative border border-base-300 rounded-lg">
    <FloatingActionButton onclick={handleClick} />
    <div class="p-4">
      <h3 class="font-bold">Mobile Layout</h3>
      <p class="text-sm">FAB adjusts position for mobile screens</p>
    </div>
  </div>
</Story>

<!-- Accessibility Demo -->
<Story name="Accessibility Demo" args={{ onclick: handleClick }}>
  <div class="h-96 relative">
    <FloatingActionButton onclick={handleClick} />
    <div class="p-4 space-y-2">
      <h3 class="font-bold text-base-content">Accessibility Features:</h3>
      <ul class="text-sm text-base-content/80 space-y-1">
        <li>• ARIA label: "Create new task"</li>
        <li>• Keyboard navigation: Tab to focus, Enter/Space to activate</li>
        <li>• Screen reader friendly with proper semantic structure</li>
        <li>• High contrast focus indicators</li>
      </ul>
    </div>
  </div>
</Story>