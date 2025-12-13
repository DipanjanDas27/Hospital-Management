import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getProfileDetails,
  updateProfile,
  updateProfilePic,
  sendOtpForUpdate,
  verifyOtpForUpdate,
  updatePassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetForgottenPassword,
  getAllDoctors,
  getDoctorProfile,
  getAllDepartments,
  getdoctorbydepartment,
} from "../../services/patientApi";

const initialState = {
  profile: null,
  doctorProfile: null,
  doctors: [],
  loading: false,
  error: null,
  otpStatus: null,
  passwordResetStatus: null,
  departments: [],
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getProfileDetails.fulfilled, (state, action) => {
      state.profile = action.payload;
    })

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    });

    builder.addCase(updateProfilePic.fulfilled, (state, action) => {
      if (state.profile) {
        state.profile.profilepicture = action.payload.profilepicture;
      }
    });

    builder.addCase(getAllDoctors.fulfilled, (state, action) => {
      state.doctors = action.payload;
    })

    builder.addCase(getDoctorProfile.fulfilled, (state, action) => {
      state.doctorProfile = action.payload;
    })


    builder.addCase(sendOtpForUpdate.fulfilled, (state, action) => {
      state.otpStatus = "sent";
    });

    builder.addCase(verifyOtpForUpdate.fulfilled, (state, action) => {
      state.otpStatus = "verified";
    });

    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.passwordResetStatus = "updated";
    });

    builder.addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
      state.passwordResetStatus = "otp_sent";
    });

    builder.addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
      state.passwordResetStatus = "otp_verified";
    });

    builder.addCase(resetForgottenPassword.fulfilled, (state, action) => {
      state.passwordResetStatus = "reset_success";
    });

    builder.addCase(getAllDepartments.fulfilled, (state, action) => {
      state.departments = action.payload;
    })

    builder.addCase(getdoctorbydepartment.fulfilled, (state, action) => {
      state.doctors = action.payload;
    })

    builder.addMatcher(isPending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isFulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;

      const payload = action.payload;
      if (payload?.message) state.error = payload.message;
      else if (typeof payload === "string") state.error = payload;
    });


  }
});

export default patientSlice.reducer;

