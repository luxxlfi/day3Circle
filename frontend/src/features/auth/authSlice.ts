import { createSlice } from "@reduxjs/toolkit";


type User = {
  id: number;
  username: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token")
    }
  }
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
