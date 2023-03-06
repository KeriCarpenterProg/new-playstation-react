import PopularGamesSlider from "../components/PopularGamesSlider";
import RecentlyReviewed from "../components/RecentlyReviewed";
import BestGames from "../components/BestGames";
import BestGameImgs from "../components/BestGameImgs";

const HomePage = () => {
  return (
    <>
      <PopularGamesSlider />
      <RecentlyReviewed />
      <BestGames />
    </>
  );
};

export default HomePage;
