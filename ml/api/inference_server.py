"""
FastAPI server for genre prediction inference.

Provides REST endpoints to predict game genres from text.
Can be integrated with your Express.js backend or run standalone.
"""

import os
import sys
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models.genre_classifier import GenreClassifier

app = FastAPI(
    title="Game Genre Classifier API",
    description="Predict video game genres from text descriptions using ML",
    version="1.0.0"
)

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global classifier instance
classifier: Optional[GenreClassifier] = None


class PredictionRequest(BaseModel):
    """Request body for genre prediction."""
    text: str
    threshold: float = 0.3
    top_k: Optional[int] = 5
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "An epic adventure game where a warrior battles mythical gods.",
                "threshold": 0.3,
                "top_k": 5
            }
        }


class BatchPredictionRequest(BaseModel):
    """Request body for batch genre prediction."""
    texts: List[str]
    threshold: float = 0.3
    top_k: Optional[int] = 5


class GenrePrediction(BaseModel):
    """A single genre prediction with probability."""
    genre: str
    probability: float


class PredictionResponse(BaseModel):
    """Response for genre prediction."""
    text_preview: str
    predictions: List[GenrePrediction]
    

class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    model_loaded: bool
    genres: List[str]


@app.on_event("startup")
async def load_model():
    """Load the trained model on startup."""
    global classifier
    
    model_path = os.path.join(
        os.path.dirname(__file__), 
        '../models/genre_classifier.pkl'
    )
    
    if os.path.exists(model_path):
        try:
            classifier = GenreClassifier.load(model_path)
            print(f"✅ Model loaded successfully with {len(classifier.genres)} genres")
        except Exception as e:
            print(f"⚠️ Failed to load model: {e}")
            classifier = None
    else:
        print(f"⚠️ Model file not found at {model_path}")
        print("Train the model first: python models/genre_classifier.py")
        classifier = None


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the service is running and model is loaded."""
    return HealthResponse(
        status="healthy",
        model_loaded=classifier is not None,
        genres=classifier.genres if classifier else []
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict_genre(request: PredictionRequest):
    """
    Predict genres for a single game text.
    
    - **text**: Combined game name, summary, description, storyline
    - **threshold**: Minimum probability to include a genre (default: 0.3)
    - **top_k**: Maximum number of genres to return (default: 5)
    """
    if classifier is None:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Train the model first."
        )
    
    try:
        results = classifier.predict(
            [request.text],
            threshold=request.threshold,
            top_k=request.top_k
        )
        
        result = results[0]
        return PredictionResponse(
            text_preview=result['text_preview'],
            predictions=[
                GenrePrediction(genre=p['genre'], probability=p['probability'])
                for p in result['predictions']
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch", response_model=List[PredictionResponse])
async def predict_genres_batch(request: BatchPredictionRequest):
    """
    Predict genres for multiple games at once.
    
    More efficient than calling /predict multiple times.
    """
    if classifier is None:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Train the model first."
        )
    
    if len(request.texts) > 100:
        raise HTTPException(
            status_code=400, 
            detail="Maximum 100 texts per batch request"
        )
    
    try:
        results = classifier.predict(
            request.texts,
            threshold=request.threshold,
            top_k=request.top_k
        )
        
        return [
            PredictionResponse(
                text_preview=r['text_preview'],
                predictions=[
                    GenrePrediction(genre=p['genre'], probability=p['probability'])
                    for p in r['predictions']
                ]
            )
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/genres")
async def list_genres():
    """List all genres the model can predict."""
    if classifier is None:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded"
        )
    return {"genres": classifier.genres}


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("ML_API_PORT", "8000"))
    
    print("=" * 50)
    print("Starting Genre Classifier API")
    print(f"Running on http://localhost:{port}")
    print("API docs: http://localhost:{port}/docs")
    print("=" * 50)
    
    uvicorn.run(
        "inference_server:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
