import React from "react";
import { Container, Row, Col } from "reactstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ColumnOfGames from "./ColumnOfGames";

const BestGames = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={4} className="px-3">
          <h5 className="mb-3 text-uppercase" style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
            Best Games
          </h5>
          <ColumnOfGames />
        </Col>
        <Col md={4} className="px-3">
          <h5 className="mb-3 text-uppercase" style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
            Top Rated
          </h5>
          <ColumnOfGames />
        </Col>
        <Col md={4} className="px-3">
          <h5 className="mb-3 text-uppercase" style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
            Recently Played
          </h5>
          <ColumnOfGames />
        </Col>
      </Row>
    </Container>
  );
};

export default BestGames;
