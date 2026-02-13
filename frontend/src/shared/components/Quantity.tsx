import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/utils/utils'

type QuantityProps = {
  className?: string
  onChange: (value: number) => void
  quantity?: number
  defaultValue?: number
  stock: number
}

const Quantity = ({ onChange, className, quantity, defaultValue, stock }: QuantityProps) => {
  const isLowQuantity = quantity && quantity > 0 && quantity <= 10
  const isHighQuantity = quantity && quantity > 10
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <p>Cantidad:</p>
      
      {/* Select quantity 1-10 */}
      {(defaultValue || isLowQuantity)  && (
        <div
        >
          <Select
            defaultValue={defaultValue?.toString()}
            value={quantity?.toString()}
            onValueChange={(value) => onChange(Number(value))}
          >
            <SelectTrigger className='text-xs sm:text-base'>
              <SelectValue placeholder="1" />
            </SelectTrigger>

            {/* Display select options */}
            <SelectContent>
              {Array.from({ length: 10 }).map((_, i) => {
                if (i < stock) {
                  const next = i + 1
                  return <SelectItem className='text-xs sm:text-base' value={next.toString()} key={next}>{next}</SelectItem>
                }
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Input for quantity > 10 */}
      {isHighQuantity && (
        <Input
          type='number'
          value={quantity}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
    </div>
  )
}

export default Quantity