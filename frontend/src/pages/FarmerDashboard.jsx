// frontend/src/pages/FarmerDashboard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FarmerDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="dashboard farmer-dashboard">
            <header>
                <h1>🌾 Farmer Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </header>
            
            <div className="welcome-message">
                <h2>Welcome {user.fullName}</h2>
                <p>Role: Farmer</p>
                <p>Farm: {user.farmName}</p>
                <p>Location: {user.farmLocation}</p>
                <p>Primary Crop: {user.primaryCropType}</p>
            </div>

            {/* Farmer specific placeholder features */}
            <div className="dashboard-cards">
                <div className="card">
                    <h3>🌱 My Products</h3>
                    <p>Manage your agricultural products</p>
                </div>
                <div className="card">
                    <h3>💰 Orders</h3>
                    <p>View buyer orders</p>
                </div>
                <div className="card">
                    <h3>📊 Sales Analytics</h3>
                    <p>Track your sales performance</p>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;