import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import FloatingActionButton from '$lib/components/ui/FloatingActionButton.svelte'

describe('FloatingActionButton', () => {
  it('renders with correct attributes and styling', () => {
    render(FloatingActionButton)
    
    const button = screen.getByRole('button', { name: /create new task/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Create new task')
    expect(button).toHaveAttribute('title', 'Create new task')
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-circle', 'fixed')
  })

  it('displays the plus icon', () => {
    render(FloatingActionButton)
    
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('calls onclick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(FloatingActionButton, { props: { onclick: handleClick } })
    
    const button = screen.getByRole('button', { name: /create new task/i })
    await fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('handles keyboard navigation - Enter key', async () => {
    const handleClick = vi.fn()
    render(FloatingActionButton, { props: { onclick: handleClick } })
    
    const button = screen.getByRole('button', { name: /create new task/i })
    button.focus()
    await fireEvent.keyDown(button, { key: 'Enter' })
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('handles keyboard navigation - Space key', async () => {
    const handleClick = vi.fn()
    render(FloatingActionButton, { props: { onclick: handleClick } })
    
    const button = screen.getByRole('button', { name: /create new task/i })
    button.focus()
    await fireEvent.keyDown(button, { key: ' ' })
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not trigger click on other keys', async () => {
    const handleClick = vi.fn()
    render(FloatingActionButton, { props: { onclick: handleClick } })
    
    const button = screen.getByRole('button', { name: /create new task/i })
    button.focus()
    await fireEvent.keyDown(button, { key: 'Tab' })
    await fireEvent.keyDown(button, { key: 'Escape' })
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('is positioned fixed in bottom-right corner', () => {
    render(FloatingActionButton)
    
    const button = screen.getByRole('button', { name: /create new task/i })
    
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6')
  })

  it('has proper z-index for layering', () => {
    render(FloatingActionButton)
    
    const button = screen.getByRole('button', { name: /create new task/i })
    expect(button).toHaveClass('z-50')
  })
})