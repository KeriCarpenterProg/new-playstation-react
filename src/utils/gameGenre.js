const genreMap = {
  31: "Action & Adventure",
  32: "Simulator",
  5: "First Person Shooter",
  12: "Role-playing (RPG)",
  25: "Hack and slash/Beat 'em up",
};

export const returnFirstGameGenre = (numbersArray) => {
  const sortedGenres = numbersArray
    .map((item) => genreMap[item] || "Unknown")
    .sort();
  return sortedGenres.length > 0 ? sortedGenres[0] : "Unknown";
};

export const returnAllGameGenres = (numbersArray) => {
  return numbersArray
    .map((item) => genreMap[item] || "Unknown")
    .sort()
    .join(",");
};

/**
 *
 * import { returnAllGameGenres } from "../utils/gameGenre";
 * {games.map((game) => (
 * <h6>{returnAllGameGenres(game.genre)}</h6>
 * ))}
 */
