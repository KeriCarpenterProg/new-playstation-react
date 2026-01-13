import { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button, Alert, Progress } from 'reactstrap';
import { baseUrl } from '../app/shared/baseUrl';

const RedisDemo = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const testCaching = async () => {
    setTesting(true);
    setResults([]);

    const testQueries = [
      { name: 'Search: "God of War"', url: `${baseUrl}/igdb/search?query=God%20of%20War&platforms=167&limit=5` },
      { name: 'Search: "Uncharted"', url: `${baseUrl}/igdb/search?query=Uncharted&platforms=48&limit=5` },
      { name: 'Game by ID: 1942', url: `${baseUrl}/igdb/game/1942` }
    ];

    const testResults = [];

    for (const test of testQueries) {
      setCurrentTest(`Testing: ${test.name}`);

      // First call - should be cache MISS (slow)
      const start1 = performance.now();
      await fetch(test.url);
      const end1 = performance.now();
      const time1 = Math.round(end1 - start1);

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 500));

      // Second call - should be cache HIT (fast!)
      const start2 = performance.now();
      await fetch(test.url);
      const end2 = performance.now();
      const time2 = Math.round(end2 - start2);

      const speedup = ((time1 - time2) / time1 * 100).toFixed(1);

      testResults.push({
        name: test.name,
        firstCall: time1,
        secondCall: time2,
        speedup: speedup,
        saved: time1 - time2
      });

      setResults([...testResults]);

      // Wait before next test
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setTesting(false);
    setCurrentTest('Tests complete!');
  };

  const getSpeedupColor = (speedup) => {
    if (speedup >= 80) return 'success';
    if (speedup >= 50) return 'info';
    if (speedup >= 20) return 'warning';
    return 'secondary';
  };

  return (
  <Container>
      <Row>
          <h1>🚀 Redis Cache Performance Demo</h1>
          <p className='text-muted'>
            See how Redis caching speeds up IGDB API calls in real-time
          </p>
      </Row>

      <Row className='mt-4'>
          <Card className='bg-light'>
            <CardBody>
              <CardTitle tag='h5'>How It Works</CardTitle>
              <ul>
                <li><strong>First Call:</strong> Fetches from IGDB API (slow - external server)</li>
                <li><strong>Second Call:</strong> Returns from Redis cache (fast - in-memory)</li>
                <li><strong>Cache Duration:</strong> Search results cached for 1 hour, game data for 24 hours</li>
              </ul>
              <Button
                color='primary'
                size='lg'
                onClick={testCaching}
                disabled={testing}
                block
              >
                {testing ? (
                  <>
                    <i className="fa fa-spinner fa-pulse mr-2" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <i className="fa fa-rocket mr-2" />
                    Run Performance Test
                  </>
                )}
              </Button>
              {currentTest && (
                <Alert color='info' className='mt-3 mb-0'>
                  {currentTest}
                </Alert>
              )}
            </CardBody>
          </Card>
      </Row>

      {results.length > 0 && (
        <Row className='mt-4'>
          <Col md={12}>
            <h3>Results</h3>
          </Col>
        </Row>
      )}

      {results.map((result, index) => (
        <Row key={index} className='mt-3'>
            <Card>
              <CardBody>
                <CardTitle tag='h5'>{result.name}</CardTitle>
                
                <Row className='mb-3'>
                  <Col md={6}>
                    <div className='mb-2'>
                      <strong>First Call (Cache Miss):</strong>
                      <span className='float-right'>{result.firstCall}ms</span>
                    </div>
                    <Progress value={100} color='danger' style={{ height: '30px' }}>
                      {result.firstCall}ms
                    </Progress>
                  </Col>
                  <Col md={6}>
                    <div className='mb-2'>
                      <strong>Second Call (Cache Hit):</strong>
                      <span className='float-right'>{result.secondCall}ms</span>
                    </div>
                    <Progress 
                      value={(result.secondCall / result.firstCall) * 100} 
                      color='success' 
                      style={{ height: '30px' }}
                    >
                      {result.secondCall}ms
                    </Progress>
                  </Col>
                </Row>

                <Alert color={getSpeedupColor(result.speedup)} className='mb-0'>
                  <Row>
                    <Col md={6}>
                      <strong>⚡ Speed Improvement:</strong> {result.speedup}% faster
                    </Col>
                    <Col md={6}>
                      <strong>⏱️ Time Saved:</strong> {result.saved}ms
                    </Col>
                  </Row>
                </Alert>
              </CardBody>
            </Card>
        </Row>
      ))}

      {results.length > 0 && (
        <Row className='mt-4'>
          <Col md={12}>
            <Card className='bg-success text-white'>
              <CardBody>
                <CardTitle tag='h4'>📊 Summary</CardTitle>
                <p className='mb-2'>
                  <strong>Average First Call:</strong> {Math.round(results.reduce((sum, r) => sum + r.firstCall, 0) / results.length)}ms
                </p>
                <p className='mb-2'>
                  <strong>Average Cached Call:</strong> {Math.round(results.reduce((sum, r) => sum + r.secondCall, 0) / results.length)}ms
                </p>
                <p className='mb-0'>
                  <strong>Average Speed Improvement:</strong> {(results.reduce((sum, r) => sum + parseFloat(r.speedup), 0) / results.length).toFixed(1)}%
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      <Row className='mt-4 mb-4'>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle tag='h5'>💡 Technical Details</CardTitle>
              <ul className='mb-0'>
                <li><strong>Cache Technology:</strong> Redis (in-memory data store)</li>
                <li><strong>Hosted on:</strong> Railway.app</li>
                <li><strong>Cache Keys:</strong> Generated from query parameters (each unique search gets its own cache entry)</li>
                <li><strong>Fallback:</strong> If Redis is unavailable, app continues without caching</li>
                <li><strong>Benefits:</strong> Faster response times, reduced API calls, better user experience, avoids rate limits</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RedisDemo;
