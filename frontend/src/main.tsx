import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '@/app/store.ts'
import ScrollToTop from '@/shared/components/ScrollToTop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
