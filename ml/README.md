# 🎮 Game Genre Classifier

A multi-label text classification model that predicts video game genres from name, summary, description, and storyline text.

## Overview

This ML module uses:
- **sentence-transformers** for text embeddings (all-MiniLM-L6-v2)
- **scikit-learn** for multi-label classification (OneVsRest with Logistic Regression)
- **FastAPI** for serving predictions via REST API

## Quick Start

### 1. Set Up Python Environment

```bash
cd ml

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Export Training Data

Make sure your PostgreSQL database is running and accessible:

```bash
python data/export_games.py
```

This creates:
- `data/games_training_data.csv` - Training dataset
- `data/genre_labels.json` - List of genre labels

### 3. Train the Model

```bash
python models/genre_classifier.py
```

This will:
- Load the training data
- Create text embeddings using sentence-transformers
- Train a multi-label classifier
- Save the model to `models/genre_classifier.pkl`
- Show evaluation metrics and demo predictions

### 4. Run the API Server

```bash
python api/inference_server.py
```

The API will be available at `http://localhost:8000`

- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### POST /predict
Predict genres for a single game text.

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "An epic action adventure where a warrior battles mythical gods",
    "threshold": 0.3,
    "top_k": 5
  }'
```

### POST /predict/batch
Predict genres for multiple games at once.

```bash
curl -X POST "http://localhost:8000/predict/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "A fast-paced racing game with realistic physics",
      "A puzzle platformer where you manipulate time"
    ],
    "threshold": 0.3
  }'
```

### GET /genres
List all genres the model can predict.

### GET /health
Check if the service is running and model is loaded.

## Integration with Express.js Backend

You can call the ML API from your Express.js backend:

```javascript
// In server/routes/games.js or a new route

const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

router.post('/predict-genre', async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await axios.post(`${ML_API_URL}/predict`, {
      text,
      threshold: 0.3,
      top_k: 5
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Genre prediction error:', error);
    res.status(500).json({ error: 'Failed to predict genres' });
  }
});
```

## Model Performance

After training, you'll see metrics like:

- **Hamming Loss**: Lower is better (fraction of wrong labels)
- **F1 Score**: Higher is better (balance of precision/recall)
- **Per-genre precision/recall**: Shows which genres are easier to predict

## File Structure

```
ml/
├── data/
│   ├── export_games.py          # Export from PostgreSQL
│   ├── games_training_data.csv  # Training data (generated)
│   └── genre_labels.json        # Genre list (generated)
├── models/
│   ├── genre_classifier.py      # Model training code
│   └── genre_classifier.pkl     # Trained model (generated)
├── api/
│   └── inference_server.py      # FastAPI server
├── requirements.txt
└── README.md
```

## Tips for Better Performance

1. **More data**: Import more games from IGDB to improve accuracy
2. **Class balance**: If some genres have few examples, consider oversampling
3. **Hyperparameter tuning**: Try different thresholds, model types
4. **Better embeddings**: Use larger models like `all-mpnet-base-v2` for better accuracy (but slower)

## Future Improvements

- [ ] Add confidence calibration
- [ ] Try transformer-based classifiers (BERT fine-tuning)
- [ ] Add genre hierarchy (action → hack-and-slash)
- [ ] Deploy to cloud (Railway, AWS, etc.)
- [ ] Add real-time prediction widget in React frontend
