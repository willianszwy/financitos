import { forwardRef, useState, useCallback } from 'react'

interface CurrencyInputProps {
  value?: string | number
  onChange?: (value: string | undefined, numericValue: number | undefined) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  className?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, onBlur, className = '', ...props }, ref) => {
    // Converter valor inicial para centavos
    const [cents, setCents] = useState(() => {
      if (!value) return 0
      if (typeof value === 'number') return Math.round(value * 100)
      const num = parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0
      return Math.round(num * 100)
    })

    // Formatar centavos para exibição brasileira
    const formatCents = (centavos: number): string => {
      if (centavos === 0) return ''
      const reais = Math.floor(centavos / 100)
      const centavosResto = centavos % 100
      const reaisFormatted = reais.toLocaleString('pt-BR')
      return `${reaisFormatted},${centavosResto.toString().padStart(2, '0')}`
    }

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      // Remove prefixo R$ e tudo exceto números
      const numericOnly = inputValue.replace(/[^\d]/g, '')
      
      if (!numericOnly) {
        setCents(0)
        onChange?.(undefined, 0)
        return
      }
      
      const newCents = parseInt(numericOnly, 10)
      setCents(newCents)
      
      const realValue = newCents / 100
      const formattedValue = `R$ ${formatCents(newCents)}`
      
      onChange?.(formattedValue, realValue)
    }, [onChange])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e)
    }, [onBlur])

    const displayValue = cents === 0 ? '' : `R$ ${formatCents(cents)}`

    return (
      <input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input-field ${className}`}
        placeholder="R$ 0,00"
        {...props}
      />
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'