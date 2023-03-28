import { createSlice } from "@reduxjs/toolkit";
import GAMES from "../../app/shared/GAMES";

const initialState = {
    games: GAMES,
};

const gamesSlice = createSlice({
    name: "games",
    initialState,
    reducers: {

    }
});

export const selectGamesById = (gameId) => {
    return GAMES.find((game) => game.id === parseInt(gameId));
};

export const gamesReducer = gamesSlice.reducer;

export const selectAllGames = (state) => state.games;