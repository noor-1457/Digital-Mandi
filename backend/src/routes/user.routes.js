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

// ============================================
// PUBLIC ROUTES (No authentication needed)
// ============================================

// 1️⃣ Register - Create new account
router.post('/register', register);

// 2️⃣ Login - Get access & refresh tokens
router.post('/login', login);

// 3️⃣ Refresh Token - Get new access token
router.post('/refresh-token', refreshToken);


// ============================================
// PROTECTED ROUTES (Need access token)
// ============================================

// 4️⃣ Get Profile - View user details
router.get('/profile', verifyJWT, getProfile);

// 5️⃣ Update Profile - Edit user details
router.put('/profile', verifyJWT, updateProfile);

// 6️⃣ Logout - Clear refresh token
router.post('/logout', verifyJWT, logout);

export default router;