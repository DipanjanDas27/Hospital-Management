import { createSlice } from "@reduxjs/toolkit";
import {
    adminRegister,
    adminLogin,
    adminLogout,
    adminGetProfile,
} from "@/services/admin/adminAuthApi";

const initialState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    loading: false,
    error: null,
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        clearAdminAuthError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // REGISTER
        builder.addCase(adminRegister.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(adminRegister.fulfilled, (state) => {
            state.loading = false;
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
            state.user = action.payload;
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
        });
        builder.addCase(adminLogout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Logout failed";
        });

        builder.addCase(adminGetProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(adminGetProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(adminGetProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to load profile";
        });


    },
});

export const { clearAdminAuthError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
