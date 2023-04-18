import { useSelector } from "react-redux";
import PopularGamesSlider from "../components/PopularGamesSlider";
import RecentlyReviewed from "../components/RecentlyReviewed";
import BestGames from "../components/BestGames";
import { isLoading, hasErrMsg } from "../features/games/gamesSlice";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Row } from "reactstrap";

const HomePage = () => {

  const loading = useSelector(isLoading);
  const errMsg = useSelector(hasErrMsg);  

  if (loading) {
    return (
      <Row>
          <Loading />
      </Row>
    );
  }

  if (errMsg) {
     console.log(`Error: ${errMsg}. That's okay, we'll serve you the same data locally instead.`);
  }

  return (
    <>
      <PopularGamesSlider />
      <RecentlyReviewed />       
      <BestGames />
    </>
  );
};

export default HomePage;
