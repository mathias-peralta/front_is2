import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type dataState = {
  data: null;
};

const initialState: dataState = {
  data: null,
};

export const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<null>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = data.actions;
export const selectData = (state: dataState) => state.data;
export default data.reducer;
