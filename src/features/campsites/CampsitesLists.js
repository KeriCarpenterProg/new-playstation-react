import { Col, Row } from "reactstrap";
import CampsiteCard from "./CampsiteCard";
import { selectAllCampsites } from "./campsitesSlice";

const CampsitesList = () => {
  const campsites = selectAllCampsites();
  return (
    <div>
      <Row className="ms-auto">
        {campsites.map((campsite, index) => (
          <Col md="5" className="m-4" key={campsite.id}>
            <CampsiteCard campsite={campsite} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CampsitesList;
