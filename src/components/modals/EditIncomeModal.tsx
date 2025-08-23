import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { Income } from '@/types'
import { CurrencyInput } from '@/components/common/CurrencyInput'

interface EditIncomeModalProps {
  income: Income | null
  isOpen: boolean
  onClose: () => void
  onSave: (income: Income) => void
}

interface IncomeFormData {
  source: string
  date: string
  amount: string
}

export const EditIncomeModal = ({ income, isOpen, onClose, onSave }: EditIncomeModalProps) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<IncomeFormData>()

  useEffect(() => {
    if (income && isOpen) {
      reset({
        source: income.source,
        date: income.date,
        amount: income.amount.toString()
      })
    }
  }, [income, isOpen, reset])

  const onSubmit = (data: IncomeFormData) => {
    if (!income) return

    const updatedIncome: Income = {
      ...income,
      source: data.source,
      date: data.date,
      amount: typeof data.amount === 'string' 
        ? parseFloat(data.amount.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
        : data.amount,
      updatedAt: new Date().toISOString()
    }

    onSave(updatedIncome)
    onClose()
  }

  if (!isOpen || !income) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Entrada</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fonte
            </label>
            <input
              type="text"
              {...register('source', { required: 'Fonte é obrigatória' })}
              className="input-field"
              placeholder="Ex: Salário, Freelancer..."
            />
            {errors.source && (
              <p className="text-red-600 text-sm mt-1">{errors.source.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              {...register('date', { required: 'Data é obrigatória' })}
              className="input-field"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <Controller
              name="amount"
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
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
            )}
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