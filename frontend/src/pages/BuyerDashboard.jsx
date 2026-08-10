// frontend/src/pages/BuyerDashboard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BuyerDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="dashboard buyer-dashboard">
            <header>
                <h1>🛍️ Buyer Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </header>
            
            <div className="welcome-message">
                <h2>Welcome {user.fullName}</h2>
                <p>Role: Buyer</p>
            </div>

            {/* Buyer specific placeholder features */}
            <div className="dashboard-cards">
                <div className="card">
                    <h3>🛒 Browse Products</h3>
                    <p>Explore farm products</p>
                </div>
                <div className="card">
                    <h3>📋 My Orders</h3>
                    <p>View your purchase history</p>
                </div>
                <div className="card">
                    <h3>💬 Messages</h3>
                    <p>Communicate with farmers</p>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;