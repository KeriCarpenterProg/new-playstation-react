import { CAMPSITES } from "../../app/shared/CAMPSITES";
import { Col, Row } from "reactstrap";
import CampsiteCard from "./CampsiteCard";

const CampsitesList = () => {
  return (
    <div>
      <Row className="ms-auto">
        {CAMPSITES.map((campsite, index) => (
          <Col md="5" className="m-4" key={campsite.id}>
            <CampsiteCard campsite={campsite} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CampsitesList;
