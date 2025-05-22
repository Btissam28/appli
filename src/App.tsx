import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <VehicleProvider>
          <TripProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </TripProvider>
        </VehicleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;