import { useState } from 'react'
import { Plus, ExternalLink, Calendar, DollarSign, ShoppingCart, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ShoppingItem, Priority, PRIORITY_EMOJIS, PRIORITY_COLORS } from '@/types'
import { formatCurrency, formatDate, getTodayISO } from '@/utils'
import { generateId, classNames } from '@/utils/helpers'
import { useShoppingList } from '@/hooks/useLocalStorage'

interface ComprinhasPageProps {}

interface ShoppingFormData {
  description: string
  estimatedPrice: string
  priority: Priority
  deadline: string
  productLink: string
}

export const ComprinhasPage = ({}: ComprinhasPageProps) => {
  const { shoppingList, loading, error, updateItems } = useShoppingList()
  const [isAdding, setIsAdding] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShoppingFormData>({
    defaultValues: {
      description: '',
      estimatedPrice: '',
      priority: 'Média',
      deadline: '',
      productLink: ''
    }
  })

  const onSubmit = (data: ShoppingFormData) => {
    const newItem: ShoppingItem = {
      id: generateId(),
      description: data.description,
      estimatedPrice: data.estimatedPrice ? parseFloat(data.estimatedPrice.replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
      priority: data.priority,
      deadline: data.deadline || undefined,
      productLink: data.productLink || undefined,
      purchased: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    updateItems([...shoppingList.items, newItem])
    reset()
    setIsAdding(false)
  }

  const removeItem = (id: string) => {
    updateItems(shoppingList.items.filter(item => item.id !== id))
  }

  const togglePurchased = (id: string) => {
    updateItems(shoppingList.items.map(item =>
      item.id === id
        ? {
            ...item,
            purchased: !item.purchased,
            purchaseDate: !item.purchased ? getTodayISO() : undefined,
            updatedAt: new Date().toISOString()
          }
        : item
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-income-primary mx-auto mb-2" />
          <p className="text-gray-600">Carregando lista de compras...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao carregar lista</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const sortedItems = shoppingList.items.sort((a, b) => {
    // Priority order: Alta, Média, Baixa
    const priorityOrder = { 'Alta': 0, 'Média': 1, 'Baixa': 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    
    // Then by deadline (closer dates first)
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (a.deadline && !b.deadline) return -1
    if (!a.deadline && b.deadline) return 1
    
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <span>🛒</span>
          <span>Comprinhas</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Organize sua lista de compras por prioridade
        </p>
      </div>

      {/* Add Item Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 bg-income-primary hover:bg-income-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Item</span>
        </button>
      )}

      {/* Add Item Form */}
      {isAdding && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Novo Item de Compra</span>
            </h2>
            <button
              onClick={() => {
                setIsAdding(false)
                reset()
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖️
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item
              </label>
              <input
                type="text"
                {...register('description', { required: 'Descrição é obrigatória' })}
                className="input-field"
                placeholder="Ex: Smartphone Samsung Galaxy..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (opcional)
              </label>
              <input
                type="text"
                {...register('estimatedPrice')}
                className="input-field"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="space-y-2">
                {(['Alta', 'Média', 'Baixa'] as Priority[]).map((priority) => (
                  <label key={priority} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      {...register('priority')}
                      value={priority}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{PRIORITY_EMOJIS[priority]}</span>
                      <span className="font-medium" style={{ color: PRIORITY_COLORS[priority] }}>
                        {priority}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline (opcional)
              </label>
              <input
                type="date"
                {...register('deadline')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (opcional)
              </label>
              <input
                type="url"
                {...register('productLink')}
                className="input-field"
                placeholder="https://loja.exemplo.com/produto..."
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  reset()
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shopping Items */}
      {sortedItems.length > 0 ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Agenda de Compras</h2>
          
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={classNames(
                  'p-4 rounded-lg border-l-4 transition-all duration-200',
                  item.purchased 
                    ? 'bg-gray-50 border-gray-300 opacity-60' 
                    : 'bg-white border-gray-200 shadow-sm'
                )}
                style={{ borderLeftColor: PRIORITY_COLORS[item.priority] }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className={classNames(
                          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                          item.purchased
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        )}
                      >
                        {item.purchased && '✓'}
                      </button>
                      <h3 className={classNames(
                        'font-medium text-gray-800',
                        item.purchased && 'line-through'
                      )}>
                        {item.description}
                      </h3>
                      <span className="text-lg">{PRIORITY_EMOJIS[item.priority]}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {item.estimatedPrice && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(item.estimatedPrice)}</span>
                        </div>
                      )}
                      
                      {item.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(item.deadline)}</span>
                        </div>
                      )}
                      
                      {item.productLink && (
                        <a
                          href={item.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-income-primary hover:text-income-dark transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Link</span>
                        </a>
                      )}
                    </div>

                    {item.purchased && item.purchaseDate && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ Comprado em {formatDate(item.purchaseDate)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legenda:</h4>
            <div className="flex space-x-6 text-sm">
              {(['Alta', 'Média', 'Baixa'] as Priority[]).map((priority) => (
                <div key={priority} className="flex items-center space-x-1">
                  <span>{PRIORITY_EMOJIS[priority]}</span>
                  <span style={{ color: PRIORITY_COLORS[priority] }}>{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !isAdding && (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum item na lista
            </h3>
            <p className="text-gray-500">
              Adicione seu primeiro item de compra para começar
            </p>
          </div>
        )
      )}
    </div>
  )
}