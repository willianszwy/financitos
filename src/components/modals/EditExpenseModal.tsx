import { useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { Expense } from '@/types'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { ReceiptUpload } from '@/components/common/ReceiptUpload'

interface EditExpenseModalProps {
  expense: Expense | null
  isOpen: boolean
  onClose: () => void
  onSave: (expense: Expense) => void
}

interface ExpenseFormData {
  description: string
  dueDate: string
  paymentDate: string
  status: 'Pago' | 'Pendente'
  paymentMethod: 'Crédito' | 'Débito' | 'PIX' | 'Dinheiro'
  amount: number
}

export const EditExpenseModal = ({ expense, isOpen, onClose, onSave }: EditExpenseModalProps) => {
  const { register, handleSubmit, reset, control, watch, getValues, formState: { errors } } = useForm<ExpenseFormData>()
  
  const status = watch('status')


  useEffect(() => {
    if (expense && isOpen) {
      reset({
        description: expense.description,
        dueDate: expense.dueDate,
        paymentDate: expense.paymentDate || '',
        status: expense.status,
        paymentMethod: expense.paymentMethod,
        amount: expense.amount
      })
    }
  }, [expense, isOpen, reset])

  const onSubmit = (data: ExpenseFormData) => {
    if (!expense) return

    const updatedExpense: Expense = {
      ...expense,
      description: data.description,
      dueDate: data.dueDate,
      paymentDate: data.status === 'Pago' ? data.paymentDate : undefined,
      status: data.status,
      paymentMethod: data.paymentMethod,
      amount: typeof data.amount === 'number' ? data.amount : parseFloat(data.amount) || 0,
      updatedAt: new Date().toISOString()
    }

    onSave(updatedExpense)
    onClose()
  }

  if (!isOpen || !expense) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Editar Saída</h2>
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
              Descrição
            </label>
            <input
              type="text"
              {...register('description', { required: 'Descrição é obrigatória' })}
              className="input-field"
              placeholder="Ex: Mercado, Conta de luz..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vencimento
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'Vencimento é obrigatório' })}
                className="input-field"
              />
              {errors.dueDate && (
                <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>

            {status === 'Pago' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Pagamento
                </label>
                <input
                  type="date"
                  {...register('paymentDate')}
                  className="input-field"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modo Pagamento
              </label>
              <select {...register('paymentMethod')} className="input-field">
                <option value="PIX">PIX</option>
                <option value="Crédito">Crédito</option>
                <option value="Débito">Débito</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
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
                    onChange={(_, numericValue) => field.onChange(numericValue || 0)}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <ReceiptUpload
            expenseDescription={getValues('description')}
            expenseAmount={getValues('amount') || undefined}
            expenseDate={getValues('dueDate')}
          />

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