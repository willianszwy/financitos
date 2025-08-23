import { Routes, Route } from 'react-router-dom'
import { FinancitosPage } from './pages/Financitos/FinancitosPage'
import { ComprinhasPage } from './pages/Comprinhas/ComprinhasPage'
import { Navigation } from './components/common/Navigation'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-6 max-w-md">
        <Routes>
          <Route path="/" element={<FinancitosPage />} />
          <Route path="/comprinhas" element={<ComprinhasPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App