import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// tipe data like per thread
type LikeState = {
  liked: boolean;
  likeTotal: number;
};

// semua like disimpan berdasarkan id thread
type ThreadState = {
  likes: Record<number, LikeState>;
};

const initialState: ThreadState = {
  likes: {},
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    // simpan data awal dari props ThreadCard
    setInitialLike: (
      state,
      action: PayloadAction<{
        threadId: number;
        liked: boolean;
        likeTotal: number;
      }>,
    ) => {
      const { threadId, liked, likeTotal } = action.payload;

      state.likes[threadId] = {
        liked,
        likeTotal,
      };
    },

    // update saat user klik like
    updateLike: (
      state,
      action: PayloadAction<{
        threadId: number;
        liked: boolean;
        likeTotal: number;
      }>,
    ) => {
      const { threadId, liked, likeTotal } = action.payload;

      state.likes[threadId] = {
        liked,
        likeTotal,
      };
    },

    // update dari socket
    updateLikeTotal: (
      state,
      action: PayloadAction<{
        threadId: number;
        likeTotal: number;
      }>,
    ) => {
      const { threadId, likeTotal } = action.payload;

      if (state.likes[threadId]) {
        state.likes[threadId].likeTotal = likeTotal;
      }
    },
  },
});

export const { setInitialLike, updateLike, updateLikeTotal } =
  threadSlice.actions;

export default threadSlice.reducer;