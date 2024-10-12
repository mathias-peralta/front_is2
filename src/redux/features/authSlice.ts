import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type authState = {
  token: string | null;
};

const initialState: authState = {
  token: null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = auth.actions;
export const selectAuth = (state: authState) => state.token;
export default auth.reducer;
