export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  ADMINISTRATOR = 'admin',
}

export enum UserStatus {
  PENDING = 'pending', // When a courier has applied but is not yet approved
  APPROVED = 'approved', // When a courier's application is accepted
  REJECTED = 'rejected', // If the application is denied
  INACTIVE = 'inactive', // If a courier decides not to renew or is deactivated
  ACTIVE = 'active', // Regular active status for all users, including couriers
  BANNED = 'banned', // Regular active status for all users, including couriers
}
