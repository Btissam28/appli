import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import { Vehicle, VehicleType } from '../../types';
import { Car, Bike, NotebookIcon as Scooter } from 'lucide-react';

interface MapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect?: (vehicleId: string) => void;
  center?: { latitude: number; longitude: number };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  center = { latitude: 37.7749, longitude: -122.4194 }, // Default to San Francisco
  zoom = 13,
}) => {
  const [viewport, setViewport] = useState({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: zoom,
  });

  // Update viewport when center prop changes
  useEffect(() => {
    setViewport(prev => ({
      ...prev,
      latitude: center.latitude,
      longitude: center.longitude,
    }));
  }, [center]);

  // Vehicle icon based on type
  const getVehicleIcon = (type: VehicleType, isSelected: boolean) => {
    const size = isSelected ? 30 : 24;
    const color = isSelected ? '#3B82F6' : '#64748B';
    
    switch (type) {
      case 'car':
        return <Car size={size} color={color} />;
      case 'bike':
        return <Bike size={size} color={color} />;
      case 'scooter':
        return <Scooter size={size} color={color} />;
      default:
        return <Car size={size} color={color} />;
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
        onViewportChange={setViewport}
      >
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            latitude={vehicle.latitude}
            longitude={vehicle.longitude}
            offsetLeft={-12}
            offsetTop={-12}
          >
            <div 
              onClick={() => onVehicleSelect && onVehicleSelect(vehicle.id)}
              className={`cursor-pointer transform transition-transform duration-300 ${
                selectedVehicleId === vehicle.id ? 'scale-125' : 'hover:scale-110'
              }`}
            >
              {getVehicleIcon(vehicle.type, selectedVehicleId === vehicle.id)}
            </div>
          </Marker>
        ))}
        
        <div className="absolute top-4 right-4">
          <NavigationControl showCompass={false} />
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;