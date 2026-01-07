import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Input, Card, CardBody, CardTitle, CardText, CardImg, Alert, Label, FormGroup } from 'reactstrap';
import { baseUrl } from '../app/shared/baseUrl';

// Platform IDs from IGDB API
const PLATFORMS = [
  { id: 6, name: 'PC' },
  { id: 48, name: 'PlayStation 4' },
  { id: 167, name: 'PlayStation 5' },
  { id: 49, name: 'Xbox One' },
  { id: 169, name: 'Xbox Series X|S' },
  { id: 130, name: 'Nintendo Switch' }
];

// Genre IDs from IGDB API (common genres)
const GENRES = [
  { id: 5, name: 'Shooter' },
  { id: 12, name: 'Role-playing (RPG)' },
  { id: 25, name: 'Hack and slash/Beat \'em up' },
  { id: 31, name: 'Adventure' },
  { id: 32, name: 'Indie' },
  { id: 33, name: 'Arcade' },
  { id: 4, name: 'Fighting' },
  { id: 10, name: 'Racing' },
  { id: 11, name: 'Real Time Strategy (RTS)' },
  { id: 14, name: 'Sport' },
  { id: 15, name: 'Strategy' },
  { id: 16, name: 'Turn-based strategy (TBS)' },
  { id: 24, name: 'Tactical' },
  { id: 26, name: 'Pinball' },
  { id: 30, name: 'Puzzle' },
  { id: 2, name: 'Point-and-click' },
  { id: 9, name: 'Platform' },
  { id: 7, name: 'Music' },
  { id: 8, name: 'Party' },
  { id: 13, name: 'Simulator' },
];

const ImportGamesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [message, setMessage] = useState(null);
  const [quickImportId, setQuickImportId] = useState('');

  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (message && message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Filter states
  const [yearFrom, setYearFrom] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([48, 167]); // Default to PS4 and PS5
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState('');
  const [minRatingCount, setMinRatingCount] = useState('');

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleSearch = async () => {
    // Allow search with just filters, no text required
    const hasFilters = yearFrom || selectedPlatforms.length > 0 || selectedGenres.length > 0 || minRating || minRatingCount;
    if (!searchQuery.trim() && !hasFilters) return;

    setLoading(true);
    setMessage(null);

    try {
      // Build query string with filters
      let url = `${baseUrl}/igdb/search?limit=10`;
      
      // Only add query parameter if there's a search term
      if (searchQuery.trim()) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }

      if (yearFrom) {
        url += `&yearFrom=${yearFrom}`;
      }

      if (selectedPlatforms.length > 0) {
        url += `&platforms=${selectedPlatforms.join(',')}`;
      }

      if (selectedGenres.length > 0) {
        url += `&genres=${selectedGenres.join(',')}`;
      }

      if (minRating) {
        url += `&minRating=${minRating}`;
      }

      if (minRatingCount) {
        url += `&minRatingCount=${minRatingCount}`;
      }

      console.log('Search URL:', url);
      console.log('Year From:', yearFrom);
      console.log('Selected Platforms:', selectedPlatforms);

      const response = await fetch(url);
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

  const handleQuickSearch = async () => {
    if (!quickImportId.trim()) return;
    
    setLoading(true);
    setMessage(null);

    try {
      // Search for the specific game by ID
      const response = await fetch(`${baseUrl}/igdb/game/${quickImportId.trim()}`);
      
      if (!response.ok) {
        throw new Error('Game not found');
      }
      
      const game = await response.json();
      // Display as a single result
      setSearchResults([game]);
      setQuickImportId('');
    } catch (error) {
      console.error('Error fetching game:', error);
      setMessage({ type: 'danger', text: 'Game not found. Please check the ID and try again.' });
      setSearchResults([]);
    } finally {
      setLoading(false);
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

      {/* Quick Import by Game ID and Platform Filter */}
      <Row className='mt-3'>
        <Col md={6}>
          <Card className='bg-light h-100'>
            <CardBody>
              <CardTitle tag='h5'>Search by IGDB Game ID</CardTitle>
              <CardText className='text-muted small'>
                Already have an IGDB game ID?
              </CardText>
              <div className='d-flex gap-2'>
                <Input
                  type='text'
                  placeholder='Enter IGDB Game ID (e.g., 19560)'
                  value={quickImportId}
                  onChange={(e) => setQuickImportId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                  style={{ flex: 1 }}
                />
                <Button
                  color='primary'
                  onClick={handleQuickSearch}
                  disabled={!quickImportId.trim() || loading}
                >
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-pulse mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='bg-light h-100'>
            <CardBody>
              <CardTitle tag='h5'>Platforms</CardTitle>
              <CardText className='text-muted small'>
                Select platforms to filter search results
              </CardText>
              <div className='d-flex flex-wrap gap-2'>
                {PLATFORMS.map(platform => (
                  <Button
                    key={platform.id}
                    color={selectedPlatforms.includes(platform.id) ? 'primary' : 'outline-secondary'}
                    size='sm'
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col md={12}>
          <h5 className='mb-3'>Or Search by Name</h5>
          <FormGroup>
            <Label for='importSearch'>Search:</Label>
            <Input
              id='importSearch'
              type='text'
              placeholder='Search for a game by name...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col md={4}>
          <FormGroup>
            <Label for='yearFilter'>Release Year (from):</Label>
            <Input
              type='select'
              id='yearFilter'
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
            >
              <option value=''>Any Year</option>
              <option value='2024'>2024+</option>
              <option value='2023'>2023+</option>
              <option value='2022'>2022+</option>
              <option value='2021'>2021+</option>
              <option value='2020'>2020+</option>
              <option value='2019'>2019+</option>
              <option value='2018'>2018+</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for='ratingFilter'>Minimum Rating:</Label>
            <Input
              type='select'
              id='ratingFilter'
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value=''>Any Rating</option>
              <option value='90'>90+ (Excellent)</option>
              <option value='80'>80+ (Great)</option>
              <option value='70'>70+ (Good)</option>
              <option value='60'>60+ (Fair)</option>
              <option value='50'>50+ (Average)</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for='ratingCountFilter'>Popularity (min # ratings):</Label>
            <Input
              type='select'
              id='ratingCountFilter'
              value={minRatingCount}
              onChange={(e) => setMinRatingCount(e.target.value)}
            >
              <option value=''>Any Popularity</option>
              <option value='5000'>Very Popular (5000+)</option>
              <option value='2000'>Popular (2000+)</option>
              <option value='1000'>Well-Known (1000+)</option>
              <option value='500'>Moderate (500+)</option>
              <option value='100'>Some Reviews (100+)</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col md={12}>
          <Label>Genres:</Label>
          <div className='d-flex flex-wrap gap-2'>
            {GENRES.map(genre => (
              <Button
                key={genre.id}
                color={selectedGenres.includes(genre.id) ? 'primary' : 'outline-secondary'}
                size='sm'
                onClick={() => handleGenreToggle(genre.id)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col md={12}>
          <Button 
            color='primary' 
            onClick={handleSearch} 
            disabled={loading || (!searchQuery.trim() && !yearFrom && selectedPlatforms.length === 0 && selectedGenres.length === 0 && !minRating && !minRatingCount)} 
            block
            size='lg'
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-pulse mr-2" />
                Searching IGDB...
              </>
            ) : (
              <>
                <i className="fa fa-search mr-2" />
                Search
              </>
            )}
          </Button>
        </Col>
      </Row>

      {message && (
        <Row className='mt-3'>
          <Col>
            <Alert color={message.type} toggle={() => setMessage(null)}>
              {message.text}
            </Alert>
          </Col>
        </Row>
      )}

      {loading && (
        <Row className='mt-4'>
          <Col className='text-center py-5'>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary mb-3" />
            <h5 className="text-muted">Searching for games...</h5>
          </Col>
        </Row>
      )}

      {!loading && (
        <Row className='mt-4'>
          {searchResults.length === 0 && (searchQuery || yearFrom || selectedPlatforms.length > 0 || selectedGenres.length > 0 || minRating || minRatingCount) && (
            <Col>
              <p className='text-muted'>No results found. Try adjusting your search or filters.</p>
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
                  <small className='text-muted d-block mb-2'>
                    <strong>IGDB ID:</strong> {game?.game_id}
                  </small>
                </CardText>
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
                  {importing[game?.game_id] ? (
                    <>
                      <i className="fa fa-spinner fa-pulse mr-2" />
                      Importing...
                    </>
                  ) : (
                    'Import to Database'
                  )}
                </Button>
              </CardBody>
            </Card>
          </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ImportGamesPage;
