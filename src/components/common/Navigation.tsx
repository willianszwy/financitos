import { Link, useLocation } from 'react-router-dom'
import { Building2, ShoppingCart, Menu, Cloud, CloudOff, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useGoogleDrive } from '@/hooks/useGoogleDrive'
import { useAppToast } from '@/App'

export const Navigation = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, signIn, syncData, error, clearError, lastSync } = useGoogleDrive()
  const toast = useAppToast()

  const isActive = (path: string) => location.pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSyncClick = async () => {
    clearError()
    
    if (!isAuthenticated) {
      toast.success('Conectando ao Google Drive...')
      const success = await signIn()
      if (!success) {
        toast.error('Falha ao conectar com Google Drive')
        return
      }
      toast.success('Conectado ao Google Drive com sucesso!')
    }
    
    toast.success('Iniciando sincronização...')
    const success = await syncData()
    
    if (success) {
      toast.success('Dados sincronizados com sucesso!')
    } else {
      toast.error('Falha na sincronização')
    }
  }

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error, toast])

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-md">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-income-primary" />
            <span className="font-bold text-lg text-gray-800">Financitos</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Sync Button */}
            <button
              onClick={handleSyncClick}
              disabled={isLoading}
              className={`p-2 rounded-md transition-colors ${
                isLoading 
                  ? 'cursor-not-allowed opacity-50' 
                  : isAuthenticated
                    ? 'hover:bg-green-100 text-green-600'
                    : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={
                isLoading 
                  ? 'Sincronizando...' 
                  : isAuthenticated 
                    ? 'Sincronizar com Google Drive' 
                    : 'Conectar ao Google Drive'
              }
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isAuthenticated ? (
                <Cloud className="h-5 w-5" />
              ) : (
                <CloudOff className="h-5 w-5" />
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {/* Sync Status */}
              {error && (
                <div className="mx-3 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CloudOff className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}
              
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-income-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-5 w-5" />
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
                <ShoppingCart className="h-5 w-5" />
                <span>Comprinhas</span>
              </Link>

              {/* Google Drive Status */}
              <div className="mx-3 mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Google Drive</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {isAuthenticated ? (
                      <Cloud className="h-4 w-4 text-green-600" />
                    ) : (
                      <CloudOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {isAuthenticated ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSyncClick}
                    disabled={isLoading}
                    className="text-sm text-income-primary hover:text-income-dark disabled:opacity-50"
                  >
                    {isLoading ? 'Sincronizando...' : isAuthenticated ? 'Sincronizar' : 'Conectar'}
                  </button>
                </div>
                
                {lastSync && (
                  <div className="text-xs text-gray-400">
                    Último sync: {new Date(lastSync).toLocaleString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}