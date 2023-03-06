import React from "react";
import { Container, Row, Col } from "reactstrap";
import games from "../utils/helpers";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ColumnOfGames = () => {
  return (
    <Container>
      {games.map((i, index) => (
        <Row key={index} className="my-2">
          <Col sm="5">
            <img class="img-fluid maxHeight" src={i.cover} />
          </Col>
          <Col sm="5">
            <Link to={`/games/${i.id}`}>
              <a class="overflow-wrap" href="#">
                {i.name}
              </a>
              <div>{i.release}</div>
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ColumnOfGames;
