import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Get all prescriptions for the logged-in patient
export const getAllPrescriptions = createAsyncThunk(
  "prescription/getAllPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/prescriptions");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get prescription by appointment ID
export const getPrescriptionByAppointment = createAsyncThunk(
  "prescription/getPrescriptionByAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/prescriptions/appointment/${appointmentId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get a single prescription by ID
export const getPrescription = createAsyncThunk(
  "prescription/getPrescription",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/prescriptions/${prescriptionId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

