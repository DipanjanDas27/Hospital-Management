import { createSlice } from "@reduxjs/toolkit";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  renewAccessToken,
} from "../../services/patientApi";

const initialState = {
  user: null,        
  loading: false,
  error: null,
  isAuthenticated: false,
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
    builder
      
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
      })

      
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
      })

      
      .addCase(logoutPatient.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

       
      .addCase(renewAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
