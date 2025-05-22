import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { VehicleType, Location } from '../types';
import Map from '../components/common/Map';
import VehicleSelector from '../components/booking/VehicleSelector';
import LocationSearch from '../components/common/LocationSearch';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    vehicles, 
    filteredVehicles, 
    selectedVehicle, 
    filterVehiclesByType,
    selectVehicle,
    createBooking,
  } = useVehicles();
  
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState({ latitude: 37.7749, longitude: -122.4194 });
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  
  // Set default start location from user's saved locations if available
  useEffect(() => {
    if (user && user.favoriteLocations.length > 0) {
      const homeLocation = user.favoriteLocations.find(loc => loc.type === 'home');
      if (homeLocation) {
        setStartLocation(homeLocation);
      } else {
        setStartLocation(user.favoriteLocations[0]);
      }
    }
  }, [user]);
  
  const handleStartLocationSelect = (location: Location) => {
    setStartLocation(location);
    setMapCenter({ latitude: location.latitude, longitude: location.longitude });
  };
  
  const handleEndLocationSelect = (location: Location) => {
    setEndLocation(location);
  };
  
  const handleVehicleSelect = (vehicleId: string) => {
    selectVehicle(vehicleId);
  };
  
  const handleContinue = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!startLocation || !endLocation) {
      // Show error or message about missing locations
      return;
    }
    
    if (!selectedVehicle) {
      setShowVehicleSelector(true);
      return;
    }
    
    // Create booking and navigate to booking page
    createBooking(startLocation, endLocation);
    navigate('/booking');
  };
  
  const handleFilterChange = (type: VehicleType | 'all') => {
    filterVehiclesByType(type);
  };
  
  // Determine if the user can continue to booking
  const canContinue = startLocation !== null && endLocation !== null;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Find a Ride</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <LocationSearch
                    label="Enter pickup location"
                    onSelect={handleStartLocationSelect}
                    initialValue={startLocation?.name || ''}
                    savedLocations={user?.favoriteLocations || []}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <LocationSearch
                    label="Enter destination"
                    onSelect={handleEndLocationSelect}
                    initialValue={endLocation?.name || ''}
                    savedLocations={user?.favoriteLocations || []}
                  />
                </div>
                
                {canContinue && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleContinue}
                  >
                    {selectedVehicle ? 'Continue to Booking' : 'Find Vehicles'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Vehicle Selection Panel - Only shown after locations are selected */}
            {showVehicleSelector && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Vehicle</h2>
                <VehicleSelector
                  vehicles={filteredVehicles}
                  selectedVehicleId={selectedVehicle?.id || null}
                  onVehicleSelect={handleVehicleSelect}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>
          
          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 h-[600px]">
              <Map
                vehicles={vehicles}
                selectedVehicleId={selectedVehicle?.id}
                onVehicleSelect={handleVehicleSelect}
                center={mapCenter}
              />
            </div>
            
            {/* Quick Stats or Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Vehicles</p>
                  <p className="text-xl font-semibold text-gray-800">{vehicles.length}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Navigation className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coverage Area</p>
                  <p className="text-xl font-semibold text-gray-800">15 mi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Wait Time</p>
                  <p className="text-xl font-semibold text-gray-800">3 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;