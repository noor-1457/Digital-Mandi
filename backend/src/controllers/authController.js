import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// REGISTRATION

export const register = async (req, res) => {
    try {
        // Validate request data
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            fullName,
            email,
            password,
            mobileNumber,
            address,
            city,
            province,
            userRole,
            farmName,
            farmLocation,
            primaryCropType
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Common user data
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

        // Add farmer-specific information
        if (userRole === "farmer") {
            userData.farmName = farmName;
            userData.farmLocation = farmLocation;
            userData.primaryCropType = primaryCropType;
        }

        // Admin-specific information
        if (userRole === "admin") {
            userData.adminLevel = "basic";
        }

        // Create user
        const user = new User(userData);

        // Password will be hashed by User model pre-save middleware
        await user.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: user.toJSON()
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// NORMAL LOGIN
// Farmer / Buyer / Admin

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ACCESS TOKEN

        const accessToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.userRole
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );

        // REFRESH TOKEN

        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        );

        // Save refresh token in database
        user.refreshToken = refreshToken;

        await user.save();

        // DASHBOARD BASED ON ROLE

        let dashboardUrl = "";

        switch (user.userRole) {
            case "admin":
                dashboardUrl = "/admin-dashboard";
                break;

            case "farmer":
                dashboardUrl = "/farmer-dashboard";
                break;

            case "buyer":
                dashboardUrl = "/buyer-dashboard";
                break;

            default:
                dashboardUrl = "/";
        }

        // RESPONSE

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: user.toJSON(),
            dashboardUrl
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ADMIN LOGIN

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Make sure account belongs to admin
        if (user.userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        // Compare entered password with hashed password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // ADMIN ACCESS TOKEN

        const accessToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.userRole
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );

        // ADMIN REFRESH TOKEN

        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        );

        // Save refresh token
        user.refreshToken = refreshToken;

        await user.save();

        // ADMIN RESPONSE

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            accessToken,
            refreshToken,
            user: user.toJSON(),
            dashboardUrl: "/admin-dashboard"
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during admin login"
        });
    }
};


// REFRESH ACCESS TOKEN

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Check refresh token
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user with matching refresh token
        const user = await User.findOne({
            _id: decoded.userId,
            refreshToken: refreshToken
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
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
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(403).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
};


// GET PROFILE

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: user.toJSON()
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE PROFILE

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const updateData = {
            ...req.body
        };

        // Email cannot be changed
        delete updateData.email;

        // Role cannot be changed
        delete updateData.userRole;

        // Password cannot be changed from this endpoint
        delete updateData.password;

        // Find and update user
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: user.toJSON()
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// LOGOUT

export const logout = async (req, res) => {
    try {
        const userId = req.user._id;

        // Remove refresh token
        await User.findByIdAndUpdate(
            userId,
            {
                refreshToken: null
            }
        );

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};