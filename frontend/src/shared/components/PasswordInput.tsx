import { Button } from '@/shared/components/ui/button'
import { FormControl } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { HiEye, HiEyeOff } from 'react-icons/hi'

type Props = {
  field: ControllerRenderProps<FieldValues, string>
  visibility: boolean
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const PasswordInput = ({ field, visibility, setVisibility }: Props) => {
  return (
    <div className='flex'>
      <FormControl>
        <Input
          className='z-10 border-r-0 rounded-r-none w-[90%]'
          maxLength={72}
          {...field}
          type={visibility ? 'text' : 'password'}
        />
      </FormControl>

      <Button
        variant='ghost'
        className='border border-l border-input rounded-l-none sm:border-l-0'
        type='button'
        onClick={() => setVisibility(
          !visibility
        )}
      >
        {visibility ? <HiEyeOff /> : <HiEye />}
      </Button>
    </div>
  )
}

export default PasswordInput