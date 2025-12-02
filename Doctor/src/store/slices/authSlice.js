import { createSlice } from "@reduxjs/toolkit";
import {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  getCurrentDoctor
} from "../../services/doctorApi";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
   
    builder.addCase(registerDoctor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    });

    builder.addCase(registerDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  
    builder.addCase(loginDoctor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.isAuthenticated = true;
      state.isInitialized = true;
    });

    builder.addCase(loginDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(logoutDoctor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(logoutDoctor.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    });

    builder.addCase(logoutDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(getCurrentDoctor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getCurrentDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload || null;
      state.isAuthenticated = true;
      state.isInitialized = true;
    });

    builder.addCase(getCurrentDoctor.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.error = null; 
    });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
