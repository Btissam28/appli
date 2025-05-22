import React from 'react';
import { Vehicle } from '../../types';
import { Battery, Navigation } from 'lucide-react';
import Button from './Button';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
  isSelected?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onClick, 
  isSelected = false 
}) => {
  // Helper function to format the price to 2 decimal places
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  // Helper function to determine battery color
  const getBatteryColor = (level: number): string => {
    if (level >= 70) return 'text-green-500';
    if (level >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={vehicle.imageUrl} 
          alt={vehicle.model} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded-bl-lg">
          {vehicle.type.toUpperCase()}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{vehicle.model}</h3>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Battery className={`w-4 h-4 mr-1 ${getBatteryColor(vehicle.batteryLevel)}`} />
            <span className="text-sm">{vehicle.batteryLevel}%</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Navigation className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-sm">{vehicle.range} km</span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-gray-800">
            <span className="font-bold text-lg">${formatPrice(vehicle.pricePerMinute)}</span>
            <span className="text-xs text-gray-500">/min</span>
          </div>
          
          <Button 
            variant="primary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;