import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../app/shared/baseUrl";

export const fetchGames = createAsyncThunk(
    "games/fetchGames",
    async () => {
        const response = await fetch(baseUrl + "games");
        if (!response.ok) {
            return Promise.reject("Unable to fetch, status: " + response.status);
        }
        const data = await response.json();
        return data;
    }
);

export const postGames = createAsyncThunk()

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
    extraReducers: {
        [fetchGames.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchGames.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.errMsg = "";
            state.gamesArray = action.payload;
        },
        [fetchGames.rejected]: (state, action) => {
            state.isLoading = false;
            state.errMsg = action.error ? action.error.message : "Fetch failed";
        }
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
