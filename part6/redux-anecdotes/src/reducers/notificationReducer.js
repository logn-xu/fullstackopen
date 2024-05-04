import { createSlice, configureStore } from "@reduxjs/toolkit";

const notifiSlice = createSlice({
  name: "notifi",
  initialState: "init msg",
  reducers: {
    notifiChange(state, action) {
      const msg = action.payload;
      if (msg !== "") {
        return msg;
      }
      return "";
    },
  },
});

export const notifiStore = configureStore({
  reducer: { notifi: notifiSlice.reducer },
});

export const { notifiChange } = notifiSlice.actions;
export default notifiSlice.reducer;
