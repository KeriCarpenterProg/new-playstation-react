import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import CampsiteDetail from "../features/campsites/CampsiteDetail";
import CampsitesList from "../features/campsites/CampsitesList";
import { selectCampsiteById } from "../features/campsites/campsitesSlice";
import PopularGamesSlider from "../components/PopularGamesSlider";
import RecentlyReviewed from "../components/RecentlyReviewed";

const HomePage = () => {
  const [campsiteId, setCampsiteId] = useState(0);
  const selectedCampsite = selectCampsiteById(campsiteId);
  return (
    <>
      <PopularGamesSlider />
      <RecentlyReviewed />
    </>
  );
};

export default HomePage;
