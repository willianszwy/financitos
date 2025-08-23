import { Routes, Route } from 'react-router-dom'
import { FinancitosPage } from './pages/Financitos/FinancitosPage'
import { ComprinhasPage } from './pages/Comprinhas/ComprinhasPage'
import { Navigation } from './components/common/Navigation'
import { ToastManager } from './components/common/Toast'
import { useToast } from './hooks/useToast'
import { createContext, useContext } from 'react'

// Create Toast Context
const ToastContext = createContext<ReturnType<typeof useToast> | undefined>(undefined)

export const useAppToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useAppToast must be used within App component')
  }
  return context
}

function App() {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <Routes>
            <Route path="/" element={<FinancitosPage />} />
            <Route path="/comprinhas" element={<ComprinhasPage />} />
          </Routes>
        </main>
        <ToastManager toasts={toast.toasts} removeToast={toast.removeToast} />
      </div>
    </ToastContext.Provider>
  )
}

export default App