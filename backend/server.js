// 1. Sabse pehle environment variables load karein
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes');

const app = express(); 

// --- 🛡️ SECURITY & BASE MIDDLEWARES ---

// 1. Helmet (Security headers) - Content Security Policy ko thoda relax kiya file uploads ke liye
app.use(helmet({
    contentSecurityPolicy: false, 
}));

// 2. CORS (Sabse upar hona chahiye routes se pehle) ✅
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173","https://study-material-7e5r0x0ks-karanrathod7031s-projects.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Body Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. Rate Limiter (Sirf production ke liye ya relaxed development ke liye)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200 // Development mein isey thoda badha diya taaki bar-bar block na ho
});
app.use('/api/', limiter);

// --- 🛣️ ROUTE DEFINITIONS ---

// Routes ko yahan import aur use karein (CORS ke niche)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/drive', require('./routes/driveRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/assets', require('./routes/assetRoutes')); // ✅ Yeh ab sahi kaam karega

// --- 🏠 BASE ROUTE ---
app.get('/', (req, res) => {
    res.send('EduDrive API is running smoothly... 🚀');
});

// --- 🔌 DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected: Cloud Database Ready'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 🚀 SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ======================================
    🔥 Server running on port: ${PORT}
    📡 API URL: http://localhost:${PORT}/api
    🚀 Ready for Production!
    ======================================
    `);
});
