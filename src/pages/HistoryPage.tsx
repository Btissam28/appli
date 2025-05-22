import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/history/TripCard';
import { Search, Calendar, Filter } from 'lucide-react';
import Button from '../components/common/Button';

const HistoryPage: React.FC = () => {
  const { userTrips, rateTrip } = useTrips();
  const { isAuthenticated } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'cancelled'>('all');
  
  // If not authenticated, show a message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to view your trip history</h2>
          <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }
  
  // Filter trips based on search term and status filter
  const filteredTrips = userTrips.filter(trip => {
    const matchesSearch = 
      searchTerm === '' ||
      trip.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.startLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.endLocation.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filter === 'all' || trip.status === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Group trips by date
  const groupedTrips: Record<string, typeof userTrips> = {};
  
  filteredTrips.forEach(trip => {
    const dateKey = formatDate(trip.startTime);
    if (!groupedTrips[dateKey]) {
      groupedTrips[dateKey] = [];
    }
    groupedTrips[dateKey].push(trip);
  });
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTrips).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Trip History</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by vehicle or location"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              
              <Button
                variant={filter === 'completed' ? 'primary' : 'outline'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              
              <Button
                variant={filter === 'in-progress' ? 'primary' : 'outline'}
                onClick={() => setFilter('in-progress')}
              >
                In Progress
              </Button>
            </div>
          </div>
        </div>
        
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No trips found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter to see more results.'
                : 'You haven\'t taken any trips yet. Book a ride to get started!'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">{date}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTrips[date].map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip}
                      onRateTrip={rateTrip}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;