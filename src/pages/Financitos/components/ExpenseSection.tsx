import { useState } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { Expense } from '@/types'
import { formatCurrency, getTodayBR, formatDateToBR, formatDateFromBR } from '@/utils'
import { generateId } from '@/utils/helpers'
import { sortByDateAscending } from '@/utils/sorting'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { ReceiptUpload } from '@/components/common/ReceiptUpload'
import { EditExpenseModal } from '@/components/modals/EditExpenseModal'
import { CoinIcon } from '@/components/common/CoinIcon'

interface ExpenseSectionProps {
  expenses: Expense[]
  onExpenseChange: (expenses: Expense[]) => void
}

interface ExpenseFormData {
  description: string
  deadline: string
  status: 'Pago' | 'Pendente'
  paymentMethod: 'Crédito' | 'Débito' | 'PIX' | 'Dinheiro'
  amount: number
}

export const ExpenseSection = ({ expenses, onExpenseChange }: ExpenseSectionProps) => {
  const [isAddingRecurrent, setIsAddingRecurrent] = useState(false)
  const [isAddingUnique, setIsAddingUnique] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const recurrentForm = useForm<ExpenseFormData>({
    defaultValues: {
      description: '',
      deadline: formatDateFromBR(getTodayBR()),
      status: 'Pendente',
      paymentMethod: 'PIX',
      amount: 0
    }
  })

  const uniqueForm = useForm<ExpenseFormData>({
    defaultValues: {
      description: '',
      deadline: formatDateFromBR(getTodayBR()),
      status: 'Pendente',
      paymentMethod: 'PIX',
      amount: 0
    }
  })

  const recurrentExpenses = expenses.filter(expense => expense.type === 'Recorrente')
  const uniqueExpenses = expenses.filter(expense => expense.type === 'Única')

  const createExpense = (data: ExpenseFormData, type: 'Recorrente' | 'Única') => {
    const newExpense: Expense = {
      id: generateId(),
      description: data.description,
      type,
      deadline: formatDateToBR(data.deadline),
      status: data.status,
      paymentMethod: data.paymentMethod,
      amount: typeof data.amount === 'number' ? data.amount : parseFloat(data.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onExpenseChange([...expenses, newExpense])
  }

  const onSubmitRecurrent = (data: ExpenseFormData) => {
    createExpense(data, 'Recorrente')
    recurrentForm.reset()
    setIsAddingRecurrent(false)
  }

  const onSubmitUnique = (data: ExpenseFormData) => {
    createExpense(data, 'Única')
    uniqueForm.reset()
    setIsAddingUnique(false)
  }

  const removeExpense = (id: string) => {
    onExpenseChange(expenses.filter(item => item.id !== id))
  }


  const editExpense = (expenseToEdit: Expense) => {
    setEditingExpense(expenseToEdit)
  }

  const saveEditedExpense = (updatedExpense: Expense) => {
    onExpenseChange(expenses.map(item => 
      item.id === updatedExpense.id ? updatedExpense : item
    ))
  }

  const toggleExpenseStatus = (expenseId: string) => {
    onExpenseChange(expenses.map(item => 
      item.id === expenseId 
        ? { ...item, status: item.status === 'Pago' ? 'Pendente' : 'Pago', updatedAt: new Date().toISOString() }
        : item
    ))
  }

  const ExpenseForm = ({ 
    form, 
    onSubmit, 
    onCancel, 
    type 
  }: { 
    form: typeof recurrentForm
    onSubmit: (data: ExpenseFormData) => void
    onCancel: () => void
    type: string
  }) => {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border-2 border-expense-primary rounded-lg bg-red-50">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <input
            type="text"
            {...form.register('description', { required: 'Descrição é obrigatória' })}
            className="input-field"
            placeholder={`Ex: ${type === 'Recorrente' ? 'Conta de luz, Aluguel...' : 'Mercado, Farmácia...'}`}
          />
          {form.formState.errors.description && (
            <p className="text-red-600 text-sm mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vencimento
            </label>
            <input
              type="date"
              {...form.register('deadline', { required: 'Vencimento é obrigatório' })}
              className="input-field"
            />
            {form.formState.errors.deadline && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select {...form.register('status')} className="input-field">
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modo Pagamento
            </label>
            <select {...form.register('paymentMethod')} className="input-field">
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
              control={form.control}
              rules={{ required: 'Valor é obrigatório' }}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={(_, numericValue) => field.onChange(numericValue || 0)}
                />
              )}
            />
            {form.formState.errors.amount && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.amount.message}</p>
            )}
          </div>
        </div>

        <ReceiptUpload
          expenseDescription={form.getValues('description')}
          expenseAmount={form.getValues('amount') || undefined}
          expenseDate={formatDateToBR(form.getValues('deadline'))}
        />

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
          <button type="submit" className="flex-1 btn-primary">
            Adicionar
          </button>
        </div>
      </form>
    )
  }

  const ExpenseList = ({ expenseList, emptyMessage }: { expenseList: Expense[], emptyMessage: string }) => {
    if (expenseList.length === 0) {
      return (
        <div className="text-center text-gray-500 text-sm py-4">
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {sortByDateAscending(expenseList).map((expense) => (
          <div
            key={expense.id}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">{expense.description}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Vencimento: {expense.deadline}
                </div>
                <div className="text-sm text-gray-600">
                  {expense.paymentMethod} • {formatCurrency(expense.amount)}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleExpenseStatus(expense.id)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${
                    expense.status === 'Pago' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                  title={`Clique para alterar para ${expense.status === 'Pago' ? 'Pendente' : 'Pago'}`}
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Recurrent Expenses Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-expense-primary flex items-center space-x-2">
            <span>🔄</span>
            <span>SAÍDAS RECORRENTES</span>
          </h2>
        </div>

        {/* Add Recurrent Expense Form */}
        {!isAddingRecurrent ? (
          <button
            onClick={() => setIsAddingRecurrent(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-expense-primary hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-expense-primary"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Saída Recorrente</span>
          </button>
        ) : (
          <ExpenseForm
            form={recurrentForm}
            onSubmit={onSubmitRecurrent}
            onCancel={() => {
              setIsAddingRecurrent(false)
              recurrentForm.reset()
            }}
            type="Recorrente"
          />
        )}

        {/* Recurrent Expenses List */}
        <div className="mt-4">
          <ExpenseList 
            expenseList={recurrentExpenses} 
            emptyMessage="Nenhuma saída recorrente cadastrada"
          />
        </div>
      </div>

      {/* Unique Expenses Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-expense-primary flex items-center space-x-2">
            <CoinIcon className="h-5 w-5" />
            <span>SAÍDAS ÚNICAS</span>
          </h2>
        </div>

        {/* Add Unique Expense Form */}
        {!isAddingUnique ? (
          <button
            onClick={() => setIsAddingUnique(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-expense-primary hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-expense-primary"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Saída Única</span>
          </button>
        ) : (
          <ExpenseForm
            form={uniqueForm}
            onSubmit={onSubmitUnique}
            onCancel={() => {
              setIsAddingUnique(false)
              uniqueForm.reset()
            }}
            type="Única"
          />
        )}

        {/* Unique Expenses List */}
        <div className="mt-4">
          <ExpenseList 
            expenseList={uniqueExpenses} 
            emptyMessage="Nenhuma saída única cadastrada"
          />
        </div>
      </div>

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