import { UsuariosResponse } from "@/api/users";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type userState = {
  user: UsuariosResponse | null;
};

const initialState: userState = {
  user: null,
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userState>) => {
      state.user = action.payload.user;
    },
  },
});

export const { setUser } = user.actions;
export const selectUser = (state: userState) => state.user;

export default user.reducer;
