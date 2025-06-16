import { AppDispatch, RootState } from '@/app/store'
import { resetVerifyEmail, verifyEmail, resetJustRegistered } from '@/features/auth/authSlice'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<HTMLInputElement[]>([])

  // Dispatch functions
  const dispatch = useDispatch<AppDispatch>()
  const { user, justRegistered } = useSelector((state: RootState) => state.auth)
  const { isSuccess, isError, isLoading, message } = useSelector((state: RootState) => state.auth.verifyEmail)

  const navigate = useNavigate()

  useEffect(() => {
    const justRegisteredStorage = sessionStorage.getItem('justRegistered')

    if (!justRegistered || justRegisteredStorage !== 'true') {
      navigate('/')
    }
  }, [navigate, justRegistered])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (triggerInput: HTMLInputElement, newCode: string) => {
    // Return if input is not a number
    if (isNaN(Number(newCode))) {
      return
    }

    // Find triggered input slot
    const inputIndex = inputRefs.current.findIndex(
      (input) => input === triggerInput
    )

    // Handle Copy Paste
    const newCodeArray = Array.from(newCode)

    if (newCodeArray.length > 1) {
      setCode((prev) => {
        const updated = [...prev]
        newCodeArray.forEach((digit, i) => {
          if (inputIndex + i < updated.length) {
            updated[inputIndex + i] = digit
          }
        })
        return updated
      })

      // Focus last input affected
      const nextIndex = Math.min(
        inputIndex + newCodeArray.length,
        inputRefs.current.length - 1
      )
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0)
    } else {
      setCode((prevCode) => {
        const updated = [...prevCode]
        updated[inputIndex] = newCode
        return updated
      })

      if (inputRefs.current[inputIndex + 1] && newCode !== '') {
        setTimeout(() => inputRefs.current[inputIndex + 1].focus(), 0)
      }
    }

    // Skip to next input
    if (inputRefs.current[inputIndex + 1] && newCode !== '') {
      inputRefs.current[inputIndex + 1].focus()

      if (newCodeArray.length === 6)
        inputRefs.current[inputRefs.current.length - 1].focus()
    }
  }

  // Back to previous input on Backspace
  const focusPrevInput = (index: number) => {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Autosubmit when all digits are filled
  useEffect(() => {
    const allFilled = code.every((digit) => digit !== '')

    if (allFilled) {
      const fullCode = code.join('')

      dispatch(verifyEmail(fullCode))
    }
  }, [code, dispatch])

  // State managment
  useEffect(() => {
    if (isSuccess) {
      dispatch(resetJustRegistered())
      navigate('/')
      dispatch(resetVerifyEmail())
    }

    
  }, [isError, isSuccess, dispatch, message, user, navigate])

  if (isLoading) {
    return <div className='rounded-full border-primary border-2 animate-spin'></div>
  }

  return (
    <div className='flex flex-col items-center gap-10 w-full px-4 max-w-[600px] mx-auto'>
      <div className='flex flex-col justify-center items-center gap-1'>
        <h1 className='text-2xl text-center font-semibold'>
          Código de verificación enviado al correo
        </h1>

        <HiCheckCircle className='text-cyan-400 size-6' />
      </div>

      <div className='flex gap-2'>
        <p>
          Introduce el código de verificación que enviamos a tu correo
          electrónico. ¿No te llegó? {' '} 
          <span className='text-primary link'>Reenviar código.</span>
        </p>
      </div>

      <form>
        <div className='flex flex-col gap-10 items-center'>
          <div className='flex gap-2 mt-6 sm:gap-4'>
            {code.map((digit, i) => (
              <CodeSlot
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el!
                }}
                digit={digit}
                index={i}
                handleChange={handleChange}
                focusPrevInput={focusPrevInput}
              />
            ))}
          </div>

          {isError && <p className='text-red-500'>{message}</p>}
        </div>
      </form>
    </div>
  )
}

const CodeSlot = forwardRef<
  HTMLInputElement,
  {
    digit: string
    index: number
    handleChange: (triggerInput: HTMLInputElement, newCode: string) => void
    focusPrevInput: (index: number) => void
  }
>(({ digit, index, handleChange, focusPrevInput }, ref) => {
  return (
    <input
      ref={ref}
      className='text-center w-10 h-10 text-2xl bg-primary-foreground outline-1 rounded text-primary border-gray-400 focus-visible:outline-primary'
      type='text'
      value={digit}
      onChange={(e) => {
        handleChange(e.currentTarget, e.currentTarget.value)
      }}
      onKeyDown={(e) => {
        if (e.code === 'Backspace' && !e.currentTarget.value) {
          e.preventDefault()
          focusPrevInput(index)
        }
      }}
    />
  )
})

export default VerifyEmailPage
