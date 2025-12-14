import { useState } from 'react';
import { Container, Row, Col, Button, Input, Card, CardBody, CardTitle, CardText, CardImg, Alert } from 'reactstrap';
import { baseUrl } from '../app/shared/baseUrl';

const ImportGamesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [message, setMessage] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${baseUrl}/igdb/search?query=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to search games');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching games:', error);
      setMessage({ type: 'danger', text: 'Failed to search games. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (gameId) => {
    setImporting(prev => ({ ...prev, [gameId]: true }));
    setMessage(null);

    try {
      const response = await fetch(`${baseUrl}/igdb/import/${gameId}`, {
        method: 'POST'
      });

      if (response.status === 409) {
        setMessage({ type: 'warning', text: 'This game is already in your database!' });
      } else if (!response.ok) {
        throw new Error('Failed to import game');
      } else {
        const data = await response.json();
        setMessage({ type: 'success', text: `Successfully imported ${data.name}!` });
        // Remove the imported game from search results
        setSearchResults(prev => prev.filter(game => game.game_id !== gameId));
      }
    } catch (error) {
      console.error('Error importing game:', error);
      setMessage({ type: 'danger', text: 'Failed to import game. Please try again.' });
    } finally {
      setImporting(prev => ({ ...prev, [gameId]: false }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <h1>Import Games from IGDB</h1>
          <p className='text-muted'>Search for games and add them to your database</p>
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col md={8}>
          <Input
            type='text'
            placeholder='Search for a game...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Col>
        <Col md={4}>
          <Button color='primary' onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Col>
      </Row>

      {message && (
        <Row className='mt-3'>
          <Col>
            <Alert color={message.type}>{message.text}</Alert>
          </Col>
        </Row>
      )}

      <Row className='mt-4'>
        {searchResults.length === 0 && !loading && searchQuery && (
          <Col>
            <p className='text-muted'>No results found. Try a different search term.</p>
          </Col>
        )}

        {Array.isArray(searchResults) && searchResults.map((game, index) => (
          <Col md={6} lg={4} key={game?.game_id || index} className='mb-4'>
            <Card>
              {game.cover && (
                <CardImg
                  top
                  src={game.cover}
                  alt={game.name}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              )}
              <CardBody>
                <CardTitle tag='h5'>{game?.name || 'Unknown Game'}</CardTitle>
                <CardText>
                  {game?.platforms && Array.isArray(game.platforms) && game.platforms.length > 0 && (
                    <small className='text-muted'>
                      {game.platforms.join(', ')}
                    </small>
                  )}
                </CardText>
                <CardText>
                  {game?.genre && Array.isArray(game.genre) && game.genre.length > 0 && (
                    <small className='text-muted'>
                      {game.genre.join(', ')}
                    </small>
                  )}
                </CardText>
                <CardText>
                  <small className='text-muted'>
                    {game?.release_date
                      ? new Date(game.release_date * 1000).toLocaleDateString()
                      : 'Release date unknown'}
                  </small>
                </CardText>
                <Button
                  color='success'
                  block
                  onClick={() => handleImport(game?.game_id)}
                  disabled={importing[game?.game_id]}
                >
                  {importing[game?.game_id] ? 'Importing...' : 'Import to Database'}
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ImportGamesPage;
