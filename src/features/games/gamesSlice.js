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



export const gamesReducer = gamesSlice.reducer;

export const selectAllGames = (state) => state.games.gamesArray;

