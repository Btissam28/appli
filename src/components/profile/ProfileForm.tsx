import React, { useState } from 'react';
import { User } from '../../types';
import { Mail, Phone, CreditCard, MapPin } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface ProfileFormProps {
  user: User;
  onUpdateProfile: (userData: Partial<User>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onUpdateProfile(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setErrors({});
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              {isEditing ? (
                <div>
                  <p className="text-sm text-gray-500">Profile Picture</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={true}
                  >
                    Upload New Photo
                  </Button>
                </div>
              ) : (
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              )}
            </div>
            
            {isEditing ? (
              <>
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  fullWidth
                />
                
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  fullWidth
                  icon={<Mail className="h-5 w-5" />}
                />
                
                <Input
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  fullWidth
                  icon={<Phone className="h-5 w-5" />}
                />
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
        
        <div className="space-y-3">
          {user.paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {method.type === 'credit' ? 'Credit Card' : method.type === 'debit' ? 'Debit Card' : 'PayPal'}
                  </p>
                  {method.lastFour && (
                    <p className="text-sm text-gray-500">
                      {method.type !== 'paypal' ? `•••• •••• •••• ${method.lastFour}` : 'Connected'}
                    </p>
                  )}
                </div>
              </div>
              
              {method.isDefault && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Default
                </span>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            fullWidth
            className="mt-2"
            disabled={true}
          >
            Add Payment Method
          </Button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Locations</h3>
        
        <div className="space-y-3">
          {user.favoriteLocations.map((location) => (
            <div key={location.id} className="flex items-start p-3 border border-gray-200 rounded-md">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{location.name}</p>
                <p className="text-sm text-gray-500">{location.address}</p>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            fullWidth
            className="mt-2"
            disabled={true}
          >
            Add Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;