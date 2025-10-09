    const express = require('express');
    const mongoose = require('mongoose');
    require('dotenv').config();
    const Survey = require('./models/Survey');
    const cors = require('cors');

    const app = express();
    const PORT = process.env.PORT || 5000;
    
    // --- MIDDLEWARE ---
    app.use(cors()); // 2. ENABLE CORS FOR ALL REQUESTS
    app.use(express.json());

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

    // --- ROUTES ---

    // A simple GET route to confirm the server is running
    app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
    });

    // The POST route to handle form submissions
    app.post('/api/surveys', async (req, res) => {
    try {
        // Pass the entire request body directly to the Survey model
        const newSurvey = new Survey(req.body);
        
        // Save the new document to the database
        const savedSurvey = await newSurvey.save();
        
        // Send a success response back to the front-end
        res.status(201).json(savedSurvey);

    } catch (error) {
        // If an error occurs, log it and send a detailed error response
        console.error('Error saving survey:', error);
        res.status(500).json({ message: 'Error saving to database', error: error.message });
    }
    });

    // Start the Server
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });