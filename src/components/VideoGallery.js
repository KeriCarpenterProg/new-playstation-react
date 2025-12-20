import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink } from 'reactstrap';

const VideoGallery = ({ videos, youtube_id }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Helper function to extract video ID from URL or use raw ID
  const getVideoId = (video) => {
    if (!video) return null;
    
    // If it's already just an ID (no slashes or dots)
    if (!video.includes('/') && !video.includes('.')) {
      return video;
    }
    
    // Extract from full URL
    const match = video.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : video.replace('https://www.youtube.com/embed/', '');
  };

  // Normalize video data - support both old format (videos array) and new format (youtube_id array)
  let videoIds = [];
  
  if (youtube_id && Array.isArray(youtube_id) && youtube_id.length > 0) {
    // New format: array of video IDs
    videoIds = youtube_id.map(id => getVideoId(id)).filter(id => id);
  } else if (videos && Array.isArray(videos) && videos.length > 0) {
    // Old format: array of full URLs
    videoIds = videos.map(url => getVideoId(url)).filter(id => id);
  } else if (youtube_id && typeof youtube_id === 'string') {
    // Single video ID (legacy support)
    const id = getVideoId(youtube_id);
    if (id) videoIds = [id];
  }

  // Don't render if no videos
  if (videoIds.length === 0) {
    return null;
  }

  return (
    <div className="video-gallery my-4">
      <h2 className="mb-3">
        Videos {videoIds.length > 1 && `(${videoIds.length})`}
      </h2>
      
      {/* Main Video Player */}
      <Row className="mb-3">
        <Col>
          <Card className="bg-dark">
            <CardBody className="p-0">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${videoIds[activeVideoIndex]}`}
                  title={`Video ${activeVideoIndex + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Video Thumbnails (if multiple videos) */}
      {videoIds.length > 1 && (
        <>
          <h5 className="mb-2">All Videos</h5>
          <Nav className="video-thumbnails">
            <Row>
              {videoIds.map((videoId, index) => (
                <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-3">
                  <NavItem>
                    <NavLink
                      className={`p-0 cursor-pointer ${activeVideoIndex === index ? 'border border-primary' : ''}`}
                      onClick={() => setActiveVideoIndex(index)}
                      style={{ cursor: 'pointer', display: 'block', position: 'relative' }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={`Video ${index + 1}`}
                        className="img-fluid"
                        style={{
                          width: '100%',
                          opacity: activeVideoIndex === index ? 1 : 0.6,
                          transition: 'opacity 0.2s'
                        }}
                      />
                      {activeVideoIndex === index && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '2rem',
                            color: 'white',
                            textShadow: '0 0 10px black'
                          }}
                        >
                          <i className="fa fa-play-circle" />
                        </div>
                      )}
                      <div className="text-center mt-1">
                        <small className="text-muted">Video {index + 1}</small>
                      </div>
                    </NavLink>
                  </NavItem>
                </Col>
              ))}
            </Row>
          </Nav>
        </>
      )}

      <style>{`
        .video-thumbnails img:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoGallery;

