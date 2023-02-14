import { Card, CardImg, CardText, CardBody, Col } from "reactstrap";
const CampsiteDetail = ({ campsite }) => {
  const { image, name, description } = campsite;
  return (
    <Col md="12" className="m-4">
      <Card>
        <CardImg top src={image} alt={name}></CardImg>
        <CardBody>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CampsiteDetail;
