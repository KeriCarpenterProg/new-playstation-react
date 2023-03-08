import React from "react";
import { Container, Row, Col } from "reactstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestGameImgs = () => {
  return (
    <Container>
      <Row></Row>{" "}
      <Row className="col-12 col-sm-4">
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg"
          />
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Uncharted
          </a>
          <div>Oct 10, 2022</div>
        </Col>
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co5xff.jpg"
          />
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            The Last of Us
          </a>
          <div>Oct 10, 2022</div>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1wkf.jpg"
          />
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Call of Duty
          </a>
          <div>Oct 10, 2022</div>
        </Col>
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1ur4.jpg"
          />
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Minecraft
          </a>
          <div>Oct 10, 2022</div>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_original/co1syk.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Death Stranding
          </a>
          <div>Oct 10, 2022</div>
        </Col>

        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_original/co5s5v.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            God of War
          </a>
          <div>Oct 10, 2022</div>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_original/co1r77.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Marvel's Spider Man
          </a>
          <div>Oct 10, 2022</div>
        </Col>
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Uncharted
          </a>
          <div>Oct 10, 2022</div>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1ur4.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Minecraft
          </a>
          <div>Oct 10, 2022</div>
        </Col>

        <Col className="col-4 col-sm-4">
          <img
            class="img-fluid maxHeight"
            src="https://images.igdb.com/igdb/image/upload/t_cover_big/co5xff.jpg"
          ></img>
        </Col>
        <Col>
          <a class="overflow-wrap" href="#">
            Last of Us
          </a>
          <div>Oct 10, 2022</div>
        </Col>
      </Row>
    </Container>
  );
};

export default BestGameImgs;
