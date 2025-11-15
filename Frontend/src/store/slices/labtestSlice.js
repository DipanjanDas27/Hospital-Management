import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getAllLabTests,
  getLabTestByPrescription,
  getLabTest,
} from "../../services/labtestApi";

const initialState = {
  labTests: [],
  labTest: null,
  labTestByPrescription: null,
  loading: false,
  error: null,
};

const labtestSlice = createSlice({
  name: "labtest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllLabTests.fulfilled, (state, action) => {
      state.labTests = action.payload;
    });

    builder.addCase(getLabTestByPrescription.fulfilled, (state, action) => {
      state.labTestByPrescription = action.payload;
    });

    builder.addCase(getLabTest.fulfilled, (state, action) => {
      state.labTest = action.payload;
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

export default labtestSlice.reducer;

