import PopularGamesSlider from "../components/PopularGamesSlider";
import RecentlyReviewed from "../components/RecentlyReviewed";
import BestGames from "../components/BestGames";

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
