import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import "../css/about.css";

const AboutPage = () => {
  return (
    <Container>
      <Row className="row-content">
        <Col sm="6">
          <h1>About Us</h1>
          <br />
          <p class="font-size-14 text-muted">
            We love games, we grew up with games and now we are doing our dream:
            working professionally with games.
            <br />
            <br /> We do this by...
            <br />
            <br />
            <ol class="font-size-14 text-muted">
              <li>
                Gathering all relevant information about games in one place (a
                concept we call a "one-stop-infospot")
              </li>
              <li>
                Building social and exploratory features on top of this
                information
              </li>
              <li>
                Gathering a community of both Gamers and people from the game
                industry and let them communicate with each other
              </li>
              <li>
                Focusing on our users and let them decide on the design and
                features
              </li>
            </ol>
          </p>
          <h3>Contributors</h3>
          <ul class="font-size-14 text-muted">
            <li>Julia Yerman</li>
            <li>Eleanor Kahn</li>
            <li>Keri Carpenter</li>
          </ul>
        </Col>
        <Row className="row-content">
          <Col sm="6">
            <Card>
              <CardHeader className="bg-primary text-white">
                PlayStation Team
              </CardHeader>
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
        </Row>

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

export default AboutPage;
