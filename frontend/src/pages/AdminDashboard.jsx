// frontend/src/pages/AdminDashboard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="dashboard admin-dashboard">
            <header>
                <h1>👑 Admin Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </header>
            
            <div className="welcome-message">
                <h2>Welcome {user.fullName}</h2>
                <p>Role: Admin</p>
                <p>Admin Level: {user.adminLevel || 'basic'}</p>
            </div>

            {/* Admin specific placeholder features */}
            <div className="dashboard-cards">
                <div className="card">
                    <h3>📊 Manage Users</h3>
                    <p>View all farmers and buyers</p>
                </div>
                <div className="card">
                    <h3>📈 System Analytics</h3>
                    <p>View platform statistics</p>
                </div>
                <div className="card">
                    <h3>⚙️ System Settings</h3>
                    <p>Configure platform settings</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;