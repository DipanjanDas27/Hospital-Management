import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Get all lab tests for the logged-in patient
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

// Get lab test by prescription ID
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

// Get a single lab test by ID
export const getLabTest = createAsyncThunk(
  "labtest/getLabTest",
  async (labTestId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/labtests/${labTestId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

