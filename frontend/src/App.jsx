// frontend/src/App.js
// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Profile from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Role-Based Protected Routes */}
                    <Route 
                        path="/admin-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/farmer-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['farmer']}>
                                <FarmerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/buyer-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['buyer']}>
                                <BuyerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;