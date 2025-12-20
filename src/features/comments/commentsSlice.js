import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../app/shared/baseUrl";
import COMMENTS from "../../app/shared/COMMENTS";

const localComments = [...COMMENTS];

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const response = await fetch(baseUrl + "comments");
    if (!response.ok) {
      return Promise.reject("Unable to fetch, status: " + response.status);
    }
    const data = await response.json();
    return data;
  }
);

const initialState = {
  commentsArray: [],
  errMsg: "",
  isLoading: true,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      const newComment = {
        id: state.commentsArray.length + 1,
        ...action.payload,
      };
      state.commentsArray.push(newComment);
    },
  },
  extraReducers: builder => {
    builder
    .addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.errMsg = "";
    })
    .addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.commentsArray = action.payload;
    })
    .addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch failed";
      state.commentsArray = localComments;
    })
  }
});

export const commentsReducer = commentsSlice.reducer;

export const { addComment } = commentsSlice.actions;

export const selectCommentsByGameId = (gameId) => (state) => {
  return state.comments.commentsArray.filter(
    (comment) => comment.gameId === parseInt(gameId)
  );
};

export const selectCommentsLoading = (state) => state.comments.isLoading;
export const selectCommentsError = (state) => state.comments.errMsg;
