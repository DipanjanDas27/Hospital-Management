import { createSlice } from "@reduxjs/toolkit";
import { isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
import {
  getAllLabTests,
  getLabTestDetails,
  getLabTestByPrescription,
  createLabTest,
  updateLabTest,
  updateLabTestResults,
  verifyLabTest,
  deleteLabTest,
} from "../../services/labtestApi";

const initialState = {
  labtests: [],
  labTestDetails: null,
  loading: false,
  error: null,
  verificationstatus: null,
};

const labtestSlice = createSlice({
  name: "labtest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getAllLabTests.fulfilled, (state, action) => {
      state.labtests = action.payload;
    });

    builder.addCase(getLabTestDetails.fulfilled, (state, action) => {
      state.labTestDetails = action.payload;
    });

    builder.addCase(getLabTestByPrescription.fulfilled, (state, action) => {
      state.labtests = action.payload;
    });

    builder.addCase(createLabTest.fulfilled, (state, action) => {
      if (action.payload) state.labtests.unshift(action.payload);
    });

    builder.addCase(updateLabTest.fulfilled, (state, action) => {
      if (state.labtests && action.payload) {
        state.labtests = state.labtests.map((lt) =>
          lt._id === action.payload._id ? action.payload : lt
        );
      }
      if (state.labTestDetails && action.payload?._id === state.labTestDetails._id) {
        state.labTestDetails = { ...state.labTestDetails, ...action.payload };
      }
    });

    builder.addCase(updateLabTestResults.fulfilled, (state, action) => {
      if (state.labTestDetails && action.payload?._id === state.labTestDetails._id) {
        state.labTestDetails = { ...state.labTestDetails, ...action.payload };
      }
    });

    builder.addCase(verifyLabTest.fulfilled, (state, action) => {
      state.verificationstatus = true;
    });

    builder.addCase(deleteLabTest.fulfilled, (state, action) => {
      if (action.payload?._id) {
        state.labtests = state.labtests.filter((lt) => lt._id !== action.payload._id);
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
  }
});
export default labtestSlice.reducer;