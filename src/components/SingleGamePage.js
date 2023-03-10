import { Col, Row, Container } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import React from "react";
import games from "../utils/helpers";
import "../css/singlegamepage.css";
import ScreenShotSlider from "./ScreenShotSlider";
import { convertToDate } from "../utils/convertToDate";

const SingleGamePage = () => {
  const { activeGame } = useParams();
  return (
    <>
      <div
        className="blurred-background"
        style={{
          backgroundImage: `url(${games[activeGame].screenshots[1]})`,
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
            <h6>Released: {convertToDate(games[activeGame].release)}</h6>
            <hr />
            <h6>Genre: Adventure, Hack and slash/Beat 'em up</h6>

            <h6>Platforms: PlayStation 4, PlayStation 5</h6>
            <br />

            <p>{games[activeGame].summary}</p>
            <hr />
          </Col>
        </Row>
        <Row className="row-content">
          <ScreenShotSlider />
        </Row>
      </Container>
    </>
  );
};

export default SingleGamePage;
