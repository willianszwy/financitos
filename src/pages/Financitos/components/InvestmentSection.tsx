import { useState } from 'react'
import { Plus, Edit2, Info } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { Investment } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils'
import { generateId } from '@/utils/helpers'
import { calculateInvestmentGrowth, calculateInvestmentProjection } from '@/utils/calculations'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { EditInvestmentModal } from '@/components/modals/EditInvestmentModal'
import { useInterestRates } from '@/hooks/useInterestRates'

interface InvestmentSectionProps {
  investments: Investment[]
  onInvestmentChange: (investments: Investment[]) => void
}

interface InvestmentFormData {
  type: 'Poupança' | 'CDI'
  bank: string
  currentValue: string
  rate: string
}

export const InvestmentSection = ({ investments, onInvestmentChange }: InvestmentSectionProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const { rates } = useInterestRates(true) // Auto-fetch rates for the Auto button
  
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<InvestmentFormData>({
    defaultValues: {
      type: 'Poupança',
      bank: '',
      currentValue: '',
      rate: ''
    }
  })

  const selectedType = watch('type')

  // Suggest rate based on investment type
  const getSuggestedRate = (type: 'Poupança' | 'CDI') => {
    if (type === 'CDI' && rates.cdi) {
      return rates.cdi.value.toString()
    }
    if (type === 'Poupança' && rates.selic) {
      // Poupança is typically around 70% of SELIC
      return (rates.selic.value * 0.7).toFixed(2)
    }
    return ''
  }

  const fillSuggestedRate = () => {
    const suggested = getSuggestedRate(selectedType)
    if (suggested) {
      setValue('rate', suggested)
    }
  }

  const onSubmit = (data: InvestmentFormData) => {
    // CurrencyInput already returns the correct numeric value as string
    const currentValue = parseFloat(data.currentValue) || 0
    
    // Handle rate - ensure zero values are preserved
    let rate: number
    if (data.rate === '') {
      rate = 0
    } else {
      rate = parseFloat(data.rate.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    }
    
    // Find existing investment of same type and bank to update, or create new one
    const existingInvestment = investments.find(inv => inv.type === data.type && inv.bank === data.bank)
    
    if (existingInvestment) {
      // Update existing investment
      const growth = calculateInvestmentGrowth(currentValue, existingInvestment.currentValue)
      
      const updatedInvestment: Investment = {
        ...existingInvestment,
        previousValue: existingInvestment.currentValue, // Store current as previous
        currentValue,
        growth,
        rate,
        projection: calculateInvestmentProjection(currentValue, rate),
        updatedAt: new Date().toISOString()
      }

      // Replace the existing investment
      onInvestmentChange(investments.map(inv => 
        inv.id === existingInvestment.id ? updatedInvestment : inv
      ))
    } else {
      // Create new investment
      const newInvestment: Investment = {
        id: generateId(),
        type: data.type,
        bank: data.bank,
        currentValue,
        previousValue: undefined,
        growth: 0, // First time, no growth
        rate,
        projection: calculateInvestmentProjection(currentValue, rate),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onInvestmentChange([...investments, newInvestment])
    }
    reset()
    setIsAdding(false)
  }

  const removeInvestment = (id: string) => {
    onInvestmentChange(investments.filter(item => item.id !== id))
  }

  const editInvestment = (investmentToEdit: Investment) => {
    setEditingInvestment(investmentToEdit)
  }

  const saveEditedInvestment = (updatedInvestment: Investment) => {
    onInvestmentChange(investments.map(item => 
      item.id === updatedInvestment.id ? updatedInvestment : item
    ))
  }

  const groupedInvestments = investments.reduce((acc, investment) => {
    if (!acc[investment.type]) {
      acc[investment.type] = []
    }
    acc[investment.type].push(investment)
    return acc
  }, {} as Record<string, Investment[]>)

  // Ensure all investment types are shown, even if empty
  const allInvestmentTypes: Record<string, Investment[]> = {
    'Poupança': groupedInvestments['Poupança'] || [],
    'CDI': groupedInvestments['CDI'] || []
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-investment-primary flex items-center space-x-2">
          <span>💰</span>
          <span>INVESTIMENTOS</span>
        </h2>
      </div>

      {/* Investment Types */}
      {Object.entries(allInvestmentTypes).map(([type, typeInvestments]) => (
        <div key={type} className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <span>{type === 'Poupança' ? '🏛️' : '📊'}</span>
            <span>{type.toUpperCase()}</span>
          </h3>
          
          <div className="space-y-3">
            {typeInvestments.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500 text-sm">
                  Nenhum investimento em {type} cadastrado
                </p>
              </div>
            ) : (
              typeInvestments.map((investment) => (
                <div key={investment.id} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{investment.bank}</div>
                    <div className="text-lg font-semibold text-investment-primary">
                      {formatCurrency(investment.currentValue)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editInvestment(investment)}
                      className="text-blue-600 hover:text-blue-800 text-sm p-1 hover:bg-blue-100 rounded"
                      title="Editar investimento"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeInvestment(investment.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">
                      Taxa: {formatPercentage(investment.rate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">
                      Projeção: <span className="font-semibold text-investment-primary">
                        {formatCurrency(investment.projection)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      ))}

      {/* Add Investment Form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-investment-primary hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-investment-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Investimento</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border-2 border-investment-primary rounded-lg bg-blue-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select {...register('type')} className="input-field">
                <option value="Poupança">Poupança</option>
                <option value="CDI">CDI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco
              </label>
              <input
                type="text"
                {...register('bank', { required: 'Banco é obrigatório' })}
                className="input-field"
                placeholder="Ex: Itaú, Nubank..."
              />
              {errors.bank && (
                <p className="text-red-600 text-sm mt-1">{errors.bank.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Atual
              </label>
              <Controller
                name="currentValue"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={(_, numericValue) => {
                      field.onChange((numericValue || 0).toString())
                    }}
                  />
                )}
              />
              {errors.currentValue && (
                <p className="text-red-600 text-sm mt-1">{errors.currentValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  {...register('rate')}
                  className="input-field flex-1"
                  placeholder="0,5"
                />
                <button
                  type="button"
                  onClick={fillSuggestedRate}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  title={`Usar taxa sugerida para ${selectedType}`}
                >
                  <Info className="h-3 w-3" />
                  <span>Auto</span>
                </button>
              </div>
              {getSuggestedRate(selectedType) && (
                <p className="text-blue-600 text-xs mt-1">
                  Taxa sugerida para {selectedType}: {getSuggestedRate(selectedType)}%
                </p>
              )}
              {errors.rate && (
                <p className="text-red-600 text-sm mt-1">{errors.rate.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
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
              {watch('bank') && watch('type') && investments.find(inv => inv.type === watch('type') && inv.bank === watch('bank')) 
                ? 'Atualizar' 
                : 'Adicionar'
              }
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      <EditInvestmentModal
        investment={editingInvestment}
        isOpen={!!editingInvestment}
        onClose={() => setEditingInvestment(null)}
        onSave={saveEditedInvestment}
      />
    </div>
  )
}