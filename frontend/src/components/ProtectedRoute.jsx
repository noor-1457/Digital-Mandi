// frontend/src/components/ProtectedRoute.js
import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        // Redirect to appropriate dashboard based on role
        const dashboardMap = {
            admin: '/admin-dashboard',
            farmer: '/farmer-dashboard',
            buyer: '/buyer-dashboard'
        };
        return <Navigate to={dashboardMap[user.userRole] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;