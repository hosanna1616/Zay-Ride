/**
 * Domain types for ZayRide Trader Companion.
 *
 * BACKEND INTEGRATION (Supabase / ZayRide API / Prisma):
 * - Map these shapes to your DB rows and REST/GraphQL responses.
 * - Add `remoteId`, `syncedAt`, `userId` fields when wiring auth + multi-device sync.
 */

export type TransactionType = "sale" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Amount in Ethiopian Birr (ብር) */
  amount: number;
  product?: string;
  customerName?: string;
  note?: string;
  createdAt: string;
  deliveryRequested?: boolean;
  /** Links to Delivery.id when a rider job was created from this sale */
  deliveryId?: string;
}

export interface Debt {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  note?: string;
  createdAt: string;
}

export type DeliveryStatus =
  | "searching"
  | "assigned"
  | "picked_up"
  | "delivered";

export interface DeliveryDriver {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
}

export interface Delivery {
  id: string;
  transactionId?: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: DeliveryStatus;
  driver?: DeliveryDriver;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProfile {
  name: string;
  pickupAddress: string;
  phone: string;
}
