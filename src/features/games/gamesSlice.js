import { createSlice } from "@reduxjs/toolkit";
import GAMES from "../../app/shared/GAMES";

const initialState = {
    gamesArray: GAMES,
};

const gamesSlice = createSlice({
    name: "games",
    initialState,
    reducers: {

    }
});

export const selectGamesById = (state) => (gameId) => {
    return state.games.gamesArray.find((game) => game.id === parseInt(gameId));
};

export const selectAllGames = (state) => state.games.gamesArray;

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


const platformMap = {
    48: "PlayStation 4",
    167: "PlayStation 5",
    6: "PC (Microsoft Windows)",
    49: "Xbox Series X|S",
};
  
export const selectAllGamePlatforms = (numbersArray) => {
    return numbersArray
        .map((item) => platformMap[item] || "Unknown")
        .sort()
        .join(",");
};

export const gamesReducer = gamesSlice.reducer;
