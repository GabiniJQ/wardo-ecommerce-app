import axios/* , { AxiosError } */ from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

/* api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    if (status && status < 500) {
      return Promise.reject(error)
    }

    // Log 500+ errors
    console.error('🔴 Axios Error:', error)

    return Promise.reject(error)
  }
) */

export default api