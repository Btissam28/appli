import React, { createContext, useState, useContext, useEffect } from 'react';
import { Trip, BookingDetails } from '../types';
import tripsData from '../data/trips.json';
import { useAuth } from './AuthContext';

interface TripContextType {
  userTrips: Trip[];
  addTrip: (bookingDetails: BookingDetails) => void;
  rateTrip: (tripId: string, rating: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const { user } = useAuth();

  // Load trips and filter by user
  useEffect(() => {
    setTrips(tripsData.trips);
  }, []);

  useEffect(() => {
    if (user) {
      setUserTrips(trips.filter(trip => trip.userId === user.id));
    } else {
      setUserTrips([]);
    }
  }, [user, trips]);

  const addTrip = (bookingDetails: BookingDetails) => {
    if (!user || !bookingDetails) return;

    const now = new Date();
    const endTime = new Date(now.getTime() + bookingDetails.estimatedDuration * 60000);

    const newTrip: Trip = {
      id: `trip-${trips.length + 1}`,
      userId: user.id,
      vehicleId: bookingDetails.vehicleId,
      vehicleType: 'car', // This would come from the selected vehicle in a real app
      vehicleModel: 'Sample Vehicle', // This would come from the selected vehicle in a real app
      startLocation: bookingDetails.startLocation,
      endLocation: bookingDetails.endLocation,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      duration: bookingDetails.estimatedDuration,
      distance: bookingDetails.estimatedDistance,
      cost: bookingDetails.estimatedCost,
      status: 'completed'
    };

    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const rateTrip = (tripId: string, rating: number) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? { ...trip, rating } : trip
      )
    );
  };

  return (
    <TripContext.Provider value={{
      userTrips,
      addTrip,
      rateTrip
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};