import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X, Info } from 'lucide-react'
import { Investment } from '@/types'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { calculateInvestmentGrowth, calculateInvestmentProjection } from '@/utils/calculations'
import { useInterestRates } from '@/hooks/useInterestRates'

interface EditInvestmentModalProps {
  investment: Investment | null
  isOpen: boolean
  onClose: () => void
  onSave: (investment: Investment) => void
}

interface InvestmentFormData {
  type: 'Poupança' | 'CDI'
  bank: string
  currentValue: string
  rate: string
}

export const EditInvestmentModal = ({ investment, isOpen, onClose, onSave }: EditInvestmentModalProps) => {
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<InvestmentFormData>()
  const { rates } = useInterestRates(true)
  
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

  useEffect(() => {
    if (investment && isOpen) {
      reset({
        type: investment.type,
        bank: investment.bank,
        currentValue: investment.currentValue.toString(),
        rate: investment.rate.toString()
      })
    }
  }, [investment, isOpen, reset])

  const onSubmit = (data: InvestmentFormData) => {
    if (!investment) return

    // CurrencyInput already returns the correct numeric value as string
    const currentValue = parseFloat(data.currentValue) || 0

    // Handle rate - ensure zero values are preserved
    let rate: number
    if (data.rate === '') {
      rate = 0
    } else {
      rate = parseFloat(data.rate.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    }
    
    // Calculate growth based on previous value stored in the investment
    const growth = calculateInvestmentGrowth(currentValue, investment.previousValue || investment.currentValue)

    const updatedInvestment: Investment = {
      ...investment,
      type: data.type,
      bank: data.bank,
      currentValue,
      growth,
      rate,
      projection: calculateInvestmentProjection(currentValue, rate),
      updatedAt: new Date().toISOString()
    }

    onSave(updatedInvestment)
    onClose()
  }

  if (!isOpen || !investment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Investimento</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
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
                      field.onChange(numericValue.toString())
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

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
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
    </div>
  )
}