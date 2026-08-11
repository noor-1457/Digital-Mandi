import express from 'express';
import { 
    register, 
    login, 
    refreshToken, 
    getProfile, 
    updateProfile,
    logout 
} from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/user.middleware.js';

const router = express.Router();


// PUBLIC ROUTES (No authentication needed)


// Register - Create new account
router.post('/register', register);

// Login - Get access & refresh tokens
router.post('/login', login);

// Refresh Token - Get new access token
router.post('/refresh-token', refreshToken);


// PROTECTED ROUTES (Need access token)


// Get Profile - View user details
router.get('/profile', verifyJWT, getProfile);

// Update Profile - Edit user details
router.put('/profile', verifyJWT, updateProfile);

// Logout - Clear refresh token
router.post('/logout', verifyJWT, logout);

export default router;