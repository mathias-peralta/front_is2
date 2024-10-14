import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type userState = {
  user: null;
  auth: { token: string; message: string } | null;
};

const initialState: userState = {
  user: null,
  auth: null,
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<null>) => {
      state.user = action.payload;
      state.auth = action.payload;
    },
  },
});

export const { setUser } = user.actions;
export const selectUser = (state: any) => state.userState.user;
export const selectAuth = (state: any) => state.userState.user;

export default user.reducer;
