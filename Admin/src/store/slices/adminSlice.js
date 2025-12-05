// src/redux/slices/adminSlice.js
import { createSlice, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";
import {
  adminLogin,
  adminRegister,
  adminLogout,
  adminGetProfile,
  adminUpdateProfile,
  adminUpdateProfilePic,
  adminSendUpdatePasswordOtp,
  adminVerifyUpdatePasswordOtp,
  adminUpdatePassword,
  adminForgotPasswordSendOtp,
  adminForgotVerifyOtp,
  adminForgotUpdatePassword,
  adminGetTodayAppointments,
  adminGetAllAppointments,
  adminGetAllDoctors,
  adminGetDoctorDetails,
  adminCreateDepartment,
  adminGetAllDepartments,
  adminUpdateDepartment,
} from "@/services/adminApi";

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  todayAppointments: [],
  allAppointments: [],
  doctors: [],
  doctorDetails: null,

  prescriptions: [],
  prescriptionDetails: null,

  labtests: [],
  labtestDetails: null,

  departments: [],

  // Password flows
  updatePasswordOtpVerified: false,
  forgotPasswordOtpVerified: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    /* ---------------- AUTH ---------------- */
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.admin = action.payload.user;
      state.isAuthenticated = true;
    });

    builder.addCase(adminRegister.fulfilled, (state, action) => {
      state.admin = action.payload;
    });

    builder.addCase(adminGetProfile.fulfilled, (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(adminLogout.fulfilled, (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    });

    builder.addCase(adminUpdateProfile.fulfilled, (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
    });

    builder.addCase(adminUpdateProfilePic.fulfilled, (state, action) => {
      state.admin.profilepicture = action.payload.profilepicture;
    });

    /* ---------------- PASSWORD UPDATE (Logged-in Admin) ---------------- */
    builder.addCase(adminSendUpdatePasswordOtp.fulfilled, (state) => {
      state.updatePasswordOtpVerified = false;
    });

    builder.addCase(adminVerifyUpdatePasswordOtp.fulfilled, (state) => {
      state.updatePasswordOtpVerified = true;
    });

    builder.addCase(adminUpdatePassword.fulfilled, (state) => {
      state.updatePasswordOtpVerified = false; 
    });

    /* ---------------- FORGOT PASSWORD FLOW ---------------- */
    builder.addCase(adminForgotPasswordSendOtp.fulfilled, (state) => {
      state.forgotPasswordOtpVerified = false;
    });

    builder.addCase(adminForgotVerifyOtp.fulfilled, (state) => {
      state.forgotPasswordOtpVerified = true;
    });

    builder.addCase(adminForgotUpdatePassword.fulfilled, (state) => {
      state.forgotPasswordOtpVerified = false;
    });

    /* ---------------- APPOINTMENTS ---------------- */
    builder.addCase(adminGetTodayAppointments.fulfilled, (state, action) => {
      state.todayAppointments = action.payload;
    });

    builder.addCase(adminGetAllAppointments.fulfilled, (state, action) => {
      state.allAppointments = action.payload;
    });

    /* ---------------- DOCTOR MANAGEMENT ---------------- */
    builder.addCase(adminGetAllDoctors.fulfilled, (state, action) => {
      state.doctors = action.payload;
    });

    builder.addCase(adminGetDoctorDetails.fulfilled, (state, action) => {
      state.doctorDetails = action.payload;
    });

    /* ---------------- DEPARTMENTS ---------------- */
    builder.addCase(adminGetAllDepartments.fulfilled, (state, action) => {
      state.departments = action.payload;
    });

    builder.addCase(adminCreateDepartment.fulfilled, (state, action) => {
      state.departments.push(action.payload);
    });

    builder.addCase(adminUpdateDepartment.fulfilled, (state, action) => {
      state.departments = state.departments.map((d) =>
        d._id === action.payload._id ? action.payload : d
      );
    });

    /* ---------------- GLOBAL STATUS HANDLERS ---------------- */
    builder.addMatcher(isPending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isFulfilled, (state) => {
      state.loading = false;
    });

    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default adminSlice.reducer;
