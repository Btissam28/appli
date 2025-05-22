import React from 'react';
import { BookingDetails as BookingDetailsType, Vehicle } from '../../types';
import { Clock, Navigation, DollarSign, Calendar } from 'lucide-react';
import Button from '../common/Button';

interface BookingDetailsProps {
  bookingDetails: BookingDetailsType;
  vehicle: Vehicle;
  onConfirmBooking: () => void;
  onCancel: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  bookingDetails,
  vehicle,
  onConfirmBooking,
  onCancel,
}) => {
  // Format duration for display (convert minutes to hours and minutes)
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format price to 2 decimal places
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center mr-4">
            <img 
              src={vehicle.imageUrl} 
              alt={vehicle.model} 
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">{vehicle.model}</p>
            <p className="text-sm text-gray-500 capitalize">{vehicle.type}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                <span>Today</span>
              </div>
              <span className="text-gray-800">ASAP</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-600">
                <Navigation className="w-5 h-5 mr-2 text-blue-500" />
                <span>Distance</span>
              </div>
              <span className="text-gray-800">{bookingDetails.estimatedDistance} km</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                <span>Estimated Time</span>
              </div>
              <span className="text-gray-800">{formatDuration(bookingDetails.estimatedDuration)}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              <span>Estimated Cost</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">${formatPrice(bookingDetails.estimatedCost)}</span>
          </div>
          
          <div className="mt-1 text-xs text-gray-500">
            <p>Base fare: ${formatPrice(vehicle.type === 'car' ? 5 : vehicle.type === 'scooter' ? 2 : 1)}</p>
            <p>Distance: {bookingDetails.estimatedDistance} km × ${formatPrice(vehicle.pricePerKm)}/km</p>
            <p>Time: {bookingDetails.estimatedDuration} min × ${formatPrice(vehicle.pricePerMinute)}/min</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            fullWidth
            onClick={onConfirmBooking}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;