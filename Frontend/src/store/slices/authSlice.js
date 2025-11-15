import { createSlice } from "@reduxjs/toolkit";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  getCurrentPatient
} from "../../services/patientApi";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";

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

    builder.addCase(registerPatient.fulfilled, (state, action) => {
      state.user = action.payload || null;
      state.isAuthenticated = true;
      state.isInitialized = true;
    })


    builder.addCase(loginPatient.fulfilled, (state, action) => {
      state.user = action.payload || null;
      state.isAuthenticated = true;
      state.isInitialized = true;
    })


    builder.addCase(logoutPatient.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    })

    builder.addCase(getCurrentPatient.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
      state.isAuthenticated = true;
    });

    builder.addCase(getCurrentPatient.rejected, (state, action) => {
      state.user = null;
      state.isInitialized = true;
      state.isAuthenticated = false;
      state.error = null;
    });

    builder.addMatcher(isPending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isFulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      
    });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
