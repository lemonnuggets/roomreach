export enum DELIVERY_STATUS {
  PENDING = 0,
  REQUESTED = 1,
  ACCEPTED = 2,
  PICKED_UP = 3,
  DELIVERED = 4,
}
export const DELIVERY_STATUS_MAPPED = [
  "PENDING",
  "REQUESTED",
  "ACCEPTED",
  "PICKED UP",
  "DELIVERED",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUS_MAPPED)[number];
