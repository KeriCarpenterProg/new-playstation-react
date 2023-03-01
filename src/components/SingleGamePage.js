import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";
import React from "react";
import "../css/singlegamepage.css";

const SingleGamePage = () => {
  return (
    <Container>
      <Row>
        <Col md="4">
          <img
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
        <Col sm="6">
          <h3>Migrate the Slick Slider Component here</h3>
          <h5>
            <a href="https://new-playstation.web.app/page3.html">
              Here is what it looks on my bootstrap website. Go to page3.html
            </a>
          </h5>
        </Col>
        <Col sm="6">
          <Card>
            <CardHeader className="bg-primary text-white">Some Info</CardHeader>
            <CardBody>
              <dl className="row">
                <dt className="col-6">Founded</dt>
                <dd className="col-6">February 3, 2016</dd>
                <dt className="col-6">No. of Campsites in 2019</dt>
                <dd className="col-6">563</dd>
                <dt className="col-6">No. of Reviews in 2019</dt>
                <dd className="col-6">4388</dd>
                <dt className="col-6">Employees</dt>
                <dd className="col-6">42</dd>
              </dl>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card className="bg-light mt-3">
            <CardBody>
              <blockquote className="blockquote">
                <p>
                  I will not follow where the path may lead, but I will go where
                  there is no path, and I will leave a trail.
                </p>
                <footer className="blockquote-footer">
                  Muriel Strode,{" "}
                  <cite title="Source Title">
                    "Wind-Wafted Wild Flowers" - The Open Court, 1903
                  </cite>
                </footer>
              </blockquote>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SingleGamePage;
