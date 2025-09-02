import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataManagement } from '../DataManagement'
import { StorageService } from '@/services/storage'

// Mock the StorageService
vi.mock('@/services/storage', () => ({
  StorageService: {
    exportAllData: vi.fn(),
    importAllData: vi.fn()
  }
}))

// Mock URL.createObjectURL and document methods
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-blob-url')
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn()
})

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn()
  }
})

describe('DataManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Export functionality', () => {
    it('should render export button', () => {
      render(<DataManagement />)
      expect(screen.getByText('Exportar Dados')).toBeInTheDocument()
    })

    it('should call StorageService.exportAllData when export button is clicked', async () => {
      const mockExportData = '{"test": "data"}'
      vi.mocked(StorageService.exportAllData).mockReturnValue(mockExportData)

      render(<DataManagement />)
      
      const exportButton = screen.getByText('Exportar Dados')
      fireEvent.click(exportButton)

      expect(StorageService.exportAllData).toHaveBeenCalled()
    })

    it('should show success message after successful export', async () => {
      const mockExportData = '{"test": "data"}'
      vi.mocked(StorageService.exportAllData).mockReturnValue(mockExportData)

      render(<DataManagement />)
      
      const exportButton = screen.getByText('Exportar Dados')
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(screen.getByText('Dados exportados com sucesso!')).toBeInTheDocument()
      })
    })

    it('should show error message when export fails', async () => {
      vi.mocked(StorageService.exportAllData).mockReturnValue('')

      render(<DataManagement />)
      
      const exportButton = screen.getByText('Exportar Dados')
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(screen.getByText('Erro ao gerar dados para exportação')).toBeInTheDocument()
      })
    })

    it('should call StorageService and show success after export', async () => {
      vi.mocked(StorageService.exportAllData).mockReturnValue('{"test": "data"}')

      render(<DataManagement />)
      
      const exportButton = screen.getByText('Exportar Dados')
      fireEvent.click(exportButton)

      await waitFor(() => {
        expect(StorageService.exportAllData).toHaveBeenCalled()
        expect(screen.getByText('Dados exportados com sucesso!')).toBeInTheDocument()
      })
    })
  })

  describe('Import functionality', () => {
    it('should render import button', () => {
      render(<DataManagement />)
      expect(screen.getByText('Importar Dados')).toBeInTheDocument()
    })

    it('should trigger file input when import button is clicked', () => {
      render(<DataManagement />)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      const clickSpy = vi.spyOn(fileInput, 'click')

      const importButton = screen.getByText('Importar Dados')
      fireEvent.click(importButton)

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should validate file type and show error for non-JSON files', async () => {
      render(<DataManagement />)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('Arquivo deve ser do tipo JSON (.json)')).toBeInTheDocument()
      })
    })

    it('should show success message and reload page after successful import', async () => {
      vi.mocked(StorageService.importAllData).mockReturnValue(true)
      
      render(<DataManagement />)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      const validJsonData = JSON.stringify({
        financialData: {},
        shoppingList: { items: [] },
        settings: {}
      })
      
      const file = new File([validJsonData], 'backup.json', { type: 'application/json' })
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('Dados importados com sucesso! A página será recarregada.')).toBeInTheDocument()
      })
    })

    it('should show error message for invalid JSON structure', async () => {
      render(<DataManagement />)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      const invalidJsonData = JSON.stringify({ invalid: 'structure' })
      
      const file = new File([invalidJsonData], 'backup.json', { type: 'application/json' })
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      })

      fireEvent.change(fileInput)

      await waitFor(() => {
        expect(screen.getByText('Formato de arquivo não reconhecido. Certifique-se de que é um backup válido do Financitos.')).toBeInTheDocument()
      })
    })
  })

  describe('Component UI', () => {
    it('should render help information', () => {
      render(<DataManagement />)
      
      expect(screen.getByText('💾')).toBeInTheDocument()
      expect(screen.getByText('BACKUP & RESTAURAÇÃO')).toBeInTheDocument()
      expect(screen.getByText('ℹ️ Informações importantes:')).toBeInTheDocument()
      expect(screen.getByText(/O backup inclui todos os dados financeiros/)).toBeInTheDocument()
    })

    it('should show buttons as enabled initially', () => {
      render(<DataManagement />)
      
      const exportButton = screen.getByRole('button', { name: /exportar dados/i })
      const importButton = screen.getByRole('button', { name: /importar dados/i })
      
      expect(exportButton).toBeEnabled()
      expect(importButton).toBeEnabled()
    })
  })
})