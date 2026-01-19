"""
Genre Classifier Model

A multi-label text classifier that predicts game genres
from name, summary, description, and storyline.

Uses sentence-transformers for text embeddings and
scikit-learn for classification.
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, hamming_loss, f1_score

# Lazy load sentence-transformers (heavy import)
_embedding_model = None

def get_embedding_model():
    """Lazy load the sentence transformer model."""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        print("Loading sentence-transformers model...")
        # Using a lightweight but effective model
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded!")
    return _embedding_model


class GenreClassifier:
    """
    Multi-label genre classifier for video games.
    
    Uses text embeddings from sentence-transformers and 
    OneVsRest classification for multi-label prediction.
    """
    
    def __init__(self, model_type: str = 'logistic'):
        """
        Initialize the classifier.
        
        Args:
            model_type: 'logistic' or 'random_forest'
        """
        self.model_type = model_type
        self.classifier = None
        self.mlb = MultiLabelBinarizer()
        self.genres = []
        self.is_trained = False
        
    def _get_base_classifier(self):
        """Get the base classifier for OneVsRest."""
        if self.model_type == 'logistic':
            return LogisticRegression(
                max_iter=1000,
                class_weight='balanced',
                random_state=42
            )
        elif self.model_type == 'random_forest':
            return RandomForestClassifier(
                n_estimators=100,
                class_weight='balanced',
                random_state=42,
                n_jobs=-1
            )
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
    
    def _embed_texts(self, texts: List[str]) -> np.ndarray:
        """Convert texts to embeddings using sentence-transformers."""
        model = get_embedding_model()
        print(f"Embedding {len(texts)} texts...")
        embeddings = model.encode(
            texts, 
            show_progress_bar=True,
            convert_to_numpy=True
        )
        return embeddings
    
    def train(
        self, 
        texts: List[str], 
        genres: List[List[str]],
        test_size: float = 0.2
    ) -> Dict:
        """
        Train the genre classifier.
        
        Args:
            texts: List of combined text (name + summary + storyline)
            genres: List of genre lists for each game
            test_size: Fraction of data to use for testing
            
        Returns:
            Dictionary with training metrics
        """
        print("=" * 50)
        print("Training Genre Classifier")
        print("=" * 50)
        
        # Encode genres as multi-label binary matrix
        y = self.mlb.fit_transform(genres)
        self.genres = list(self.mlb.classes_)
        print(f"\nGenres to predict ({len(self.genres)}): {self.genres}")
        
        # Get text embeddings
        X = self._embed_texts(texts)
        print(f"Embedding shape: {X.shape}")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        print(f"\nTraining set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        # Train classifier
        print(f"\nTraining {self.model_type} classifier...")
        self.classifier = OneVsRestClassifier(
            self._get_base_classifier(),
            n_jobs=-1
        )
        self.classifier.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate
        print("\nEvaluating on test set...")
        y_pred = self.classifier.predict(X_test)
        
        # Calculate metrics
        metrics = {
            'hamming_loss': hamming_loss(y_test, y_pred),
            'f1_micro': f1_score(y_test, y_pred, average='micro'),
            'f1_macro': f1_score(y_test, y_pred, average='macro'),
            'f1_weighted': f1_score(y_test, y_pred, average='weighted'),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'num_genres': len(self.genres)
        }
        
        print("\n" + "=" * 50)
        print("TRAINING RESULTS")
        print("=" * 50)
        print(f"Hamming Loss: {metrics['hamming_loss']:.4f} (lower is better)")
        print(f"F1 Micro: {metrics['f1_micro']:.4f}")
        print(f"F1 Macro: {metrics['f1_macro']:.4f}")
        print(f"F1 Weighted: {metrics['f1_weighted']:.4f}")
        
        # Per-genre classification report
        print("\nPer-Genre Performance:")
        print(classification_report(
            y_test, y_pred, 
            target_names=self.genres,
            zero_division=0
        ))
        
        return metrics
    
    def predict(
        self, 
        texts: List[str], 
        threshold: float = 0.3,
        top_k: Optional[int] = None
    ) -> List[Dict]:
        """
        Predict genres for given texts.
        
        Args:
            texts: List of game texts to classify
            threshold: Minimum probability to include a genre
            top_k: If set, return only top K genres per game
            
        Returns:
            List of dicts with predicted genres and probabilities
        """
        if not self.is_trained:
            raise RuntimeError("Model not trained. Call train() first.")
        
        # Get embeddings
        X = self._embed_texts(texts)
        
        # Get probabilities
        # OneVsRestClassifier.predict_proba returns shape (n_samples, n_classes)
        # where each value is the probability of the positive class
        probas_raw = self.classifier.predict_proba(X)
        
        n_samples = len(texts)
        n_classes = len(self.genres)
        
        # Handle different return formats
        if isinstance(probas_raw, list):
            # List of arrays (one per class)
            probas = np.zeros((n_samples, n_classes))
            for j in range(min(len(probas_raw), n_classes)):
                arr = probas_raw[j]
                if len(arr.shape) > 1 and arr.shape[1] == 2:
                    probas[:, j] = arr[:, 1]
                elif len(arr.shape) == 1 and arr.shape[0] == n_samples:
                    probas[:, j] = arr
                else:
                    # Fallback: use decision function or zeros
                    probas[:, j] = 0.5
        elif isinstance(probas_raw, np.ndarray):
            if probas_raw.shape == (n_samples, n_classes):
                # Already in the right format
                probas = probas_raw
            else:
                # Reshape or handle unexpected format
                probas = np.zeros((n_samples, n_classes))
                probas[:, :min(probas_raw.shape[1], n_classes)] = probas_raw[:, :n_classes]
        else:
            raise ValueError(f"Unexpected predict_proba output type: {type(probas_raw)}")
        
        results = []
        for i, text in enumerate(texts):
            # Get probabilities for this sample
            sample_probs = {genre: float(probas[i, j]) for j, genre in enumerate(self.genres)}
            
            # Sort by probability
            sorted_genres = sorted(
                sample_probs.items(), 
                key=lambda x: x[1], 
                reverse=True
            )
            
            # Apply threshold and top_k
            predicted = []
            for genre, prob in sorted_genres:
                if prob >= threshold:
                    predicted.append({'genre': genre, 'probability': prob})
                    if top_k and len(predicted) >= top_k:
                        break
            
            results.append({
                'text_preview': text[:100] + '...' if len(text) > 100 else text,
                'predictions': predicted,
                'all_probabilities': sample_probs
            })
        
        return results
    
    def save(self, path: str):
        """Save the trained model to disk."""
        if not self.is_trained:
            raise RuntimeError("Model not trained. Call train() first.")
        
        model_data = {
            'classifier': self.classifier,
            'mlb': self.mlb,
            'genres': self.genres,
            'model_type': self.model_type
        }
        
        with open(path, 'wb') as f:
            pickle.dump(model_data, f)
        print(f"Model saved to: {path}")
    
    @classmethod
    def load(cls, path: str) -> 'GenreClassifier':
        """Load a trained model from disk."""
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        instance = cls(model_type=model_data['model_type'])
        instance.classifier = model_data['classifier']
        instance.mlb = model_data['mlb']
        instance.genres = model_data['genres']
        instance.is_trained = True
        
        print(f"Model loaded from: {path}")
        print(f"Genres: {instance.genres}")
        
        return instance


def train_from_csv(csv_path: str, model_save_path: str = None) -> GenreClassifier:
    """
    Convenience function to train from exported CSV.
    
    Args:
        csv_path: Path to games_training_data.csv
        model_save_path: Where to save the trained model
        
    Returns:
        Trained GenreClassifier
    """
    print(f"Loading data from: {csv_path}")
    df = pd.read_csv(csv_path)
    
    # Parse genre_names from string representation of list
    df['genre_names'] = df['genre_names'].apply(
        lambda x: eval(x) if isinstance(x, str) else x
    )
    
    # Filter valid data
    df = df[df['combined_text'].notna() & (df['combined_text'].str.len() > 10)]
    df = df[df['genre_names'].apply(len) > 0]
    
    print(f"Training on {len(df)} games")
    
    # Train
    classifier = GenreClassifier(model_type='logistic')
    metrics = classifier.train(
        texts=df['combined_text'].tolist(),
        genres=df['genre_names'].tolist()
    )
    
    # Save if path provided
    if model_save_path:
        classifier.save(model_save_path)
    
    return classifier


if __name__ == '__main__':
    import sys
    
    # Default paths
    data_dir = os.path.join(os.path.dirname(__file__), '../data')
    csv_path = os.path.join(data_dir, 'games_training_data.csv')
    model_path = os.path.join(os.path.dirname(__file__), 'genre_classifier.pkl')
    
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    
    if not os.path.exists(csv_path):
        print(f"Error: Training data not found at {csv_path}")
        print("Run 'python data/export_games.py' first to export training data.")
        sys.exit(1)
    
    # Train and save
    classifier = train_from_csv(csv_path, model_path)
    
    # Demo prediction
    print("\n" + "=" * 50)
    print("DEMO PREDICTIONS")
    print("=" * 50)
    
    demo_texts = [
        "An epic action adventure where a warrior battles mythical gods in ancient Greece.",
        "A fast-paced racing game with realistic physics and licensed cars.",
        "A puzzle platformer where you manipulate time to solve challenges.",
        "A tactical turn-based strategy game set in a fantasy world with magic."
    ]
    
    predictions = classifier.predict(demo_texts, threshold=0.2, top_k=3)
    
    for pred in predictions:
        print(f"\nText: {pred['text_preview']}")
        print("Predicted genres:")
        for p in pred['predictions']:
            print(f"  - {p['genre']}: {p['probability']:.2%}")
