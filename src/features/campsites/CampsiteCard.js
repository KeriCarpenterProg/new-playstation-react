import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import CampsitesList from "./CampsitesLists";

const CampsiteCard = ({ campsite }) => {
  const { image, name } = campsite;
  return (
    <Card>
      <CardImg width="100%" src={image} alt={name} />
      <CardImgOverlay>
        <CardTitle>{name} yay this works!</CardTitle>
      </CardImgOverlay>
    </Card>
  );
};

export default CampsiteCard;
