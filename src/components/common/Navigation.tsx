import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { CoinIcon } from './CoinIcon'
import { PigIcon } from './PigIcon'

export const Navigation = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-md">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <PigIcon className="h-6 w-6" />
            <span className="font-bold text-lg text-gray-800">Financitos</span>
          </div>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-income-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <PigIcon className="h-5 w-5" />
                <span>Financitos</span>
              </Link>
              
              <Link
                to="/comprinhas"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/comprinhas')
                    ? 'bg-income-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CoinIcon className="h-5 w-5" />
                <span>Comprinhas</span>
              </Link>

              {/* Local Storage Info */}
              <div className="mx-3 mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Armazenamento Local</div>
                <div className="text-xs text-gray-600">
                  Seus dados ficam salvos apenas neste dispositivo
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}