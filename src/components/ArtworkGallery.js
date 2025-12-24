import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import "../css/styles.css";
import { useSelector } from "react-redux";
import { selectGamesById } from "../features/games/gamesSlice";

const ArtworkGallery = () => {
  const { activeGame } = useParams();
  const selectGameById = useSelector(selectGamesById);
  const game = selectGameById(activeGame);
  const artworks = game?.artworks || [];
  
  const [featuredIndex, setFeaturedIndex] = useState(0);

  if (artworks.length === 0) {
    return null;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="my-4 pb-2 px-1">Artworks ({artworks.length})</h3>
          <hr />
        </Col>
      </Row>

      {/* Featured Large Artwork */}
      <Row className="mb-4">
        <Col>
          <img
            src={artworks[featuredIndex]}
            alt={`${game.name} artwork ${featuredIndex + 1}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "600px",
              objectFit: "contain",
              backgroundColor: "#000",
              cursor: "pointer"
            }}
            onClick={() => window.open(artworks[featuredIndex], '_blank')}
          />
        </Col>
      </Row>

      {/* Thumbnail Grid - 2 per row */}
      <Row>
        {artworks.map((artwork, index) => (
          <Col md={6} key={index} className="mb-3">
            <img
              src={artwork}
              alt={`${game.name} artwork thumbnail ${index + 1}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                cursor: "pointer",
                border: featuredIndex === index ? "4px solid #007bff" : "2px solid #ddd",
                borderRadius: "4px",
                transition: "all 0.2s"
              }}
              onClick={() => setFeaturedIndex(index)}
              onMouseEnter={(e) => {
                if (featuredIndex !== index) {
                  e.target.style.opacity = "0.8";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ArtworkGallery;

