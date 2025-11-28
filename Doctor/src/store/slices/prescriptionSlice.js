import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getAllPrescriptions,
  getPrescriptionDetails,
  getPrescriptionByAppointment,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../../services/prescriptionApi";

const initialState = {
  prescriptions: [],
  prescriptionDetails: null,
  loading: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getAllPrescriptions.fulfilled, (state, action) => {
      state.prescriptions = action.payload;
    });

    builder.addCase(getPrescriptionDetails.fulfilled, (state, action) => {
      state.prescriptionDetails = action.payload;
    });

    builder.addCase(getPrescriptionByAppointment.fulfilled, (state, action) => {
      state.prescriptionDetails = action.payload;
    });

    builder.addCase(createPrescription.fulfilled, (state, action) => {
      if (action.payload) state.prescriptions.unshift(action.payload);
    });

    builder.addCase(updatePrescription.fulfilled, (state, action) => {
      if (state.prescriptions && action.payload) {
        state.prescriptions = state.prescriptions.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      }
      if (state.prescriptionDetails && action.payload?._id === state.prescriptionDetails._id) {
        state.prescriptionDetails = { ...state.prescriptionDetails, ...action.payload };
      }
    });

    builder.addCase(deletePrescription.fulfilled, (state, action) => {
      if (action.payload?._id) {
        state.prescriptions = state.prescriptions.filter((p) => p._id !== action.payload._id);
      }
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
  },
});

export default prescriptionSlice.reducer;