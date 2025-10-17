import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";


export const registerPatient = createAsyncThunk("patient/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/register", formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const loginPatient = createAsyncThunk("patient/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/login", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const logoutPatient = createAsyncThunk("patient/logout", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const updateProfile = createAsyncThunk("patient/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.patch("/update-profile", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const updateProfilePic = createAsyncThunk("patient/updateProfilePic", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.patch("/update-profilepicture", formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getProfileDetails = createAsyncThunk("patient/getProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/get-profile");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const renewAccessToken = createAsyncThunk("patient/renewAccessToken", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/renew-access-token");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const sendOtpForUpdate = createAsyncThunk("patient/sendOtpForUpdate", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/update-password/send-otp");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const verifyOtpForUpdate = createAsyncThunk("patient/verifyOtpForUpdate", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/update-password/verify-otp", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updatePassword = createAsyncThunk("patient/updatePassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.patch("/update-password", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const sendForgotPasswordOtp = createAsyncThunk("patient/sendForgotPasswordOtp", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/forgot-password/send-otp", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const verifyForgotPasswordOtp = createAsyncThunk("patient/verifyForgotPasswordOtp", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/forgot-password/verify-otp", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const resetForgottenPassword = createAsyncThunk("patient/resetForgottenPassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.patch("/forgot-password/update-password", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getAllDoctors = createAsyncThunk("patient/getAllDoctors", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/doctors");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getDoctorProfile = createAsyncThunk("patient/getDoctorProfile", async (doctorId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/doctors/${doctorId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
