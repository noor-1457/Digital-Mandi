// frontend/src/pages/Register.js (Updated with 3 roles)
const Register = () => {
    const [selectedRole, setSelectedRole] = useState('buyer');
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '',
        mobileNumber: '', address: '', city: '', province: '',
        userRole: 'buyer',
        // Farmer fields
        farmName: '', farmLocation: '', primaryCropType: '',
        // Admin fields (if any)
        adminLevel: 'basic'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate...
        // Register...
        // Then redirect to login
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            
            {/* Common fields */}
            <input placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            {/* ... other common fields */}
            
            {/* 👇 3 Role Options */}
            <div className="role-selection">
                <label>
                    <input 
                        type="radio" 
                        value="buyer"
                        checked={selectedRole === 'buyer'}
                        onChange={(e) => setSelectedRole('buyer')}
                    />
                    Buyer
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="farmer"
                        checked={selectedRole === 'farmer'}
                        onChange={(e) => setSelectedRole('farmer')}
                    />
                    Farmer
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="admin"
                        checked={selectedRole === 'admin'}
                        onChange={(e) => setSelectedRole('admin')}
                    />
                    Admin
                </label>
            </div>

            {/* Farmer-specific fields */}
            {selectedRole === 'farmer' && (
                <div className="farmer-fields">
                    <h3>Farm Information</h3>
                    <input placeholder="Farm Name" required />
                    <input placeholder="Farm Location" required />
                    <input placeholder="Primary Crop Type" required />
                </div>
            )}

            {/* Admin fields (if needed) */}
            {selectedRole === 'admin' && (
                <div className="admin-fields">
                    <h3>Admin Information</h3>
                    <input placeholder="Admin Level" value="basic" disabled />
                    <p>Admin access requires verification</p>
                </div>
            )}

            <button type="submit">Register</button>
        </form>
    );
};