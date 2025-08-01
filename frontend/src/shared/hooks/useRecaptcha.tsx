import { useState, useRef, useCallback, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

const useRecaptcha = () => {
  const [recaptchaToken, setRecapchaToken] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const handleRecaptcha = useCallback((token: string | null) => {
    setRecapchaToken(token || '')
  }, [])

  useEffect(() => {
    const refreshCaptcha = () => {
      if (recaptchaRef.current && recaptchaToken) {
        recaptchaRef.current.reset()
        setRecapchaToken('')
      }
    }

    let tokenRefreshTimeout: NodeJS.Timeout | null = null

    if (recaptchaToken) {
      tokenRefreshTimeout = setTimeout(refreshCaptcha, 110000) // 110 seconds
    }

    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout)
      }
    }
  }, [recaptchaToken])

  return { recaptchaToken, setRecapchaToken, recaptchaRef, handleRecaptcha }
}

export default useRecaptcha
