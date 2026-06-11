import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (token: string) => {
    const res = await api.get("/user/allUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  },
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async ({ id, token }: { id: string; token: string }) => {
    const res = await api.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
  } as any,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      });
  },
});

export default userSlice.reducer;
