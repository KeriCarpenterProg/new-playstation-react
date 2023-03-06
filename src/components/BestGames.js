import React from "react";
import { Container, Row, Col } from "reactstrap";
import games from "../utils/helpers";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ColumnOfGames from "./ColumnOfGames";

const BestGames = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h3 className="my-4 pb-2 px-1">Best Games</h3>

          <hr></hr>
          <ColumnOfGames />
        </Col>
        <Col>
          <h3 className="my-4 pb-2 px-1">Top Rated</h3>
          <hr></hr>
          <ColumnOfGames />
        </Col>
        <Col>
          <h3 className="my-4 pb-2 px-1">Recently Played Games</h3>
          <hr></hr>
          <ColumnOfGames />
        </Col>
      </Row>
    </Container>
  );
};

export default BestGames;
