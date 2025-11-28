import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Fetch all prescriptions created by the doctor
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

// Fetch prescription by prescription id
export const getPrescriptionDetails = createAsyncThunk(
  "prescription/getPrescriptionDetails",
  async (prescriptionid, { rejectWithValue }) => {
    try {
      const res = await api.get(`/prescriptions/${prescriptionid}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch prescription by appointment id
export const getPrescriptionByAppointment = createAsyncThunk(
  "prescription/getPrescriptionByAppointment",
  async (appointmentid, { rejectWithValue }) => {
    try {
      const res = await api.get(`/prescriptions/appointment/${appointmentid}`);
      return res.data.data;
    } catch (err) {
       if (err.response?.status === 404) {
        return null; 
      }
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new prescription for an appointment
export const createPrescription = createAsyncThunk(
  "prescription/createPrescription",
  async ({ appointmentid, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/prescriptions/${appointmentid}`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update prescription details
export const updatePrescription = createAsyncThunk(
  "prescription/updatePrescription",
  async ({ prescriptionId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/prescriptions/${prescriptionId}`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a prescription
export const deletePrescription = createAsyncThunk(
  "prescription/deletePrescription",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/prescriptions/${prescriptionId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

