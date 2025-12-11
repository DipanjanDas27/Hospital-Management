import { createSlice } from "@reduxjs/toolkit";
import {
    adminRegister,
    adminLogin,
    adminLogout,
} from "@/services/adminApi";
import { getAdmin } from "@/services/adminApi";

const initialState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    loading: false,
    error: null,
};

const adminAuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder.addCase(adminRegister.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(adminRegister.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.isInitialized = true;
            state.error = null;
        });
        builder.addCase(adminRegister.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Registration failed";
        });

        // LOGIN
        builder.addCase(adminLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(adminLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload?.user;
            state.isInitialized = true;
            state.error = null;
            
        });
        builder.addCase(adminLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Login failed";
        });

        // LOGOUT
        builder.addCase(adminLogout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(adminLogout.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = false;
            state.error = null;
        });
        builder.addCase(adminLogout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Logout failed";
        });

        builder.addCase(getAdmin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitialized = true;
            state.error = null;
        });
        builder.addCase(getAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to load profile";
            state.isInitialized = true;
        });
        

    },
});

export const { clearAuthState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
