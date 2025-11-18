export interface ParkingSpot {
  id?: number;
  number: string;
  status: 'free' | 'occupied';
  vehicleId?: number;
}
