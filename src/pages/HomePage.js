import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import CampsiteDetail from "../features/campsites/CampsiteDetail";
import CampsitesList from "../features/campsites/CampsitesList";
import { selectCampsiteById } from "../features/campsites/campsitesSlice";

const HomePage = () => {
  const [campsiteId, setCampsiteId] = useState(0);
  const selectedCampsite = selectCampsiteById(campsiteId);
  return (
    <Container>
      <Row>
        <h1>This is the Home Page</h1>
      </Row>
      <Row>
        <Col sm="5" md="7">
          <CampsitesList setCampsiteId={setCampsiteId} />
        </Col>
        <Col sm="7" md="5">
          <CampsiteDetail campsite={selectedCampsite} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
