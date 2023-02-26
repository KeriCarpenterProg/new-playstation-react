import { Container, Row, Col } from "reactstrap";
import { useState } from "react";
import CampsitesList from "../features/campsites/CampsitesList";
import CampsiteDetail from "../features/campsites/CampsiteDetail";
import { selectCampsiteById } from "../features/campsites/campsitesSlice";

const CampsitesDirectoryPage = () => {
  const [campsiteId, setCampsiteId] = useState(0);
  const selectedCampsite = selectCampsiteById(campsiteId);
  return (
    <Container>
      <Row>
        <h1>Directory of Campsites</h1>
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

export default CampsitesDirectoryPage;
