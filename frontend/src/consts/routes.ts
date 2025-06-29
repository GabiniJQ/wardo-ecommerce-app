export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/forgot-password/:token',
  CART: '/cart',
  PRODUCTS: '/products',
  PRODUCT: '/:category/:slug/:id',
  CATEGORY: '/:category/',
  VERIFY_EMAIL: '/verify-email',
  SEARCH: '/search',
  MY_ACCOUNT: '/my-account',
  ACCOUNT_INFO: '/my-account/information',
  ORDERS: '/my-account/orders',
  ADDRESSES: '/my-account/addresses',
  ADDRESSES_ADD: '/my-account/addresses/add',
  ADDRESSES_EDIT: '/my-account/addresses/:addressId',
  CARDS: '/my-account/cards',
  FAVORITES: '/favorites',
  RECOMMENDED: '/recommended',
  HELP: '/help',
  NOT_FOUND: '*',
} as const;