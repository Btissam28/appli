import React from 'react';
import { Trip } from '../../types';
import { Calendar, Clock, MapPin, DollarSign, Star } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onRateTrip?: (tripId: string, rating: number) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onRateTrip }) => {
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format price
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  // Handle rating click
  const handleRating = (rating: number) => {
    if (onRateTrip && trip.status === 'completed') {
      onRateTrip(trip.id, rating);
    }
  };

  // Generate vehicle icon based on type
  const getVehicleIcon = () => {
    switch (trip.vehicleType) {
      case 'car':
        return '🚗';
      case 'scooter':
        return '🛴';
      case 'bike':
        return '🚲';
      default:
        return '🚗';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getVehicleIcon()}</span>
            <div>
              <h3 className="font-medium text-gray-900">{trip.vehicleModel}</h3>
              <p className="text-sm text-gray-500 capitalize">{trip.vehicleType}</p>
            </div>
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium uppercase text-gray-800">
            {trip.status}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-sm font-medium text-gray-800">{trip.startLocation.name}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="text-sm font-medium text-gray-800">{trip.endLocation.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <Calendar className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Date</span>
            <span className="text-sm font-medium text-gray-800">{formatDate(trip.startTime)}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <Clock className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Duration</span>
            <span className="text-sm font-medium text-gray-800">{trip.duration} min</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Cost</span>
            <span className="text-sm font-medium text-gray-800">${formatPrice(trip.cost)}</span>
          </div>
        </div>

        {trip.status === 'completed' && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Your Rating</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (trip.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } cursor-pointer`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;