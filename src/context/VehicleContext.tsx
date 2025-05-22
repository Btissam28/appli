import React, { createContext, useState, useContext, useEffect } from 'react';
import { Vehicle, VehicleType, BookingDetails, Location } from '../types';
import vehiclesData from '../data/vehicles.json';

interface VehicleContextType {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  bookingDetails: BookingDetails | null;
  filterVehiclesByType: (type: VehicleType | 'all') => void;
  selectVehicle: (vehicleId: string) => void;
  createBooking: (startLocation: Location, endLocation: Location) => void;
  clearBooking: () => void;
  calculateEstimatedCost: (distance: number, duration: number, vehicle: Vehicle) => number;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Load vehicles on mount
  useEffect(() => {
    setVehicles(vehiclesData.vehicles);
    setFilteredVehicles(vehiclesData.vehicles);
  }, []);

  const filterVehiclesByType = (type: VehicleType | 'all') => {
    if (type === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter(v => v.type === type));
    }
  };

  const selectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId) || null;
    setSelectedVehicle(vehicle);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  // Estimate duration based on distance and vehicle type
  const estimateDuration = (distance: number, vehicleType: VehicleType): number => {
    // Average speeds: car: 30km/h, scooter: 15km/h, bike: 12km/h
    const speeds: Record<VehicleType, number> = {
      car: 30,
      scooter: 15,
      bike: 12
    };
    
    // Convert to minutes
    return Math.ceil((distance / speeds[vehicleType]) * 60);
  };

  const calculateEstimatedCost = (distance: number, duration: number, vehicle: Vehicle): number => {
    const distanceCost = distance * vehicle.pricePerKm;
    const timeCost = duration * vehicle.pricePerMinute;
    
    // Add base fare based on vehicle type
    const baseFare = vehicle.type === 'car' ? 5 : (vehicle.type === 'scooter' ? 2 : 1);
    
    return Number((baseFare + distanceCost + timeCost).toFixed(2));
  };

  const createBooking = (startLocation: Location, endLocation: Location) => {
    if (!selectedVehicle) return;
    
    const distance = calculateDistance(
      startLocation.latitude, 
      startLocation.longitude, 
      endLocation.latitude, 
      endLocation.longitude
    );
    
    const duration = estimateDuration(distance, selectedVehicle.type);
    const cost = calculateEstimatedCost(distance, duration, selectedVehicle);
    
    setBookingDetails({
      vehicleId: selectedVehicle.id,
      startLocation,
      endLocation,
      estimatedDistance: Number(distance.toFixed(2)),
      estimatedDuration: duration,
      estimatedCost: cost
    });
  };

  const clearBooking = () => {
    setBookingDetails(null);
    setSelectedVehicle(null);
  };

  return (
    <VehicleContext.Provider value={{
      vehicles,
      filteredVehicles,
      selectedVehicle,
      bookingDetails,
      filterVehiclesByType,
      selectVehicle,
      createBooking,
      clearBooking,
      calculateEstimatedCost
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};