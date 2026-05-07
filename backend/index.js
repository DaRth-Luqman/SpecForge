const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeAssignment } = require('./services/openaiService');

// Load environment variables before anything else
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpecForge API is running' });
});

// Analyze Route
app.post('/api/analyze', async (req, res) => {
  try {
    const { assignmentText } = req.body;

    if (!assignmentText || assignmentText.trim() === '') {
      return res.status(400).json({ error: 'Assignment text is required.' });
    }

    const result = await analyzeAssignment(assignmentText);
    
    // Return structured JSON
    res.status(200).json(result);
  } catch (error) {
    console.error('API /analyze Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze assignment.', 
      details: error.message 
    });
  }
});

// Catch-all unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`SpecForge AI Backend running on http://localhost:${port}`);
});
