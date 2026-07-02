export enum AppEvents {
  CREATE_WALLET = 'wallet.create',
  NEW_ORDER_CREATED = 'new.order.created',
  ORDER_PAYMENT_PROCESSED = 'order.payment.processed',
  RETURN_REQUEST_SUBMITTED = 'return.request.submitted',
}

export enum UserEvents {
  SEND_OTP_EMAIL = 'send.otp.email',
  SEND_WARRANTY_EMAIL = 'send.warranty.email',
  SEND_WELCOME_MAIL = 'send.welcome.email',
  SEND_PASSWORD_RESET_MAIL = 'send.password.reset.email',
  SEND_ORDER_CREATED = 'send.order.created.email',
  SEND_ORDER_INVOICE = 'send.order.invoice.email',
  SEND_RETURN_REQUEST_OUTCOME_MAIL = 'send.return.request.outcome',
}
