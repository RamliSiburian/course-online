const enakUrl = process.env['ENAK_API_HOST']
const kadaUrl = process.env['KADA_API_HOST']

const DINE_IN_V1 = (path: string) => `${enakUrl}/api/v1/dine-in/${path}`
const ENAK_V1 = (path: string) => `${enakUrl}/api/v1/${path}`
const KADA_V1 = (path: string) => `${kadaUrl}/api/v1/${path}`

export const rest = {
  auths: {
    register: DINE_IN_V1('customer/register'),
    otpReq: DINE_IN_V1('customer/get-otp'),
    login: DINE_IN_V1('customer/login'),
    popular: DINE_IN_V1('user')
  },
  qrCode: DINE_IN_V1('qr-scan'),
  otp: {
    verify: KADA_V1('customer/login'),
    request: KADA_V1('customer/get-otp'),
    register: KADA_V1('customer/register')
  },
  carts: {
    main: DINE_IN_V1('carts'),
    sum: DINE_IN_V1('sumarize-cart'),
    shareRemain: DINE_IN_V1('cart-shared-time')
  },
  productCategories: {
    main: DINE_IN_V1('categories'),
    sub: DINE_IN_V1('sub-categories')
  },
  products: {
    findBySubCategory: DINE_IN_V1('products'),
    findSome: DINE_IN_V1('products/search'),
    waitingAvg: DINE_IN_V1('average-waiting'),
    popular: DINE_IN_V1('most-popular'),
    happyHour: DINE_IN_V1('happy-hour'),
    dataSearch: DINE_IN_V1('data-search')
  },
  utilities: {
    history: DINE_IN_V1('history'),
    historyDetail: DINE_IN_V1('history/details')
  },
  payment: {
    invoice: DINE_IN_V1('invoices'),
    method: DINE_IN_V1('payment-methods'),
    invoiceURL: ENAK_V1('histories/pay'),
    otpReq: DINE_IN_V1('customer/get-otp')
  }
}
