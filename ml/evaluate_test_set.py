"""
Calculate confusion matrix and F1 scores for the test set predictions.
For multi-label classification, we show per-genre metrics.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    multilabel_confusion_matrix, 
    f1_score, 
    precision_score, 
    recall_score,
    classification_report
)
from sklearn.preprocessing import MultiLabelBinarizer
from models.genre_classifier import GenreClassifier

# Load data and get test set (same split as training)
df = pd.read_csv('data/games_training_data.csv')
df['genre_names'] = df['genre_names'].apply(lambda x: eval(x) if isinstance(x, str) else x)
df = df[df['combined_text'].notna() & (df['combined_text'].str.len() > 10)]
df = df[df['genre_names'].apply(len) > 0]

train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

# Load trained model
print("Loading model...")
classifier = GenreClassifier.load('models/genre_classifier.pkl')

# Get predictions
print("Running predictions on test set...")
predictions = classifier.predict(test_df['combined_text'].tolist(), threshold=0.2, top_k=None)

# Extract predicted genres as lists
predicted_genres = [
    [p['genre'] for p in pred['predictions']] 
    for pred in predictions
]
actual_genres = test_df['genre_names'].tolist()

# Get all unique genres from training
all_genres = sorted(classifier.genres)

# Create MultiLabelBinarizer fitted on all possible genres
mlb = MultiLabelBinarizer(classes=all_genres)
mlb.fit([all_genres])

# Convert to binary matrices
y_true = mlb.transform(actual_genres)
y_pred = mlb.transform(predicted_genres)

print("\n" + "=" * 70)
print("CONFUSION MATRIX & METRICS FOR TEST SET (7 games)")
print("=" * 70)

# Overall metrics
print("\n📊 OVERALL METRICS:")
print("-" * 40)
print(f"F1 Micro:    {f1_score(y_true, y_pred, average='micro', zero_division=0):.3f}")
print(f"F1 Macro:    {f1_score(y_true, y_pred, average='macro', zero_division=0):.3f}")
print(f"F1 Weighted: {f1_score(y_true, y_pred, average='weighted', zero_division=0):.3f}")
print(f"Precision:   {precision_score(y_true, y_pred, average='micro', zero_division=0):.3f}")
print(f"Recall:      {recall_score(y_true, y_pred, average='micro', zero_division=0):.3f}")

# Per-genre confusion matrices
print("\n📈 PER-GENRE CONFUSION MATRICES:")
print("-" * 40)
print("Each 2x2 matrix: [[TN, FP], [FN, TP]]")
print()

mcm = multilabel_confusion_matrix(y_true, y_pred)

for i, genre in enumerate(all_genres):
    tn, fp, fn, tp = mcm[i].ravel()
    support = tp + fn  # actual positives
    
    # Skip genres with no actual or predicted instances
    if support == 0 and (tp + fp) == 0:
        continue
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    print(f"{genre}:")
    print(f"  [[TN={tn}, FP={fp}], [FN={fn}, TP={tp}]]")
    print(f"  Precision: {precision:.2f}, Recall: {recall:.2f}, F1: {f1:.2f} (support: {support})")
    print()

# Classification report
print("\n📋 CLASSIFICATION REPORT:")
print("-" * 40)
print(classification_report(
    y_true, y_pred,
    target_names=all_genres,
    zero_division=0
))

# Detailed breakdown per game
print("\n🎮 DETAILED BREAKDOWN PER GAME:")
print("-" * 70)

test_games = list(test_df.iterrows())
total_tp, total_fp, total_fn = 0, 0, 0

for i, (idx, row) in enumerate(test_games):
    predicted = set([p['genre'] for p in predictions[i]['predictions']])
    actual = set(row['genre_names'])
    
    tp = len(predicted & actual)  # correct predictions
    fp = len(predicted - actual)  # predicted but not actual
    fn = len(actual - predicted)  # actual but not predicted
    
    total_tp += tp
    total_fp += fp
    total_fn += fn
    
    game_precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    game_recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    game_f1 = 2 * (game_precision * game_recall) / (game_precision + game_recall) if (game_precision + game_recall) > 0 else 0
    
    print(f"\n{row['name']}")
    print(f"  Predicted: {list(predicted) if predicted else '(none)'}")
    print(f"  Actual:    {list(actual)}")
    print(f"  TP={tp}, FP={fp}, FN={fn} → Precision={game_precision:.2f}, Recall={game_recall:.2f}, F1={game_f1:.2f}")

# Summary
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
overall_precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
overall_recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
overall_f1 = 2 * (overall_precision * overall_recall) / (overall_precision + overall_recall) if (overall_precision + overall_recall) > 0 else 0

print(f"\nTotal across 7 games:")
print(f"  True Positives:  {total_tp} (correctly predicted genres)")
print(f"  False Positives: {total_fp} (predicted but wrong)")
print(f"  False Negatives: {total_fn} (missed genres)")
print(f"\n  Overall Precision: {overall_precision:.2%}")
print(f"  Overall Recall:    {overall_recall:.2%}")
print(f"  Overall F1 Score:  {overall_f1:.2%}")
