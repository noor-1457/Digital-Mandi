// ============================================
// IMPORTS
// ============================================
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE (ORDER MATTERS!)
// ============================================

// 1️⃣ CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// 2️⃣ ✅ Body Parser - MUST be before routes
app.use(express.json({ limit: '16kb' }));        // Parse JSON
app.use(express.urlencoded({ extended: true, limit: '16kb' }));  // Parse URL encoded

// 3️⃣ Cookie Parser
app.use(cookieParser());

// ============================================
// ROUTES (AFTER middleware)
// ============================================

// Auth routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running'
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found' 
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

export { app };