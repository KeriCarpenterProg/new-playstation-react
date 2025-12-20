import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/recentlyreviewed.css";
import {
  selectFirstGameGenre,
  selectAllGames,
} from "../features/games/gamesSlice";

const RecentlyReviewed = () => {
  const games = useSelector(selectAllGames);
  // Create a shuffled copy of the games array
  const shuffledGames = [...games].sort(() => Math.random() - 0.5);

  let gamesList = [];
  for (let i = 0; i < shuffledGames.length && gamesList.length < 6; i++) {
    if (shuffledGames[i] && shuffledGames[i].screenshots && shuffledGames[i].screenshots.length > 0) {
      gamesList.push(shuffledGames[i]);
    }
  }

// Need at least 6 games to display this section
  if (games.length < 6) {
    return (
      <Container>
        <p className="text-center my-5">Loading games...</p>
      </Container>
    );
  }

  return (
    <div>
      <Container>
        <Row>
          <h3 className="my-4 pb-2 px-1">Recently Reviewed</h3>
          <hr></hr>
        </Row>
        <Row className="py-3">
          <Col>
            <Link
              to={`/games/${gamesList[0].id}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[0].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[0].genre)}
                </p>
              </div>
              <div className="review-panel-rating">68%</div>
              <img
                src={gamesList[0].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[1].id}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[1].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[1].genre)}
                </p>
              </div>
              <div className="review-panel-rating">70%</div>
              <img
                src={gamesList[1].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[2].id}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[2].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[2].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={gamesList[2].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="8">
            <Link
              to={`/games/${gamesList[3].id}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[3].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[3].genre)}
                </p>
              </div>
              <div className="review-panel-rating">83%</div>
              <img
                src={gamesList[3].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[4].id}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[4].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[4].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={gamesList[4].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
            <Link
              to={`/games/${gamesList[5].id}`}
              className="review-panel embed-responsive-16by9 mt-3"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {gamesList[5].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(gamesList[5].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={gamesList[5].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RecentlyReviewed;
