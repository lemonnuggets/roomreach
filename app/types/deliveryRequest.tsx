export type CustomerDeliveryRequestsListItem = {
  id: number;
  status: number;
  pickupLocation: string;
  deliveryInstructions: string;
  delivererId: number | null;
};

export type AvailableDeliveryRequestsListItem = {
  id: number;
  pickupLocation: string;
  block: string;
};

export type DelivererDeliveryRequestsListItem = {
  id: number;
  status: number;
  pickupLocation: string;
};
