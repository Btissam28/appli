import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useTrips } from '../context/TripContext';
import BookingDetails from '../components/booking/BookingDetails';
import Map from '../components/common/Map';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, selectedVehicle, bookingDetails, clearBooking } = useVehicles();
  const { addTrip } = useTrips();
  
  const [isBookingComplete, setIsBookingComplete] = React.useState(false);
  
  // Redirect if no booking details
  useEffect(() => {
    if (!bookingDetails || !selectedVehicle) {
      navigate('/');
    }
  }, [bookingDetails, selectedVehicle, navigate]);
  
  const handleConfirmBooking = () => {
    if (bookingDetails) {
      // Add the trip to history
      addTrip(bookingDetails);
      
      // Show success screen
      setIsBookingComplete(true);
    }
  };
  
  const handleCancel = () => {
    clearBooking();
    navigate('/');
  };
  
  const handleBackToHome = () => {
    clearBooking();
    navigate('/');
  };
  
  // If we don't have booking details or selected vehicle, don't render anything
  // (useEffect will redirect)
  if (!bookingDetails || !selectedVehicle) {
    return null;
  }
  
  // Show success screen after booking is confirmed
  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-2 text-base text-gray-500">
              Your {selectedVehicle.type} is on the way. Please proceed to the pickup location.
            </p>
            
            <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Trip Details</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Plate</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedVehicle.licensePlate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pickup</p>
                    <p className="mt-1 text-sm text-gray-900">{bookingDetails.startLocation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Destination</p>
                    <p className="mt-1 text-sm text-gray-900">{bookingDetails.endLocation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                    <p className="mt-1 text-sm text-gray-900">{bookingDetails.estimatedDuration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Cost</p>
                    <p className="mt-1 text-sm text-gray-900">${bookingDetails.estimatedCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to map
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Booking details */}
          <div className="lg:col-span-1">
            <BookingDetails
              bookingDetails={bookingDetails}
              vehicle={selectedVehicle}
              onConfirmBooking={handleConfirmBooking}
              onCancel={handleCancel}
            />
          </div>
          
          {/* Right column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 h-[600px]">
              <Map
                vehicles={vehicles.filter(v => v.id === selectedVehicle.id)}
                selectedVehicleId={selectedVehicle.id}
                center={{ 
                  latitude: selectedVehicle.latitude, 
                  longitude: selectedVehicle.longitude 
                }}
                zoom={15}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;