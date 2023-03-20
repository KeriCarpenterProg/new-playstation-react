import React from "react";
import { Container, Row, Col } from "reactstrap";
import games from "../utils/helpers";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { convertToDate } from "../utils/convertToDate";

const ColumnOfGames = () => {
  // Create a shuffled copy of the games array
  const shuffledGames = [...games].sort(() => Math.random() - 0.5);

  return (
    <Container className="my-4 pb-2 px-1">
      {shuffledGames.map((game, index) => (
        <Row key={index} className="my-2">
          <Col sm="5">
            <img className="img-fluid maxHeight" src={game.cover} />
          </Col>
          <Col sm="5">
            <Link to={`/games/${game.id}`}>
              <a className="overflow-wrap" href="#">
                {game.name}
              </a>
              <div>{convertToDate(game.release)}</div>
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ColumnOfGames;
