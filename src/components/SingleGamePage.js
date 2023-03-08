import { Col, Row, Container } from "reactstrap";
import { Link } from "react-router-dom";
import React from "react";
import "../css/singlegamepage.css";
import ScreenShotSlider from "./ScreenShotSlider";

const SingleGamePage = () => {
  return (
    <Container>
      <Row>
        <Col md="4">
          <img
            alt="God of War"
            class="w-100"
            src="https://images.igdb.com/igdb/image/upload/t_original/co5s5v.jpg%22%3E"
          />
        </Col>
        <Col sm="8" className="transparent-box">
          <h1 className="overflow-wrap">God of War: Ragnarok</h1>
          <h6>Released: 11/09/2022</h6>
          <hr />
          <h6>Genre: Adventure, Hack and slash/Beat 'em up</h6>

          <h6>Platforms: PlayStation 4, PlayStation 5</h6>

          <h6>Editions: See 4 more editions of this game</h6>
          <br />

          <p>
            God of War: Ragnarök is the ninth installment in the God of War
            series and the sequel to 2018's God of War. Continuing with the
            Norse mythology theme, the game is set in ancient Norway and feature
            series protagonists Kratos, the former Greek God of War, and his
            young son Atreus. The game is expected to kick off the events of
            Ragnarök, where Kratos and Atreus must journey to each of the Nine
            Realms in search of answers as they prepare for the prophesied
            battle that will end the world.
          </p>
          <hr />
        </Col>
      </Row>
      <Row className="row-content">
        <h1>Hi mom!</h1>
        <ScreenShotSlider />
      </Row>
    </Container>
  );
};

export default SingleGamePage;
