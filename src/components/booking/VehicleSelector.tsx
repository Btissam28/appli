import React from 'react';
import { VehicleType, Vehicle } from '../../types';
import VehicleCard from '../common/VehicleCard';
import { Car, Bike, NotebookIcon as Scooter } from 'lucide-react';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (vehicleId: string) => void;
  onFilterChange: (type: VehicleType | 'all') => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<VehicleType | 'all'>('all');

  const handleFilterChange = (type: VehicleType | 'all') => {
    setActiveFilter(type);
    onFilterChange(type);
  };

  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'car', label: 'Cars', icon: <Car className="w-4 h-4" /> },
    { id: 'scooter', label: 'Scooters', icon: <Scooter className="w-4 h-4" /> },
    { id: 'bike', label: 'Bikes', icon: <Bike className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-full flex items-center space-x-1 whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange(filter.id as VehicleType | 'all')}
          >
            {filter.icon && <span>{filter.icon}</span>}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => onVehicleSelect(vehicle.id)}
              isSelected={selectedVehicleId === vehicle.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No vehicles available for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;