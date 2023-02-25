import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import CampsiteDetail from "../features/campsites/CampsiteDetail";
import CampsitesList from "../features/campsites/CampsitesList";
import { selectCampsiteById } from "../features/campsites/campsitesSlice";
import PopularGamesSlider from "../components/PopularGamesSlider";

const HomePage = () => {
  const [campsiteId, setCampsiteId] = useState(0);
  const selectedCampsite = selectCampsiteById(campsiteId);
  return (
    <Container>
      <PopularGamesSlider />
      <Row>
        <Col>
          <CampsitesList setCampsiteId={setCampsiteId} />
        </Col>
        <Col>
          <CampsiteDetail campsite={selectedCampsite} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
