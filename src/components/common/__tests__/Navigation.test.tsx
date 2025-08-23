import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { createContext } from 'react'
import { Navigation } from '../Navigation'

// Mock the useAppToast hook
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  toasts: [],
  removeToast: vi.fn()
}

const ToastContext = createContext(mockToast)

// Mock the useGoogleDrive hook
vi.mock('@/hooks/useGoogleDrive', () => ({
  useGoogleDrive: () => ({
    isAuthenticated: false,
    isLoading: false,
    signIn: vi.fn(),
    syncData: vi.fn(),
    error: null,
    clearError: vi.fn(),
    lastSync: null
  })
}))

// Mock the useAppToast hook
vi.mock('@/App', () => ({
  useAppToast: () => mockToast
}))

const NavigationWithRouter = () => (
  <BrowserRouter>
    <ToastContext.Provider value={mockToast}>
      <Navigation />
    </ToastContext.Provider>
  </BrowserRouter>
)

describe('Navigation', () => {
  it('should render navigation elements', () => {
    render(<NavigationWithRouter />)

    // Check logo and title
    expect(screen.getByText('Financitos')).toBeInTheDocument()
    
    // Check buttons (sync button and menu button)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // sync button + menu button
  })

  it('should toggle mobile menu', () => {
    render(<NavigationWithRouter />)

    const buttons = screen.getAllByRole('button')
    const menuButton = buttons[1] // Second button is the menu button
    
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

    const buttons = screen.getAllByRole('button')
    const menuButton = buttons[1] // Second button is the menu button
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

    const buttons = screen.getAllByRole('button')
    const menuButton = buttons[1] // Second button is the menu button
    fireEvent.click(menuButton)

    // The root path should be active
    const financitosLink = screen.getByRole('link', { name: /financitos/i })
    expect(financitosLink).toHaveClass('bg-income-primary')
  })

  it('should render navigation icons', () => {
    render(<NavigationWithRouter />)

    const buttons = screen.getAllByRole('button')
    const menuButton = buttons[1] // Second button is the menu button
    fireEvent.click(menuButton)

    // Check for icon presence by checking for the navigation links with icons
    const financitosLink = screen.getByRole('link', { name: /financitos/i })
    const comprinhasLink = screen.getByRole('link', { name: /comprinhas/i })
    
    expect(financitosLink).toBeInTheDocument()
    expect(comprinhasLink).toBeInTheDocument()
  })
})