import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card, CardBody, CardTitle, Button, Nav, NavItem, NavLink, TabContent, TabPane, Badge } from 'reactstrap';
import { baseUrl } from '../app/shared/baseUrl';
import Loading from '../components/Loading';

const DatabasePage = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch games
      const gamesResponse = await fetch(`${baseUrl}/games`);
      if (!gamesResponse.ok) {
        throw new Error('Failed to fetch games');
      }
      const gamesData = await gamesResponse.json();
      setGames(gamesData);

      // Fetch comments
      const commentsResponse = await fetch(`${baseUrl}/comments`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to fetch comments');
      }
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    } catch (err) {
      console.error('Error fetching database data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleDeleteGame = async (gameId, gameName) => {
    if (!window.confirm(`Are you sure you want to delete "${gameName}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(gameId);

    try {
      const response = await fetch(`${baseUrl}/games/${gameId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      // Remove game from local state
      setGames(games.filter(game => game.id !== gameId));
      alert(`Successfully deleted "${gameName}"`);
    } catch (err) {
      console.error('Error deleting game:', err);
      alert(`Failed to delete game: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Container className='mt-4'>
        <Row>
          <Loading message="Loading database contents..." showExtendedMessage={true} />
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='mt-4'>
        <h2>Database Inspector</h2>
        <div className='alert alert-danger'>
          Error loading database: {error}
        </div>
        <p className='text-muted'>
          Note: If the database is not configured, the API will return empty results.
        </p>
      </Container>
    );
  }

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <h1>Database Inspector</h1>
          <p className='text-muted'>View and inspect your database contents</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className='mt-3 mb-4'>
        <Col md={4}>
          <Card>
            <CardBody className='text-center'>
              <CardTitle tag='h5'>Total Games</CardTitle>
              <h2 className='text-primary'>{games.length}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody className='text-center'>
              <CardTitle tag='h5'>Total Comments</CardTitle>
              <h2 className='text-success'>{comments.length}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody className='text-center'>
              <CardTitle tag='h5'>Avg Comments per Game</CardTitle>
              <h2 className='text-info'>
                {games.length > 0 ? (comments.length / games.length).toFixed(1) : 0}
              </h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === 'games' ? 'active' : ''}
            onClick={() => toggleTab('games')}
            style={{ cursor: 'pointer' }}
          >
            Games <Badge color='primary'>{games.length}</Badge>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'comments' ? 'active' : ''}
            onClick={() => toggleTab('comments')}
            style={{ cursor: 'pointer' }}
          >
            Comments <Badge color='success'>{comments.length}</Badge>
          </NavLink>
        </NavItem>
      </Nav>

      {/* Tab Content */}
      <TabContent activeTab={activeTab}>
        {/* Games Tab */}
        <TabPane tabId='games'>
          <Row className='mt-3'>
            <Col>
              {games.length === 0 ? (
                <div className='alert alert-info'>
                  No games found in the database. Import some games to see them here.
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th style={{ width: '400px' }}>Name</th>
                      <th>Release Date</th>
                      <th style={{ width: '250px' }}>Franchise</th>
                      <th style={{ width: '80px' }}>Videos</th>
                      <th style={{ width: '110px' }}>Screenshots</th>
                      <th style={{ width: '90px' }}>Artworks</th>
                      <th style={{ width: '90px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game, index) => (
                      <>
                        {/* Repeat header every 10 rows */}
                        {index > 0 && index % 10 === 0 && (
                          <tr key={`header-${index}`} style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ width: '60px' }}>ID</th>
                            <th style={{ width: '400px' }}>Name</th>
                            <th>Release Date</th>
                            <th style={{ width: '250px' }}>Franchise</th>
                            <th style={{ width: '80px' }}>Videos</th>
                            <th style={{ width: '110px' }}>Screenshots</th>
                            <th style={{ width: '90px' }}>Artworks</th>
                            <th style={{ width: '90px' }}>Actions</th>
                          </tr>
                        )}
                        <tr key={game.id}>
                          <td>{game.id}</td>
                          <td>
                            <strong>{game.name}</strong>
                            {game.game_id && (
                              <div>
                                <small className='text-muted'>IGDB ID: {game.game_id}</small>
                              </div>
                            )}
                          </td>
                          <td>
                            {game.release_date
                              ? new Date(game.release_date * 1000).toLocaleDateString()
                              : game.release
                              ? new Date(game.release * 1000).toLocaleDateString()
                              : 'Unknown'}
                          </td>
                          <td>
                            {Array.isArray(game.franchises) && game.franchises.length > 0
                              ? game.franchises.join(', ')
                              : <span className='text-muted'>-</span>}
                          </td>
                          <td className='text-center'>
                            {Array.isArray(game.youtube_id) && game.youtube_id.length > 0 && (
                              <Badge color='primary'>
                                {game.youtube_id.length}
                              </Badge>
                            )}
                          </td>
                          <td className='text-center'>
                            {Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
                              <Badge color='info'>
                                {game.screenshots.length}
                              </Badge>
                            )}
                          </td>
                          <td className='text-center'>
                            {Array.isArray(game.artworks) && game.artworks.length > 0 && (
                              <Badge color='success'>
                                {game.artworks.length}
                              </Badge>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button 
                                size='sm' 
                                color='info' 
                                onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                              >
                                {expandedGame === game.id ? 'Hide' : 'Details'}
                              </Button>
                              <Button 
                                size='sm' 
                                color='danger' 
                                onClick={() => handleDeleteGame(game.id, game.name)}
                                disabled={deleting === game.id}
                              >
                                {deleting === game.id ? (
                                  <>
                                    <i className="fa fa-spinner fa-pulse" />
                                  </>
                                ) : (
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {expandedGame === game.id && (
                          <tr key={`${game.id}-details`}>
                            <td colSpan='8' style={{ backgroundColor: '#f8f9fa' }}>
                              <div style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <h5 style={{ margin: 0 }}>Full Game Data</h5>
                                  <Button 
                                    size='sm' 
                                    color='secondary' 
                                    onClick={() => setExpandedGame(null)}
                                  >
                                    Close
                                  </Button>
                                </div>
                                <pre style={{ 
                                  backgroundColor: '#fff', 
                                  padding: '15px', 
                                  borderRadius: '5px',
                                  maxHeight: '500px',
                                  overflow: 'auto'
                                }}>
                                  {JSON.stringify(game, null, 2)}
                                </pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </TabPane>

        {/* Comments Tab */}
        <TabPane tabId='comments'>
          <Row className='mt-3'>
            <Col>
              {comments.length === 0 ? (
                <div className='alert alert-info'>
                  No comments found in the database.
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Game ID</th>
                      <th>Author</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.game_id || comment.gameId}</td>
                        <td>{comment.author}</td>
                        <td>
                          <Badge color='primary'>{comment.rating}/5</Badge>
                        </td>
                        <td>
                          <div style={{ maxWidth: '400px' }}>
                            {comment.text}
                          </div>
                        </td>
                        <td>
                          <small>
                            {comment.date
                              ? new Date(comment.date).toLocaleDateString()
                              : 'Unknown'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </TabPane>
      </TabContent>

      {/* Refresh Button */}
      <Row className='mt-4'>
        <Col>
          <Button color='primary' onClick={fetchDatabaseData} disabled={loading}>
            {loading ? (
              <>
                <i className="fa fa-spinner fa-pulse mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <i className="fa fa-refresh mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DatabasePage;

