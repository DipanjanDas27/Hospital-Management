import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
    checkAvailability,
    getAllAppointments,
    createAppointment,
    cancelAppointment,
    updateAppointment,
    getAppointmentDetails
} from "@/services/appointmentApi";

const initialState = {
    appointments: [],
    availability: [],
    loading: false,
    error: null,
    appointmentDetails: null
}

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(checkAvailability.fulfilled, (state, action) => {
      state.availability = action.payload;
    });

    builder.addCase(getAllAppointments.fulfilled, (state, action) => {
      state.appointments = action.payload;
    });

    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.appointments.push(action.payload);
    });

    builder.addCase(cancelAppointment.fulfilled, (state, action) => {
      state.appointments = state.appointments.filter(appointment => appointment._id !== action.payload._id);
    });

    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      const index = state.appointments.findIndex(appointment => appointment._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = { ...state.appointments[index], ... action.payload}
      }
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
  }});
  export default appointmentSlice.reducer;