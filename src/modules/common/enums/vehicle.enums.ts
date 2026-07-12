export enum VehicleStatus {
  // Core statuses
  AVAILABLE = 'AVAILABLE', // Ready for hire
  RESERVED = 'RESERVED', // Booked but not yet handed over
  ON_HIRE = 'ON_HIRE', // Actively rented to a driver
  IN_TRANSIT = 'IN_TRANSIT', // Being moved between locations (e.g., after return)

  // Maintenance & Repairs
  MAINTENANCE = 'MAINTENANCE', // Undergoing routine servicing
  SCHEDULED_MAINTENANCE = 'SCHEDULED_MAINTENANCE', // Planned maintenance (e.g., oil change)
  AWAITING_PARTS = 'AWAITING_PARTS', // Repair delayed due to missing parts
  REPAIR_IN_PROGRESS = 'REPAIR_IN_PROGRESS', // Actively being repaired

  // Post-Hire Checks
  CLEANING_NEEDED = 'CLEANING_NEEDED', // Requires cleaning after return
  INSPECTION_NEEDED = 'INSPECTION_NEEDED', // Post-return safety check

  // Administrative
  OUT_OF_SERVICE = 'OUT_OF_SERVICE', // Temporarily unavailable (non-mechanical reasons)
  DECOMMISSIONED = 'DECOMMISSIONED', // Permanently retired (e.g., sold, scrapped)
  ADMIN_HOLD = 'ADMIN_HOLD', // Held for administrative reasons (e.g., paperwork)

  // Damage & Incidents
  ACCIDENT_DAMAGE = 'ACCIDENT_DAMAGE', // Damaged in an accident (needs assessment)
  STOLEN = 'STOLEN', // Reported stolen
}
