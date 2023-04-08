export const genreMap = {
  31: "Action Adventure",
  32: "Simulator",
  5: "First Person Shooter",
  12: "Role-playing (RPG)",
  25: "Hack and slash/Beat 'em up",
};

export const selectFirstGameGenre = (arrOfGenres) => {
  const sortedGenres = arrOfGenres
    .map((item) => genreMap[item] || "Unknown")
    .sort();
  return sortedGenres.length > 0 ? sortedGenres[0] : "Unknown";
};

export const selectAllGameGenres = (arrOfGenres) => {
  return arrOfGenres
    .map((item) => genreMap[item] || "Unknown")
    .sort()
    .join(", ");
};

