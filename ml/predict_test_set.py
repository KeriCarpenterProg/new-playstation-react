"""
Run predictions on the test set to see how the model performs.
Shows predictions WITHOUT the actual labels first.
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from models.genre_classifier import GenreClassifier

# Load data and get test set (same split as training)
df = pd.read_csv('data/games_training_data.csv')
df['genre_names'] = df['genre_names'].apply(lambda x: eval(x) if isinstance(x, str) else x)
df = df[df['combined_text'].notna() & (df['combined_text'].str.len() > 10)]
df = df[df['genre_names'].apply(len) > 0]

train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

# Load trained model
classifier = GenreClassifier.load('models/genre_classifier.pkl')

# Predict on test set
predictions = classifier.predict(test_df['combined_text'].tolist(), threshold=0.2, top_k=3)

print()
print('=' * 60)
print('MODEL PREDICTIONS ON TEST SET (7 games)')
print('=' * 60)

test_games = list(test_df.iterrows())
for i, (idx, row) in enumerate(test_games):
    print(f"\n🎮 {row['name']}")
    print('   Predicted:')
    if predictions[i]['predictions']:
        for p in predictions[i]['predictions']:
            print(f"      • {p['genre']}: {p['probability']:.1%}")
    else:
        print("      (no predictions above threshold)")

# Ask if user wants to see actual labels
print('\n' + '=' * 60)
input("Press Enter to reveal actual genres...")
print('=' * 60)

print('\nCOMPARISON: Predicted vs Actual')
print('=' * 60)

for i, (idx, row) in enumerate(test_games):
    print(f"\n🎮 {row['name']}")
    
    predicted = [p['genre'] for p in predictions[i]['predictions']]
    actual = row['genre_names']
    
    # Find correct, missed, and wrong predictions
    correct = set(predicted) & set(actual)
    missed = set(actual) - set(predicted)
    wrong = set(predicted) - set(actual)
    
    print(f"   Predicted: {predicted if predicted else '(none)'}")
    print(f"   Actual:    {actual}")
    
    if correct:
        print(f"   ✅ Correct: {list(correct)}")
    if missed:
        print(f"   ❌ Missed:  {list(missed)}")
    if wrong:
        print(f"   ⚠️  Wrong:   {list(wrong)}")
