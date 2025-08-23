import { useState } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Investment } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils'
import { generateId } from '@/utils/helpers'
import { calculateInvestmentGrowth, calculateInvestmentProjection } from '@/utils/calculations'

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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvestmentFormData>({
    defaultValues: {
      type: 'Poupança',
      bank: '',
      currentValue: '',
      rate: ''
    }
  })

  const onSubmit = (data: InvestmentFormData) => {
    const currentValue = parseFloat(data.currentValue.replace(/[^\d.,]/g, '').replace(',', '.'))
    const rate = parseFloat(data.rate.replace(/[^\d.,]/g, '').replace(',', '.'))
    
    // Find previous investment of same type for growth calculation
    const previousInvestment = investments.find(inv => inv.type === data.type && inv.bank === data.bank)
    const growth = previousInvestment 
      ? calculateInvestmentGrowth(currentValue, previousInvestment.currentValue)
      : 0

    const newInvestment: Investment = {
      id: generateId(),
      type: data.type,
      bank: data.bank,
      currentValue,
      previousValue: previousInvestment?.currentValue,
      growth,
      rate,
      projection: calculateInvestmentProjection(currentValue, rate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onInvestmentChange([...investments, newInvestment])
    reset()
    setIsAdding(false)
  }

  const removeInvestment = (id: string) => {
    onInvestmentChange(investments.filter(item => item.id !== id))
  }

  const groupedInvestments = investments.reduce((acc, investment) => {
    if (!acc[investment.type]) {
      acc[investment.type] = []
    }
    acc[investment.type].push(investment)
    return acc
  }, {} as Record<string, Investment[]>)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-investment-primary flex items-center space-x-2">
          <span>💰</span>
          <span>INVESTIMENTOS</span>
        </h2>
      </div>

      {/* Investment Types */}
      {Object.entries(groupedInvestments).map(([type, typeInvestments]) => (
        <div key={type} className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <span>{type === 'Poupança' ? '🏛️' : '📊'}</span>
            <span>{type.toUpperCase()}</span>
          </h3>
          
          <div className="space-y-3">
            {typeInvestments.map((investment) => (
              <div key={investment.id} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{investment.bank}</div>
                    <div className="text-lg font-semibold text-investment-primary">
                      {formatCurrency(investment.currentValue)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeInvestment(investment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Crescimento: {formatCurrency(investment.growth)}</span>
                    </div>
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
            ))}
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
              <input
                type="text"
                {...register('currentValue', { required: 'Valor é obrigatório' })}
                className="input-field"
                placeholder="R$ 0,00"
              />
              {errors.currentValue && (
                <p className="text-red-600 text-sm mt-1">{errors.currentValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa (%)
              </label>
              <input
                type="text"
                {...register('rate', { required: 'Taxa é obrigatória' })}
                className="input-field"
                placeholder="0,5"
              />
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
              Adicionar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}