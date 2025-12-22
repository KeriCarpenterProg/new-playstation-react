import { Col, Row, Container } from "reactstrap";
import { useParams } from "react-router-dom";
import React from "react";
import "../css/singlegamepage.css";
import ScreenShotSlider from "../components/ScreenShotSlider";
import VideoGallery from "../components/VideoGallery";
import CommentsList from "../features/comments/CommentsList";
import { useSelector } from "react-redux";
import {
  selectGamesById,
  selectAllGameGenres,
  selectAllGamePlatforms,
  hasErrMsg,
  isLoading,
} from "../features/games/gamesSlice";
import Loading from "../components/Loading";

const SingleGamePage = () => {
  const { activeGame } = useParams();
  const selectGameById = useSelector(selectGamesById);
  const game = selectGameById(activeGame);
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
    console.log(
      `Error: ${errMsg}. That's okay, we'll serve you the same data locally instead.`
    );
  }

  if (!game) {
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Game Not Found</h2>
            <p>Sorry, we couldn't find the game you're looking for.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <div
        className="blurred-background"
        style={{
          backgroundImage: `url(${game.screenshots[3]})`,
        }}
      ></div>
      <Container className="move-up" >
        <Row>
          <Col md="4">
            <img alt={game.name} className="w-100" src={game.cover} />
          </Col>
          <Col sm="8" className="transparent-box" style={{ padding: '20px' }}>
            <h1 className="overflow-wrap">{game.name}</h1>
            <h6>
              <b>Released: </b>
              {game.release_date
                ? new Date(game.release_date * 1000).toLocaleDateString()
                : game.release
                ? new Date(game.release * 1000).toLocaleDateString()
                : 'Unknown'}
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
            <div className="mt-4">
  <p style={{ 
    fontSize: '1.1rem', 
    lineHeight: '1.8',
    textAlign: 'left',
    marginBottom: 0
  }}>
    {game.description || game.summary}
  </p>
</div>
            
          </Col>
        </Row>
        {/* Only show videos if they exist */}
        {((game.youtube_id && game.youtube_id.length > 0) || (game.videos && game.videos.length > 0)) && (
          <Row className="row-content">
            <Col>
              <VideoGallery videos={game.videos} youtube_id={game.youtube_id} />
            </Col>
          </Row>
        )}
        <Row className="row-content">
          <ScreenShotSlider />
        </Row>
        <Row>
          <h1>Comments List</h1>
          <CommentsList gameId={activeGame} />
        </Row>
      </Container>
    </>
  );
};

export default SingleGamePage;
