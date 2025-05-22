export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  paymentMethods: PaymentMethod[];
  favoriteLocations: Location[];
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'favorite' | 'recent';
}

export type VehicleType = 'car' | 'scooter' | 'bike';

export interface Vehicle {
  id: string;
  type: VehicleType;
  model: string;
  licensePlate?: string;
  pricePerMinute: number;
  pricePerKm: number;
  batteryLevel: number;
  range: number;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  imageUrl: string;
}

export interface Trip {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  startLocation: Location;
  endLocation: Location;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  distance: number; // in km
  cost: number;
  status: 'completed' | 'cancelled' | 'in-progress';
  rating?: number;
}

export interface BookingDetails {
  vehicleId: string;
  startLocation: Location;
  endLocation: Location;
  estimatedDuration: number;
  estimatedDistance: number;
  estimatedCost: number;
}