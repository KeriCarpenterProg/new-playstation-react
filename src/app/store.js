import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { commentsReducer } from "../features/comments/commentsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    comments: commentsReducer,
  },
});
