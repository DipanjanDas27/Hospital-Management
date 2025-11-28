import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Fetch all lab tests created by the doctor
export const getAllLabTests = createAsyncThunk(
  "labtest/getAllLabTests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/labtests");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch lab test details by id
export const getLabTestDetails = createAsyncThunk(
  "labtest/getLabTestDetails",
  async (labTestId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/labtests/${labTestId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch lab test by prescription id
export const getLabTestByPrescription = createAsyncThunk(
  "labtest/getLabTestByPrescription",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/labtests/prescription/${prescriptionId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new lab test
export const createLabTest = createAsyncThunk(
  "labtest/createLabTest",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/labtests", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update lab test meta details
export const updateLabTest = createAsyncThunk(
  "labtest/updateLabTest",
  async ({ labTestId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/labtests/${labTestId}`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update specific test results
export const updateLabTestResults = createAsyncThunk(
  "labtest/updateLabTestResults",
  async ({ labTestId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/labtests/${labTestId}/test-results`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify lab test
export const verifyLabTest = createAsyncThunk(
  "labtest/verifyLabTest",
  async (labTestId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/labtests/${labTestId}/verify`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete lab test
export const deleteLabTest = createAsyncThunk(
  "labtest/deleteLabTest",
  async (labTestId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/labtests/${labTestId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

