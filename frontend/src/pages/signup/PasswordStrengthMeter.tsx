import { HiCheck, HiX } from 'react-icons/hi'

const passwordCriteria = [
  { label: 'Mínimo 8 caracteres', test: (pw: string) => pw.length >= 8 },
  {
    label: 'Contiene letras mayúsculas',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: 'Contiene letras minúsculas',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { label: 'Contiene números', test: (pw: string) => /\d/.test(pw) },
  {
    label: 'Contiene caracteres especiales (!,#,@,*, etc.)',
    test: (pw: string) => /[!-/:-@[-`{-~]/.test(pw),
  },
]

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const passedChecks = passwordCriteria.filter((rule) =>
    rule.test(password)
  ).length
  const strength = (passedChecks / passwordCriteria.length) * 100

  const getStrengthText = (checks: number) => {
    if (checks === 1) return 'Muy débil'
    if (checks === 2) return 'Débil'
    if (checks === 3) return 'Aceptable'
    if (checks === 4) return 'Fuerte'
    if (checks === 5) return 'Muy fuerte'
  }

  return (
    <div className='flex flex-col gap-2 mt-2'>
      <div className='flex justify-between'>
        <h3 className='text-xs text-gray-400'>Seguridad de la contraseña</h3>
        <h3 className='text-xs text-gray-400'>{getStrengthText(passedChecks)}</h3>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='h-2 bg-gray-200 rounded'>
          <div
            className='h-full rounded bg-green-500 transition-all duration-300'
            style={{ width: `${strength}%` }}
          />
        </div>

        <ul className='text-sm space-y-1'>
          {passwordCriteria.map((rule, i) => (
            <li
              key={i}
              className={`flex gap-2 items-center ${
                rule.test(password) ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {rule.test(password) ? <HiCheck /> : <HiX />} {rule.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PasswordStrengthMeter
