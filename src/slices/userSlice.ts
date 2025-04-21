import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GenericRecord } from "@/types";
import { getUser } from "@/api/auth";

export const getUserApi = createAsyncThunk("user/getUserApi", async () => {
  const response = await getUser();
  return response.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null as GenericRecord | null,
    loading: "idle",
    error: null as string | null,
  },
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserApi.pending, (state) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });

    builder.addCase(getUserApi.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.data = action.payload.user;
        state.loading = "idle";
        state.error = null;
      }
    });

    builder.addCase(getUserApi.rejected, (state) => {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.error = "Error occured";
      }
    });
  },
});
export const {
  clearUser
} = userSlice.actions;
export default userSlice.reducer;
