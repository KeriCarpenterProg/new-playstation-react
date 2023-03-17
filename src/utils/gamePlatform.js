const platformMap = {
  48: "PlayStation 4",
  167: "PlayStation 5",
  6: "PC (Microsoft Windows)",
  49: "Xbox Series X|S",
};

export const returnAllGamePlatforms = (numbersArray) => {
  return numbersArray
    .map((item) => platformMap[item] || "Unknown")
    .sort()
    .join(",");
};
