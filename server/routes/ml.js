const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/predict', async (req, res) => {
    try {
        // 1. Validate input (check if text is provided)
        if (!req.body.text || !req.body.text.trim())
            return res.status(400).json({ error: 'No text provided.  Text is required.'});
        // 2.  Call the ML API with Axios
        const response = await axios.post('http://localhost:8000/predict', { text: req.body.text });

        // 3. Return the response from the ML API
        return res.status(200).json(response.data);
    } catch (error) {
        // 4. Handle errors
        // - Check if error.response exists (ML API returned an error)
        // - Check if error.code === 'ECONNREFUSED' (ML API is not running)
        // - Return appropriate status code and message
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data.detail || 'Failed to predict genres' });
        } else if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ error: 'ML API is not running.  Please start the ML API and try again.' });
        } else {
            return res.status(500).json({ error: 'An unexpected error occurred.  Please try again later.' });
        }
    }
});

module.exports = router;