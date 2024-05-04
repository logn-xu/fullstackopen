import { configureStore } from "@reduxjs/toolkit";
import anecdoteReducer from "./reducers/store";
import { filterReducer } from "./reducers/store";

export const store = configureStore({
  reducer: {
    anecdote: anecdoteReducer,
    filter: filterReducer,
  },
});
