export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PENDING_ESCROW = 'PENDING_ESCROW',
  IN_ESCROW = 'IN_ESCROW',
  RELEASING = 'RELEASING',
  DISPUTED = 'DISPUTED',
}

export enum TransactionMode {
  POS = 'POS',
  ONLINE = 'ONLINE',
}

export enum TransactionType {
  // Customer funding their wallet
  EXTERNAL_DEPOSIT = 'EXTERNAL_DEPOSIT', // From payment gateway to customer wallet

  // Order and escrow process
  PAYMENT = 'PAYMENT', // Regular direct payment for order (balance is not affected)
  ESCROW = 'ESCROW', // Customer to platform escrow
  ESCROW_RELEASE = 'ESCROW_RELEASE', // Platform escrow to merchant

  // Refunds and disputes
  REFUND = 'REFUND', // Merchant to customer
  ESCROW_REFUND = 'ESCROW_REFUND', // Platform escrow to customer

  // Merchant withdrawals
  WITHDRAWAL_REQUEST = 'WITHDRAWAL_REQUEST',
  WITHDRAWAL_PROCESSING = 'WITHDRAWAL_PROCESSING',
  WITHDRAWAL_COMPLETED = 'WITHDRAWAL_COMPLETED',
  WITHDRAWAL_FAILED = 'WITHDRAWAL_FAILED',

  // System transactions
  FEE_COLLECTION = 'FEE_COLLECTION', // Platform fee collection
  ADJUSTMENT = 'ADJUSTMENT', // Manual adjustment by admin
}

export enum SystemWalletType {
  PLATFORM_ESCROW = 'PLATFORM_ESCROW',
  PLATFORM_FEE = 'PLATFORM_FEE',
  OPERATING = 'OPERATING',
}
