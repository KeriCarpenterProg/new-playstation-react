import React from "react";
import { Link } from "react-router-dom";
import { selectAllGames } from "../features/games/gamesSlice";
import { useSelector } from "react-redux";

const ColumnOfGames = () => {
  const games = useSelector(selectAllGames);
  // Create a shuffled copy and take only 5 games
  const randomGames = [...games].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div>
      {randomGames.map((game, index) => (
        <Link 
          to={`/games/${game.id}`} 
          key={index}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div 
            style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '16px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {/* Small Cover Image */}
            <img
              alt={game.name}
              src={game.cover}
              style={{
                width: '60px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '4px',
                flexShrink: 0
              }}
            />
            
            {/* Game Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {game.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {game.release_date
                  ? new Date(game.release_date * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : game.release
                  ? new Date(game.release * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'Release date unknown'}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ColumnOfGames;
