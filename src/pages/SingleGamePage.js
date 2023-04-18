import { Col, Row, Container } from "reactstrap";
import { useParams } from "react-router-dom";
import React from "react";
import "../css/singlegamepage.css";
import ScreenShotSlider from "../components/ScreenShotSlider";
import { convertToDate } from "../utils/convertToDate";
import CommentsList from "../features/comments/CommentsList";
import { useSelector } from "react-redux";
import {
  selectAllGames,
  selectAllGameGenres,
  selectAllGamePlatforms,
  hasErrMsg,
  isLoading,
} from "../features/games/gamesSlice";
import Error from "../components/Error";
import Loading from "../components/Loading";

const SingleGamePage = () => {
  const { activeGame } = useParams();
  const game = useSelector(selectAllGames)[activeGame];
  const loading = useSelector(isLoading);
  const errMsg = useSelector(hasErrMsg);

  if (loading) {
    return (
      <Row>
        <Loading />
      </Row>
    );
  }

  if (errMsg) {
    console.log(`Error: ${errMsg}. That's okay, we'll serve you the same data locally instead.`);
 }

  return (
    <>
      <div
        className="blurred-background"
        style={{
          backgroundImage: `url(${game.screenshots[3]})`,
        }}
      ></div>
      <Container className="move-up">
        <Row>
          <Col md="4">
            <img alt={game.name} className="w-100" src={game.cover} />
          </Col>
          <Col sm="8" className="transparent-box">
            <h1 className="overflow-wrap">{game.name}</h1>
            <h6>
              <b>Released: </b>
              {convertToDate(game.release)}
            </h6>
            <h6>
              <b>Genre: </b>
              {selectAllGameGenres(game.genre)}
            </h6>
            <h6>
              <b>Platforms: </b>
              {selectAllGamePlatforms(game.platforms)}
            </h6>
            <hr />
            <p>{game.summary}</p>
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
          <CommentsList gameId={activeGame} />
        </Row>
      </Container>
    </>
  );
};

export default SingleGamePage;
