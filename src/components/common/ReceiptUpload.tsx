import { useState, useRef } from 'react'
import { Paperclip, Mail, X, Download, Copy } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils'

interface ReceiptUploadProps {
  expenseDescription: string
  expenseAmount?: number
  expenseDate?: string
  userEmail?: string
  onFileSelect?: (file: File | null) => void
}

export const ReceiptUpload = ({ 
  expenseDescription, 
  expenseAmount, 
  expenseDate,
  userEmail,
  onFileSelect 
}: ReceiptUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0] || null
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadFile = () => {
    if (!selectedFile) return
    
    const url = URL.createObjectURL(selectedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!selectedFile) return

    try {
      // Criar uma lista de arquivos para copiar
      const clipboardItems = [
        new ClipboardItem({
          [selectedFile.type]: selectedFile
        })
      ]
      await navigator.clipboard.write(clipboardItems)
      alert('Arquivo copiado! Cole no seu email com Ctrl+V')
    } catch (error) {
      console.error('Erro ao copiar arquivo:', error)
      // Fallback: mostrar instruções
      alert('Não foi possível copiar automaticamente. Use o botão de download e anexe manualmente.')
    }
  }

  const sendByEmail = () => {
    if (!selectedFile) return

    // Gerar título sugestivo para o email
    const date = expenseDate ? new Date(expenseDate) : new Date()
    const monthYear = date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
    const amount = expenseAmount ? formatCurrency(expenseAmount) : ''
    const subject = `Comprovante - ${expenseDescription}${amount ? ` - ${amount}` : ''} - ${monthYear}`
    
    // Corpo do email com informações organizadas
    const body = `Comprovante de despesa:

📝 Descrição: ${expenseDescription}
💰 Valor: ${amount || 'Não informado'}
📅 Data: ${expenseDate ? formatDate(expenseDate) : 'Não informada'}
🗓️ Mês/Ano: ${monthYear}

---
📎 Anexar: ${selectedFile.name}
💡 Lembre-se de anexar o arquivo manualmente no email!

📧 Enviado automaticamente pelo Financitos`

    // Criar URL mailto
    const mailtoUrl = `mailto:${userEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    // Abrir cliente de email
    window.open(mailtoUrl)
    
    // Tentar copiar arquivo automaticamente
    copyToClipboard()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Comprovante
      </label>
      
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 transition-colors cursor-pointer"
        >
          <Paperclip className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm">Arraste aqui ou clique para selecionar</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG até 10MB</p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
              </span>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors ml-2"
              title="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={sendByEmail}
              className="btn-secondary text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center justify-center space-x-1 text-xs py-2"
              title="Abre email e tenta copiar arquivo"
            >
              <Mail className="h-3 w-3" />
              <span>Email</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="btn-secondary text-green-600 border-green-200 hover:bg-green-50 flex items-center justify-center space-x-1 text-xs py-2"
              title="Copiar arquivo para colar no email"
            >
              <Copy className="h-3 w-3" />
              <span>Copiar</span>
            </button>
            <button
              onClick={downloadFile}
              className="btn-secondary text-purple-600 border-purple-200 hover:bg-purple-50 flex items-center justify-center space-x-1 text-xs py-2"
              title="Baixar arquivo"
            >
              <Download className="h-3 w-3" />
              <span>Baixar</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,.pdf"
        className="hidden"
      />
      
      {selectedFile && (
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">💡 Como anexar:</p>
          <p>• <strong>Email</strong>: Abre email com dados + tenta copiar arquivo</p>
          <p>• <strong>Copiar</strong>: Copia arquivo para colar com Ctrl+V</p>
          <p>• <strong>Baixar</strong>: Salva arquivo para anexar manualmente</p>
        </div>
      )}
    </div>
  )
}