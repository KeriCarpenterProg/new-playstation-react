import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { selectAllGames } from "../features/games/gamesSlice";
import { useSelector } from "react-redux";

const ColumnOfGames = () => {
  const games = useSelector(selectAllGames);
  // Create a shuffled copy of the games array
  const shuffledGames = [...games].sort(() => Math.random() - 0.5);

  return (
    <Container className="my-4 pb-2 px-1">
      {shuffledGames.map((game, index) => (
        <Row key={index} className="my-2">
          <Col sm="5">
            <img
              className="img-fluid maxHeight"
              alt={game.name}
              src={game.cover}
            />
          </Col>
          <Col sm="5">
            <Link to={`/games/${game.id}`}>
              <div className="overflow-wrap">{game.name}</div>
              <div>
                {game.release_date
                  ? new Date(game.release_date * 1000).toLocaleDateString()
                  : game.release
                  ? new Date(game.release * 1000).toLocaleDateString()
                  : 'Unknown'}
              </div>
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ColumnOfGames;
