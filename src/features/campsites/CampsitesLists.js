import { Col, Row } from "reactstrap";
import CampsiteCard from "./CampsiteCard";
import { selectAllCampsites } from "./campsitesSlice";

const CampsitesList = ({ setCampsiteId }) => {
  const campsites = selectAllCampsites();
  return (
    <div>
      <Row className="ms-auto">
        {campsites.map((campsite, index) => (
          <Col
            onClick={() => setCampsiteId(campsite.id)}
            md="5"
            className="m-4"
            key={campsite.id}
          >
            <CampsiteCard campsite={campsite} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CampsitesList;
