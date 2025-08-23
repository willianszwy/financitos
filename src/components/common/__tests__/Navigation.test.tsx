import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from '../Navigation'

const NavigationWithRouter = () => (
  <BrowserRouter>
    <Navigation />
  </BrowserRouter>
)

describe('Navigation', () => {
  it('should render navigation elements', () => {
    render(<NavigationWithRouter />)

    // Check logo and title
    expect(screen.getByText('Financitos')).toBeInTheDocument()
    
    // Check menu button
    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()
  })

  it('should toggle mobile menu', () => {
    render(<NavigationWithRouter />)

    const menuButton = screen.getByRole('button')
    
    // Menu should be hidden initially
    expect(screen.queryByText('Comprinhas')).not.toBeInTheDocument()

    // Click to open menu
    fireEvent.click(menuButton)
    expect(screen.getByText('Comprinhas')).toBeInTheDocument()

    // Click to close menu
    fireEvent.click(menuButton)
    expect(screen.queryByText('Comprinhas')).not.toBeInTheDocument()
  })

  it('should close menu when link is clicked', () => {
    render(<NavigationWithRouter />)

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // Menu should be open
    expect(screen.getByText('Comprinhas')).toBeInTheDocument()

    // Click on a navigation link
    const financitosLink = screen.getByRole('link', { name: /financitos/i })
    fireEvent.click(financitosLink)

    // Menu should be closed
    expect(screen.queryByText('Comprinhas')).not.toBeInTheDocument()
  })

  it('should show active link styles', () => {
    render(<NavigationWithRouter />)

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // The root path should be active
    const financitosLink = screen.getByRole('link', { name: /financitos/i })
    expect(financitosLink).toHaveClass('bg-income-primary')
  })

  it('should render navigation icons', () => {
    render(<NavigationWithRouter />)

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // Check for icon presence by checking for the navigation links with icons
    const financitosLink = screen.getByRole('link', { name: /financitos/i })
    const comprinhasLink = screen.getByRole('link', { name: /comprinhas/i })
    
    expect(financitosLink).toBeInTheDocument()
    expect(comprinhasLink).toBeInTheDocument()
  })

  it('should show local storage info', () => {
    render(<NavigationWithRouter />)

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // Check for local storage info
    expect(screen.getByText('Armazenamento Local')).toBeInTheDocument()
    expect(screen.getByText('Seus dados ficam salvos apenas neste dispositivo')).toBeInTheDocument()
  })
})