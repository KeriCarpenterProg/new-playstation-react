import { Col, Row, Container } from "reactstrap";
import { useParams } from "react-router-dom";
import React from "react";
import games from "../utils/helpers";
import "../css/singlegamepage.css";
import ScreenShotSlider from "./ScreenShotSlider";
import { convertToDate } from "../utils/convertToDate";
import { returnAllGameGenres } from "../utils/gameGenre";
import { returnAllGamePlatforms } from "../utils/gamePlatform";
import CommentsList from "../features/comments/CommentsList";

const SingleGamePage = () => {
  const { activeGame } = useParams();
  return (
    <>
      <div
        className="blurred-background"
        style={{
          backgroundImage: `url(${games[activeGame].screenshots[2]})`,
        }}
      ></div>
      <Container className="move-up">
        <Row>
          <Col md="4">
            <img
              alt={games[activeGame].name}
              className="w-100"
              src={games[activeGame].cover}
            />
          </Col>
          <Col sm="8" className="transparent-box">
            <h1 className="overflow-wrap">{games[activeGame].name}</h1>
            <h6>
              <b>Released: </b>
              {convertToDate(games[activeGame].release)}
            </h6>
            <h6>
              <b>Genre: </b>
              {returnAllGameGenres(games[activeGame].genre)}
            </h6>
            <h6>
              <b>Platforms: </b>
              {returnAllGamePlatforms(games[activeGame].platforms)}
            </h6>
            <hr />
            <p>{games[activeGame].summary}</p>
          </Col>
        </Row>
        <Row className="row-content">
          <ScreenShotSlider />
        </Row>
        <Row>
          <h1>Comments List</h1>
          <p>
            Got the Comments List component to work. Haven't started on the
            Comment Form. It's not working right now.
          </p>
          <CommentsList campsiteId={activeGame} />
        </Row>
      </Container>
    </>
  );
};

export default SingleGamePage;
