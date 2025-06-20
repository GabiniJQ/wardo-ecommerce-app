import { useState } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { Control, FieldValues, FormState, Path } from 'react-hook-form'

interface PasswordInputFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  maxLength?: number
  formState?: FormState<T>
  placeholder?: string
}

export const PasswordInputField = <T extends FieldValues>({
  control,
  name,
  label,
  maxLength = 72,
  formState,
  placeholder,
}: PasswordInputFieldProps<T>) => {
  const [isVisible, setIsVisible] = useState(false)

  const invalidInput = formState?.errors[name]

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className='flex'>
            <FormControl>
              <Input
                className='z-10 border-r-0 rounded-r-none w-[90%] placeholder:text-sm'
                {...field}
                type={isVisible ? 'text' : 'password'}
                maxLength={maxLength}
                placeholder={placeholder ?? ''}
              />
            </FormControl>
            <Button
              variant='ghost'
              className={`border border-l border-input rounded-l-none sm:border-l-0
                ${invalidInput ? 'border-destructive' : 'border-input'}
                `}
              type='button'
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <HiEyeOff /> : <HiEye />}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
