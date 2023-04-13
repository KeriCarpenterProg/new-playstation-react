import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/recentlyreviewed.css";
import { selectFirstGameGenre, selectAllGames } from "../features/games/gamesSlice";

const RecentlyReviewed = () => {
  const games = useSelector(selectAllGames);

  let gamesList = [];
  for (let i = 0; i < 6; i++) {
    gamesList.push(Math.floor(Math.random() * games.length));
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
              to={`/games/${gamesList[0]}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[0]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[0]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">68%</div>
              <img
                src={games[gamesList[0]].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[1]}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[1]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[1]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">70%</div>
              <img
                src={games[gamesList[1]].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[2]}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[2]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[2]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={games[gamesList[2]].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="8">
            <Link
              to={`/games/${gamesList[3]}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[3]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[3]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">83%</div>
              <img
                src={games[gamesList[3]].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
          </Col>
          <Col>
            <Link
              to={`/games/${gamesList[4]}`}
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[4]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[4]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={games[gamesList[4]].screenshots[0]}
                alt=""
                className="w-100"
              ></img>
            </Link>
            <Link
              to={`/games/${gamesList[5]}`}
              className="review-panel embed-responsive-16by9 mt-3"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  {games[gamesList[5]].name}
                </p>
                <p className="review-panel-genres">
                  {selectFirstGameGenre(games[gamesList[5]].genre)}
                </p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src={games[gamesList[5]].screenshots[0]}
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
