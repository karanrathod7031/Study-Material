// 1. Environment variables load karein
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();     

// --- 🛡️ SECURITY & BASE MIDDLEWARES ---

app.use(helmet({
    contentSecurityPolicy: false, 
}));

// 2. CORS (Fixed & Verified Syntax ✅)
const allowedOrigins = [
    'https://study-material-iota.vercel.app', 
    'http://localhost:5173', 
    'http://localhost:3000', 
    /\.vercel\.app$/
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors()); // Pre-flight handler

// 3. Body Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200 
});
app.use('/api/', limiter);

// --- 🛣️ ROUTE DEFINITIONS ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/drive', require('./routes/driveRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/assets', require('./routes/assetRoutes')); 

// --- 🏠 BASE ROUTE ---
app.get('/', (req, res) => {
    res.send('EduDrive API for Lifestyle Fashion Store is running smoothly... 🚀');
});

// --- 🔌 DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected: Cloud Database Ready'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 🚀 SERVER START ---
const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
