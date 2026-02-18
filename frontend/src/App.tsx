import AuthLayout from '@/shared/components/AuthLayout'
import Layout from '@/shared/components/Layout'
import { ROUTES } from '@/consts/routes'
import CartPage from '@/pages/cart'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import AccountSettingsList from '@/pages/myAccount/AccountSettingsList'
import MyAccountPage from '@/pages/myAccount'
import AccountInformationPage from '@/pages/myAccount/accountInformation'
import AddressesPage from '@/pages/myAccount/addresses'
import CardsPage from '@/pages/myAccount/cards'
import OrdersPage from '@/pages/myAccount/orders'
import NotFoundPage from '@/pages/notFound'
import ProductPage from '@/pages/product'
import SearchResultsPage from '@/pages/searchResults'
import SignupPage from '@/pages/signup'
import VerifyEmailPage from '@/pages/verifyEmail'
import { Routes, Route } from 'react-router'
import ForgotPassWordPage from '@/pages/forgotPassword'
import AddressEditPage from '@/pages/myAccount/addresses/addressEdit'
import AddressAddPage from '@/pages/myAccount/addresses/addressAdd'
import ResetPasswordPage from '@/pages/forgotPassword/resetPassword'
import ForgotPasswordLayout from '@/shared/components/ForgotPasswordLayout'
import CategoryPage from '@/pages/category'
import CheckoutPage from '@/pages/checkout'
import SuccessPage from '@/pages/checkout/successPage'

function App() {
  if (import.meta.env.DEV || window.location.search.includes('debug')) {
    import('eruda').then((eruda) => eruda.default.init())
  }
  console.log('🔐 Login successful')
        console.log('📝 Cookies:', document.cookie)
        console.log('🌐 Current domain:', window.location.hostname)

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
        <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />
        <Route path={ROUTES.MY_ACCOUNT}>
          <Route element={<MyAccountPage />}>
            <Route index element={<AccountSettingsList />} />
            <Route
              path={ROUTES.ACCOUNT_INFO}
              element={<AccountInformationPage />}
            />
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />

            <Route path={ROUTES.ADDRESSES}>
              <Route index element={<AddressesPage />} />
              <Route path={ROUTES.ADDRESSES_ADD} element={<AddressAddPage />} />
              <Route
                path={ROUTES.ADDRESSES_EDIT}
                element={<AddressEditPage />}
              />
            </Route>

            <Route path={ROUTES.CARDS} element={<CardsPage />} />
          </Route>
        </Route>
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route path={ROUTES.SUCCESS} element={<SuccessPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        <Route element={<ForgotPasswordLayout />}>
          <Route path={ROUTES.FORGOT_PASSWORD}>
            <Route index element={<ForgotPassWordPage />} />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={<ResetPasswordPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
