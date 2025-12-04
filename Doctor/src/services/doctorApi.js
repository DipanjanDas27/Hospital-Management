// src/redux/thunks/doctorThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// ✅ Register Doctor
export const registerDoctor = createAsyncThunk(
    "doctor/registerForDoctor",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

export const loginDoctor = createAsyncThunk(
    "doctor/loginForDoctor",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post("/login", credentials);

            const accessToken = res?.data?.data?.accessToken;
            if (accessToken) {
                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            }

            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

// ✅ Logout Doctor
export const logoutDoctor = createAsyncThunk(
    "doctor/logoutForDoctor",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/logout");
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Logout failed");
        }
    }
);

// ✅ Get Doctor Profile (private)
export const getDoctorProfile = createAsyncThunk(
    "doctor/profileForDoctor",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/profile");
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile");
        }
    }
);

// ✅ Update Doctor Profile
export const updateDoctorProfile = createAsyncThunk(
    "doctor/updateProfileForDoctor",
    async (updates, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-profile", updates);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Profile update failed");
        }
    }
);

// ✅ Update Profile Picture
export const updateDoctorProfilePic = createAsyncThunk(
    "doctor/updateProfilePicForDoctor",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-profilepicture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Profile picture update failed");
        }
    }
);

// ✅ Update Documents (degree/license)
export const updateDoctorDocuments = createAsyncThunk(
    "doctor/updateDocumentsForDoctor",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-document", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Document update failed");
        }
    }
);

// ✅ Update Password (logged in)
export const sendUpdatetPasswordOtp = createAsyncThunk(
    "doctor/sendUpdateOtpForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/update-password/send-otp", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to send OTP");
        }
    }
);
export const verifyUpdatePasswordOtp = createAsyncThunk(
    "doctor/verifyUpdateOtpForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/update-password/verify-otp", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "OTP verification failed");
        }
    }
);
export const updateDoctorPassword = createAsyncThunk(
    "doctor/updatePasswordForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-password", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Password update failed");
        }
    }
);

// ✅ Forgot Password Flow
export const sendForgotPasswordOtp = createAsyncThunk(
    "doctor/sendForgotOtpForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/forgot-password/send-otp", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to send OTP");
        }
    }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
    "doctor/verifyForgotOtpForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/forgot-password/verify-otp", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "OTP verification failed");
        }
    }
);

export const resetForgottenPassword = createAsyncThunk(
    "doctor/resetForgottenPasswordForDoctor",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.patch("/forgot-password/update-password", data);
            return res.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Password reset failed");
        }
    }
);
export const getCurrentDoctor = createAsyncThunk(
    "doctor/getCurrentDoctorForDoctor",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/renew-access-token");
            const res = await api.get("get-doctor");
            return res.data.data;
        } catch (error) {
            return rejectWithValue(null);
        }
    }
);
