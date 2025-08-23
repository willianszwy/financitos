import { forwardRef } from 'react'
import { useCurrencyMask } from '@/hooks/useCurrencyMask'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | number
  onChange?: (value: string, numericValue: number) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, onChange, onBlur, className = '', ...props }, ref) => {
    const currencyMask = useCurrencyMask(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      currencyMask.onChange(e)
      if (onChange) {
        const numericValue = currencyMask.numericValue
        const displayValue = currencyMask.displayValue
        onChange(displayValue, numericValue)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e)
      }
    }

    return (
      <input
        ref={ref}
        type="text"
        value={currencyMask.displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input-field ${className}`}
        placeholder="R$ 0,00"
        {...props}
      />
    )
  }
)