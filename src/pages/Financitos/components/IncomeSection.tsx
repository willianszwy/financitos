import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Income } from '@/types'
import { formatCurrency, formatDate, getTodayISO } from '@/utils'
import { generateId } from '@/utils/helpers'

interface IncomeSectionProps {
  income: Income[]
  onIncomeChange: (income: Income[]) => void
}

interface IncomeFormData {
  source: string
  date: string
  amount: string
}

export const IncomeSection = ({ income, onIncomeChange }: IncomeSectionProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IncomeFormData>({
    defaultValues: {
      source: '',
      date: getTodayISO(),
      amount: ''
    }
  })

  const onSubmit = (data: IncomeFormData) => {
    const newIncome: Income = {
      id: generateId(),
      source: data.source,
      date: data.date,
      amount: parseFloat(data.amount.replace(/[^\d.,]/g, '').replace(',', '.')),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onIncomeChange([...income, newIncome])
    reset()
    setIsAdding(false)
  }

  const removeIncome = (id: string) => {
    onIncomeChange(income.filter(item => item.id !== id))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-income-primary flex items-center space-x-2">
          <span>💰</span>
          <span>ENTRADAS</span>
        </h2>
      </div>

      {/* Add Income Form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-income-primary hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-income-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Entrada</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border-2 border-income-primary rounded-lg bg-green-50">
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
            <input
              type="text"
              {...register('amount', { required: 'Valor é obrigatório' })}
              className="input-field"
              placeholder="R$ 0,00"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
            )}
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

      {/* Income List */}
      {income.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Entradas do mês:</h3>
          {income.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-800">{item.source}</div>
                <div className="text-sm text-gray-600">{formatDate(item.date)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-income-primary">
                  {formatCurrency(item.amount)}
                </span>
                <button
                  onClick={() => removeIncome(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}