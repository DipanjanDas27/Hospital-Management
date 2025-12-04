import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorDocuments,
  updateDoctorProfilePic,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetForgottenPassword,
  sendUpdatetPasswordOtp,
  verifyUpdatePasswordOtp,
  updateDoctorPassword,


} from "../../services/doctorApi";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  otpStatus: null,
  passwordResetStatus: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(updateDoctorDocuments.fulfilled, (state, action) => {
      if (state.profile) {
        state.profile.verificationdocument.medicaldegree =
          action.payload.verificationdocument.medicaldegree;

        state.profile.verificationdocument.medicallicense =
          action.payload.verificationdocument.medicallicense;
      }
    });


    builder.addCase(updateDoctorProfile.fulfilled, (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    });

    builder.addCase(updateDoctorProfilePic.fulfilled, (state, action) => {
      if (state.profile) {
        state.profile.verificationdocument.profilepicture =
          action.payload.verificationdocument?.profilepicture;

      }
    });

    builder.addCase(getDoctorProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    })


    builder.addCase(sendUpdatetPasswordOtp.fulfilled, (state, action) => {
      state.otpStatus = "sent";
    });

    builder.addCase(verifyUpdatePasswordOtp.fulfilled, (state, action) => {
      state.otpStatus = "verified";
    });

    builder.addCase(updateDoctorPassword.fulfilled, (state, action) => {
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
      else state.error = "Something went wrong";
    });

  }
});

export default doctorSlice.reducer;

