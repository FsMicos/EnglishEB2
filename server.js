const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Create Express app with optimized settings for Vercel
const app = express();
// Set timeout to prevent serverless function timeouts
if (process.env.VERCEL) {
    app.set('etag', false);
    app.set('trust proxy', true);
}
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API endpoint for game state (future use)
app.get('/api/game-state', (req, res) => {
    res.json({ message: 'Game state endpoint' });
});

// API endpoint for leaderboard (future use)
app.get('/api/leaderboard', (req, res) => {
    res.json({ message: 'Leaderboard endpoint' });
});

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🎮 Retro English Quiz Game server running on http://localhost:${PORT}`);
        console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    });
}

// Export the Express app for Vercel
module.exports = app;
