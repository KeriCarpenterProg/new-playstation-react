import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../app/shared/baseUrl";
import GAMES from "../../app/shared/GAMES";

const localGames = [...GAMES];

export const fetchGames = createAsyncThunk(
    "games/fetchGames",
    async () => {
        const response = await fetch(baseUrl + "/games");
        if (!response.ok) {
            return Promise.reject("Unable to fetch, status: " + response.status);
        }
        const data = await response.json();
        return data;
    }
);

const initialState = {
    gamesArray: [],
    isLoading: true,
    errMsg: "",
};

const gamesSlice = createSlice({
    name: "games",
    initialState,
    //reducers would automatically create action creators, but asyncthunk does that for us
    reducers: {},
    //do not automatically create action creators
    extraReducers: (builder) => {
        builder
            .addCase(fetchGames.pending, (state) => {
                state.isLoading = true;
                state.errMsg = "";
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = "";
                state.gamesArray = action.payload;
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error ? action.error.message : "Fetch failed";
                state.gamesArray = localGames;
            })
    }
});

export const selectGamesById = (state) => (gameId) => {
    return state.games.gamesArray.find((game) => game.id === parseInt(gameId));
};

export const selectAllGames = (state) => state.games.gamesArray;

export const isLoading = (state) => state.games.isLoading;

export const hasErrMsg = (state) => state.games.errMsg;

export const genreMap = {
    31: "Action Adventure",
    32: "Simulator",
    5: "First Person Shooter",
    12: "Role-playing (RPG)",
    25: "Hack and slash/Beat 'em up",
};
  
export const selectFirstGameGenre = (arrOfGenres) => {
    if (!arrOfGenres || arrOfGenres.length === 0) return "Unknown";
    const sortedGenres = arrOfGenres
        .map((item) => {
            // If it's a string number like "31", convert to number and use map
            if (typeof item === 'string' && !isNaN(item)) {
                return genreMap[parseInt(item)] || item;
            }
            // If it's already a number, use map
            if (typeof item === 'number') {
                return genreMap[item] || "Unknown";
            }
            // If it's a string (genre name from IGDB), use it directly
            return item;
        })
        .sort();
    return sortedGenres.length > 0 ? sortedGenres[0] : "Unknown";
};
  
export const selectAllGameGenres = (arrOfGenres) => {
    if (!arrOfGenres || arrOfGenres.length === 0) return "Unknown";
    return arrOfGenres
        .map((item) => {
            // If it's a string number like "31", convert to number and use map
            if (typeof item === 'string' && !isNaN(item)) {
                return genreMap[parseInt(item)] || item;
            }
            // If it's already a number, use map
            if (typeof item === 'number') {
                return genreMap[item] || "Unknown";
            }
            // If it's a string (genre name from IGDB), use it directly
            return item;
        })
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
    if (!numbersArray || numbersArray.length === 0) return "Unknown";
    return numbersArray
        .map((item) => {
            // If it's a string number like "167", convert to number and use map
            if (typeof item === 'string' && !isNaN(item)) {
                return platformMap[parseInt(item)] || item;
            }
            // If it's already a number, use map
            if (typeof item === 'number') {
                return platformMap[item] || "Unknown";
            }
            // If it's a string (platform name from IGDB), use it directly
            return item;
        })
        .sort()
        .join(", ");
};

export const gamesReducer = gamesSlice.reducer;
