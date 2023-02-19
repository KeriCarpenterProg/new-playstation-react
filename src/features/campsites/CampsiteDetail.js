import { Card, CardImg, CardText, CardBody, Col } from "reactstrap";
const CampsiteDetail = ({ campsite }) => {
  const { image, name, description } = campsite;
  return (
    <Col md="5" className="m-1">
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
