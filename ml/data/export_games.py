"""
Export games data from PostgreSQL for ML training.
Pulls game name, summary, storyline, and genres.
"""

import os
import json
import pandas as pd
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../server/.env'))

def get_db_connection():
    """Create a connection to PostgreSQL database."""
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        return psycopg2.connect(database_url)
    else:
        # Fallback to individual params
        return psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'playstation_games'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', '')
        )

def export_games_for_training():
    """
    Export games with text features and genre labels.
    Returns a DataFrame ready for ML training.
    """
    print("Connecting to database...")
    conn = get_db_connection()
    
    query = """
        SELECT 
            id,
            name,
            description,
            storyline,
            genre,
            themes,
            keywords
        FROM games
        WHERE genre IS NOT NULL 
          AND genre != '{}'
          AND (description IS NOT NULL OR storyline IS NOT NULL)
    """
    
    print("Fetching games data...")
    df = pd.read_sql(query, conn)
    conn.close()
    
    print(f"Fetched {len(df)} games with genre labels")
    
    # Combine text features into a single column
    df['combined_text'] = df.apply(
        lambda row: ' '.join(filter(None, [
            str(row['name']) if pd.notna(row['name']) else '',
            str(row['description']) if pd.notna(row['description']) else '',
            str(row['storyline']) if pd.notna(row['storyline']) else ''
        ])),
        axis=1
    )
    
    # Clean up empty combined text
    df = df[df['combined_text'].str.strip().str.len() > 10]
    
    print(f"After filtering: {len(df)} games with valid text")
    
    return df

def parse_genres(genre_value):
    """
    Parse genre value which could be:
    - A comma-separated string of genre names
    - A JSON array of genre IDs
    - A PostgreSQL array string
    - A numpy array (from psycopg2)
    """
    import numpy as np
    
    # Handle None/NaN
    if genre_value is None:
        return []
    
    # Handle numpy arrays (from PostgreSQL array columns)
    if isinstance(genre_value, np.ndarray):
        return genre_value.tolist()
    
    # Handle regular Python lists
    if isinstance(genre_value, list):
        return genre_value
    
    # Handle scalar NaN
    try:
        if pd.isna(genre_value):
            return []
    except (ValueError, TypeError):
        pass
    
    if genre_value == '':
        return []
    
    genre_str = str(genre_value)
    
    # Try parsing as JSON array
    try:
        parsed = json.loads(genre_str)
        if isinstance(parsed, list):
            return parsed
    except (json.JSONDecodeError, TypeError):
        pass
    
    # Try parsing PostgreSQL array format {1,2,3}
    if genre_str.startswith('{') and genre_str.endswith('}'):
        return genre_str[1:-1].split(',')
    
    # Assume comma-separated string
    return [g.strip() for g in genre_str.split(',') if g.strip()]

# IGDB Genre ID to Name mapping
IGDB_GENRES = {
    2: "Point-and-click",
    4: "Fighting",
    5: "Shooter",
    7: "Music",
    8: "Platform",
    9: "Puzzle",
    10: "Racing",
    11: "Real Time Strategy (RTS)",
    12: "Role-playing (RPG)",
    13: "Simulator",
    14: "Sport",
    15: "Strategy",
    16: "Turn-based strategy (TBS)",
    24: "Tactical",
    25: "Hack and slash/Beat 'em up",
    26: "Quiz/Trivia",
    30: "Pinball",
    31: "Adventure",
    32: "Indie",
    33: "Arcade",
    34: "Visual Novel",
    35: "Card & Board Game",
    36: "MOBA"
}

def get_genre_names(genre_ids):
    """Convert genre IDs to genre names."""
    genres = []
    for gid in genre_ids:
        try:
            gid_int = int(gid)
            if gid_int in IGDB_GENRES:
                genres.append(IGDB_GENRES[gid_int])
        except (ValueError, TypeError):
            # It's already a name string
            if isinstance(gid, str) and gid.strip():
                genres.append(gid.strip())
    return genres

def prepare_training_data(df):
    """
    Prepare the DataFrame for multi-label classification.
    Creates binary columns for each genre.
    """
    # Parse genres and convert IDs to names
    df['genre_list'] = df['genre'].apply(parse_genres)
    df['genre_names'] = df['genre_list'].apply(get_genre_names)
    
    # Filter out games with no valid genres
    df = df[df['genre_names'].apply(len) > 0].copy()
    
    # Get all unique genres
    all_genres = set()
    for genres in df['genre_names']:
        all_genres.update(genres)
    
    print(f"\nFound {len(all_genres)} unique genres:")
    for genre in sorted(all_genres):
        count = sum(1 for g in df['genre_names'] if genre in g)
        print(f"  - {genre}: {count} games")
    
    # Create binary columns for each genre (multi-label encoding)
    for genre in all_genres:
        df[f'genre_{genre}'] = df['genre_names'].apply(lambda x: 1 if genre in x else 0)
    
    return df, list(all_genres)

def save_training_data(df, all_genres, output_dir=None):
    """Save the processed data for training."""
    if output_dir is None:
        output_dir = os.path.dirname(__file__)
    
    # Save main dataset
    output_path = os.path.join(output_dir, 'games_training_data.csv')
    df.to_csv(output_path, index=False)
    print(f"\nSaved training data to: {output_path}")
    
    # Save genre list
    genres_path = os.path.join(output_dir, 'genre_labels.json')
    with open(genres_path, 'w') as f:
        json.dump(sorted(all_genres), f, indent=2)
    print(f"Saved genre labels to: {genres_path}")
    
    return output_path

if __name__ == '__main__':
    print("=" * 50)
    print("IGDB Games Data Export for Genre Classification")
    print("=" * 50)
    
    # Export data
    df = export_games_for_training()
    
    # Prepare for training
    df, all_genres = prepare_training_data(df)
    
    # Save
    save_training_data(df, all_genres)
    
    print("\n✅ Data export complete!")
    print(f"Total games: {len(df)}")
    print(f"Total genres: {len(all_genres)}")
