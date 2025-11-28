import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getAllAppointments,
  getAppointmentDetails,
  getTodayAppointments,
  verifyappointment
} from "@/services/appointmentApi";

const initialState = {
  appointments: [],
  todayappointments:[],
  verificationstatus: null,
  loading: false,
  error: null, 
  appointmentDetails: null
}

const appointmentSlice = createSlice({
  name: "doctorAppointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getAllAppointments.fulfilled, (state, action) => {
      state.appointments = action.payload;
    });
    builder.addCase(getTodayAppointments.fulfilled, (state, action) => {
      state.todayappointments = action.payload;
    });
    builder.addCase(verifyappointment.fulfilled, (state, action) => {
      state.verificationstatus = true;
    });

    builder.addCase(getAppointmentDetails.fulfilled, (state, action) => {
      state.appointmentDetails = action.payload;
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
  }
});
export default appointmentSlice.reducer;