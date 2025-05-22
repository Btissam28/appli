import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, isAuthenticated } = useAuth();
  
  // If not authenticated, show a message
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to view your profile</h2>
          <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        
        <div className="space-y-6">
          <ProfileForm 
            user={user} 
            onUpdateProfile={updateUserProfile} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;