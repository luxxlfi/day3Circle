import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
//import reducer asli dari threadSlice
import threadReducer from "../features/auth/threadSlice";
import userReducer from "../features/auth/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
