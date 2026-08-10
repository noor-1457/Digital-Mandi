import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    province: {
        type: String,
        required: [true, 'Province is required']
    },
    
    userRole: {
        type: String,
        enum: ['admin', 'farmer', 'buyer'],
        required: true,
        default: 'buyer'
    },
    
    // Farmer-specific fields
    farmName: {
        type: String,
        required: function() {
            return this.userRole === 'farmer';
        }
    },
    farmLocation: {
        type: String,
        required: function() {
            return this.userRole === 'farmer';
        }
    },
    primaryCropType: {
        type: String,
        required: function() {
            return this.userRole === 'farmer';
        }
    },
    
    // Admin-specific fields
    adminLevel: {
        type: String,
        enum: ['basic', 'super', 'owner'],
        default: 'basic'
    },
    
    registrationDate: {
        type: Date,
        default: Date.now
    },

    // ✅ ADD THIS - Refresh Token Field
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;  // ✅ Also remove refresh token
    return obj;
};

export default mongoose.model('User', userSchema);