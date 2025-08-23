import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { Investment } from '@/types'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { calculateInvestmentGrowth, calculateInvestmentProjection } from '@/utils/calculations'

interface EditInvestmentModalProps {
  investment: Investment | null
  investments: Investment[]
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

export const EditInvestmentModal = ({ investment, investments, isOpen, onClose, onSave }: EditInvestmentModalProps) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<InvestmentFormData>()

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

    const currentValue = typeof data.currentValue === 'string' 
      ? parseFloat(data.currentValue.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
      : data.currentValue

    const rate = typeof data.rate === 'string'
      ? parseFloat(data.rate.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
      : data.rate
    
    // Find previous investment of same type for growth calculation (excluding current one)
    const previousInvestment = investments.find(inv => 
      inv.type === data.type && 
      inv.bank === data.bank && 
      inv.id !== investment.id
    )
    
    const growth = previousInvestment 
      ? calculateInvestmentGrowth(currentValue, previousInvestment.currentValue)
      : calculateInvestmentGrowth(currentValue, investment.previousValue || 0)

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
                rules={{ required: 'Valor é obrigatório' }}
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
              <input
                type="text"
                {...register('rate', { 
                  required: 'Taxa é obrigatória',
                  pattern: {
                    value: /^\d+([.,]\d+)?$/,
                    message: 'Digite um número válido'
                  }
                })}
                className="input-field"
                placeholder="0,5"
              />
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