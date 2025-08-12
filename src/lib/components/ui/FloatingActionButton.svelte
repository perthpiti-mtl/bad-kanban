<script lang="ts">
  let { onclick }: { onclick?: () => void } = $props()

  function handleClick() {
    onclick?.()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }
</script>

<button
  class="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-shadow z-50"
  onclick={handleClick}
  onkeydown={handleKeyDown}
  aria-label="Create new task"
  title="Create new task"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M12 4v16m8-8H4" 
    />
  </svg>
</button>

<style>
  /* Ensure FAB is positioned correctly on mobile */
  @media (max-width: 640px) {
    button {
      bottom: 1rem;
      right: 1rem;
    }
  }
</style>