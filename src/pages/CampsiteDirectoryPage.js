import { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import CampsiteDetail from "../features/campsites/CampsiteDetail";
import CampsitesList from "../features/campsites/CampsitesLists";
import { selectRandomCampsite } from "../features/campsites/campsitesSlice";

const CampsiteDirectoryPage = () => {
  const [selectedCampsite, toggleCampsite] = useState(selectRandomCampsite);
  return (
    <Container>
      <Button onClick={() => toggleCampsite(selectRandomCampsite)}>
        Select Random Campsite
      </Button>
      <Row>
        <Col sm="5" md="7">
          <CampsitesList />
        </Col>
        <Col sm="7" md="5">
          <CampsiteDetail campsite={selectedCampsite} />
        </Col>
      </Row>
    </Container>
  );
};

export default CampsiteDirectoryPage;
