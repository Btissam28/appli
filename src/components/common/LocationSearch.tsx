import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '../../types';

interface LocationSearchProps {
  label: string;
  onSelect: (location: Location) => void;
  initialValue?: string;
  savedLocations?: Location[];
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  onSelect,
  initialValue = '',
  savedLocations = [],
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock locations for search results
  const mockLocations: Location[] = [
    {
      id: 'search-1',
      name: 'Central Park',
      address: '14 E 60th St, New York, NY 10022',
      latitude: 40.7812,
      longitude: -73.9665,
      type: 'recent'
    },
    {
      id: 'search-2',
      name: 'Empire State Building',
      address: '20 W 34th St, New York, NY 10001',
      latitude: 40.7484,
      longitude: -73.9857,
      type: 'recent'
    },
    {
      id: 'search-3',
      name: 'Times Square',
      address: 'Manhattan, NY 10036',
      latitude: 40.7580,
      longitude: -73.9855,
      type: 'recent'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSearchValue(location.name);
    setShowDropdown(false);
    onSelect(location);
  };

  // For demo purposes, we'll show the mock locations regardless of search term
  const filteredLocations = searchValue.length > 2
    ? [...savedLocations, ...mockLocations]
    : [];

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={label}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          onFocus={() => searchValue.length > 2 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      
      {showDropdown && filteredLocations.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {savedLocations.length > 0 && (
              <li className="px-3 py-2 text-xs font-semibold text-gray-500">Saved Locations</li>
            )}
            
            {savedLocations.map((location) => (
              <li 
                key={location.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{location.name}</p>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                </div>
              </li>
            ))}
            
            {searchValue.length > 2 && (
              <li className="px-3 py-2 text-xs font-semibold text-gray-500">Search Results</li>
            )}
            
            {searchValue.length > 2 && mockLocations.map((location) => (
              <li 
                key={location.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{location.name}</p>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;