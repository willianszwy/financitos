import { useState, useRef } from 'react'
import { Download, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { StorageService } from '@/services/storage'

interface DataManagementProps {
  onDataImported?: () => void
}

export const DataManagement = ({ onDataImported }: DataManagementProps) => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setStatus({ type: null, message: '' })
    
    try {
      // Add a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const jsonData = StorageService.exportAllData()
      
      if (!jsonData) {
        throw new Error('Erro ao gerar dados para exportação')
      }

      // Create and download file
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      link.href = url
      link.download = `financitos-backup-${currentDate}.json`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      setStatus({ 
        type: 'success', 
        message: 'Dados exportados com sucesso!' 
      })
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Erro ao exportar dados' 
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setStatus({ type: null, message: '' })

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        throw new Error('Arquivo deve ser do tipo JSON (.json)')
      }

      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsText(file)
      })

      // Validate JSON structure
      let jsonData
      try {
        jsonData = JSON.parse(fileContent)
      } catch {
        throw new Error('Arquivo JSON inválido')
      }

      // Basic validation of expected structure
      if (!jsonData.financialData && !jsonData.shoppingList && !jsonData.settings) {
        throw new Error('Formato de arquivo não reconhecido. Certifique-se de que é um backup válido do Financitos.')
      }

      // Import data
      const success = StorageService.importAllData(fileContent)
      
      if (!success) {
        throw new Error('Erro ao importar dados')
      }

      setStatus({ 
        type: 'success', 
        message: 'Dados importados com sucesso! A página será recarregada.' 
      })

      // Notify parent and reload after a short delay
      setTimeout(() => {
        if (onDataImported) {
          onDataImported()
        }
        window.location.reload()
      }, 2000)

    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Erro ao importar dados' 
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Auto-hide status messages after 5 seconds
  useState(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  })

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <span>💾</span>
          <span>BACKUP & RESTAURAÇÃO</span>
        </h2>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Faça backup dos seus dados financeiros ou restaure um backup anterior.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || isImporting}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-green-700 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>{isExporting ? 'Exportando...' : 'Exportar Dados'}</span>
          </button>

          {/* Import Button */}
          <button
            onClick={triggerFileInput}
            disabled={isImporting || isExporting}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-700 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            <span>{isImporting ? 'Importando...' : 'Importar Dados'}</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* Status Message */}
        {status.type && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-1">ℹ️ Informações importantes:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>O backup inclui todos os dados financeiros, lista de compras e configurações</li>
            <li>Ao importar, todos os dados atuais serão substituídos</li>
            <li>Recomendamos fazer backup regularmente</li>
            <li>O arquivo de backup é seguro e contém apenas seus dados locais</li>
          </ul>
        </div>
      </div>
    </div>
  )
}