import  User  from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// ✅ REGISTRATION - No changes needed
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { 
            fullName, email, password, mobileNumber, 
            address, city, province, userRole,
            farmName, farmLocation, primaryCropType 
        } = req.body;
        // ✅ DEBUG - Check each field
        console.log('FullName:', fullName);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Mobile Number:', mobileNumber);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email already registered' 
            });
        }

        const userData = {
            fullName,
            email,
            password,
            mobileNumber,
            address,
            city,
            province,
            userRole
        };

        if (userRole === 'farmer') {
            userData.farmName = farmName;
            userData.farmLocation = farmLocation;
            userData.primaryCropType = primaryCropType;
        }

        if (userRole === 'admin') {
            userData.adminLevel = 'basic';
        }

        const user = new User(userData);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error during registration' 
        });
    }
};


// ✅ FIXED LOGIN - With Access & Refresh Tokens
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // ✅ Generate Access Token (short lived - 1 day)
        const accessToken = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.userRole 
            },
            process.env.ACCESS_TOKEN_SECRET,  // ✅ Use correct secret
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }  // ✅ 1d
        );

        // ✅ Generate Refresh Token (long lived - 10 days)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,  // ✅ Use correct secret
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }  // ✅ 10d
        );

        // ✅ Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Dashboard URL based on role
        let dashboardUrl = '';
        switch(user.userRole) {
            case 'admin':
                dashboardUrl = '/admin-dashboard';
                break;
            case 'farmer':
                dashboardUrl = '/farmer-dashboard';
                break;
            case 'buyer':
                dashboardUrl = '/buyer-dashboard';
                break;
        }

        // ✅ Return both tokens
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,    // ✅ Send access token
            refreshToken,   // ✅ Send refresh token
            user: user.toJSON(),
            dashboardUrl
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login' 
        });
    }
};

// ✅ NEW - Refresh Token Endpoint
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                message: 'Refresh token required' 
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find user with this refresh token
        const user = await User.findOne({ 
            _id: decoded.userId, 
            refreshToken: refreshToken 
        });

        if (!user) {
            return res.status(403).json({ 
                message: 'Invalid refresh token' 
            });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.userRole 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ 
            message: 'Invalid refresh token' 
        });
    }
};

// ✅ FIXED - Get Profile (using access token)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ FIXED - Update Profile (using access token)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;
        
        // Don't allow email or role change
        delete updateData.email;
        delete updateData.userRole;
        delete updateData.password;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toJSON()
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ NEW - Logout (clear refresh token)
export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndUpdate(userId, { 
            refreshToken: null 
        });
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};