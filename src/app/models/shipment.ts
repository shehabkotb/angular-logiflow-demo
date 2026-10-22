export type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Delayed';

export interface Shipment {
  id: number;
  trackingNo: string;
  destination: string;
  status: ShipmentStatus;
  /** Estimated arrival as an ISO date string, e.g. "2026-10-25" */
  eta: string;
}
