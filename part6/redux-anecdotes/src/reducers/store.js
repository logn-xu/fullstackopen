import { createSlice, configureStore } from "@reduxjs/toolkit";
import notificationReducer, { notifiChange } from "./notificationReducer";
import _ from "lodash";
import anecdoteService from "../services/anecdote";
import { act } from "react";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map((a) => asObject(a));

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      const content = action.payload;
      // state.push({ content: content, id: getId(), votes: 0 });
      state.push(content);
    },

    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    voteAction(state, action) {
      const id = action.payload;
      const voteAnecdote = state.map((anecdote) =>
        anecdote.id === id
          ? {
              ...anecdote,
              votes: anecdote.votes + 1,
            }
          : anecdote
      );

      return _.orderBy(voteAnecdote, ["votes"], ["desc"]);
    },

    setAnecdote(state, action) {
      return action.payload;
    },

    voteById(state, action) {
      // const id = action.payload;
      const voteAnecdote = state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );

      return _.orderBy(voteAnecdote, ["votes"], ["desc"]);
    },
  },
});

const filterSlice = createSlice({
  name: "filter",
  initialState: "ALL",
  reducers: {
    filter(state = "ALL", action) {
      if (action.payload !== "") {
        state = action.payload;
        // console.log(current(state));
        return state;
      }
      return state;
    },
  },
});

export const store = configureStore({
  reducer: {
    anecdote: anecdoteSlice.reducer,
    filter: filterSlice.reducer,
    notifi: notificationReducer,
  },
});

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    const sortAnecdotes = _.orderBy(anecdotes, ["votes"], ["desc"]);
    dispatch(setAnecdote(sortAnecdotes));
  };
};

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const voteResponse = await anecdoteService.voteAction(id);
    dispatch(voteById(voteResponse));
  };
};

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(notifiChange(`you voted '${content}'`));
    setTimeout(() => {
      dispatch(notifiChange(""));
    }, time * 1000);
  };
};

// export const { filterReducer } = filterSlice.reducer;
export const { filter } = filterSlice.actions;
export const { voteAction, setAnecdote, appendAnecdote, voteById } =
  anecdoteSlice.actions;
// export default anecdoteSlice.reducer;
