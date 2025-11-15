import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getAllPrescriptions,
  getPrescriptionByAppointment,
  getPrescription,
} from "../../services/prescriptionApi";

const initialState = {
  prescriptions: [],
  prescription: null,
  prescriptionByAppointment: null,
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

    builder.addCase(getPrescriptionByAppointment.fulfilled, (state, action) => {
      state.prescriptionByAppointment = action.payload;
    });

    builder.addCase(getPrescription.fulfilled, (state, action) => {
      state.prescription = action.payload;
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

