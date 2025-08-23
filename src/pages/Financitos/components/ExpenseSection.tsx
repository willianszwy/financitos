import { useState } from 'react'
import { Plus, Paperclip, Edit2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { Expense } from '@/types'
import { formatCurrency, formatDate, getTodayISO } from '@/utils'
import { generateId } from '@/utils/helpers'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { EditExpenseModal } from '@/components/modals/EditExpenseModal'

interface ExpenseSectionProps {
  expenses: Expense[]
  onExpenseChange: (expenses: Expense[]) => void
}

interface ExpenseFormData {
  description: string
  type: 'Fixa' | 'Única'
  dueDate: string
  paymentDate: string
  status: 'Pago' | 'Pendente'
  paymentMethod: 'Crédito' | 'Débito' | 'PIX' | 'Dinheiro'
  amount: string
}

export const ExpenseSection = ({ expenses, onExpenseChange }: ExpenseSectionProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<ExpenseFormData>({
    defaultValues: {
      description: '',
      type: 'Única',
      dueDate: getTodayISO(),
      paymentDate: getTodayISO(),
      status: 'Pendente',
      paymentMethod: 'PIX',
      amount: ''
    }
  })

  const status = watch('status')

  const onSubmit = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      description: data.description,
      type: data.type,
      dueDate: data.dueDate,
      paymentDate: data.status === 'Pago' ? data.paymentDate : undefined,
      status: data.status,
      paymentMethod: data.paymentMethod,
      amount: typeof data.amount === 'string' 
        ? parseFloat(data.amount.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
        : data.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onExpenseChange([...expenses, newExpense])
    reset()
    setIsAdding(false)
  }

  const removeExpense = (id: string) => {
    onExpenseChange(expenses.filter(item => item.id !== id))
  }

  const toggleExpenseStatus = (id: string) => {
    onExpenseChange(expenses.map(expense => 
      expense.id === id 
        ? { 
            ...expense, 
            status: expense.status === 'Pago' ? 'Pendente' : 'Pago',
            paymentDate: expense.status === 'Pendente' ? getTodayISO() : undefined,
            updatedAt: new Date().toISOString()
          }
        : expense
    ))
  }

  const editExpense = (expenseToEdit: Expense) => {
    setEditingExpense(expenseToEdit)
  }

  const saveEditedExpense = (updatedExpense: Expense) => {
    onExpenseChange(expenses.map(item => 
      item.id === updatedExpense.id ? updatedExpense : item
    ))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-expense-primary flex items-center space-x-2">
          <span>🛒</span>
          <span>SAÍDAS</span>
        </h2>
      </div>

      {/* Add Expense Form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-expense-primary hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-expense-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Saída</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border-2 border-expense-primary rounded-lg bg-red-50">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select {...register('type')} className="input-field">
                <option value="Única">Única</option>
                <option value="Fixa">Fixa</option>
              </select>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprovante
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 transition-colors cursor-pointer">
              <Paperclip className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Arraste aqui ou clique para fazer upload</p>
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

      {/* Expense List */}
      {expenses.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Saídas do mês:</h3>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{expense.description}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      expense.type === 'Fixa' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {expense.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Vencimento: {formatDate(expense.dueDate)}
                    {expense.paymentDate && ` • Pago em: ${formatDate(expense.paymentDate)}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {expense.paymentMethod} • {formatCurrency(expense.amount)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleExpenseStatus(expense.id)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                      expense.status === 'Pago' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {expense.status}
                  </button>
                  <button
                    onClick={() => editExpense(expense)}
                    className="text-blue-600 hover:text-blue-800 text-sm p-1 hover:bg-blue-100 rounded"
                    title="Editar saída"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditExpenseModal
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={saveEditedExpense}
      />
    </div>
  )
}