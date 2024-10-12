import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import authReducer from "./features/authSlice";
import dataReducer from "./features/dataSlice";
import userReducer from "./features/userSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userState", "dataState"],
};

const rootReducer = combineReducers({
  userState: userReducer,
  dataState: dataReducer,
  authState: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
