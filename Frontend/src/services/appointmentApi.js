import { createAsyncThunk } from "@reduxjs/toolkitt"
import api from "./api";


export const checkAvailability = createAsyncThunk("appointment/checkAvailability", async (params, { rejectWithValue }) => {
  try {
    const res = await api.get("/availability", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getAllAppointments = createAsyncThunk("appointment/getAllAppointments", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const createAppointment = createAsyncThunk("appointment/createAppointment", async ({ doctorId, payload }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/${doctorId}`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const cancelAppointment = createAsyncThunk("appointment/cancelAppointment", async (appointmentId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/${appointmentId}/cancel`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const updateAppointment = createAsyncThunk("appointment/updateAppointment", async ({ appointmentId, payload }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/${appointmentId}/update`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getAppointmentDetails = createAsyncThunk("appointment/getAppointmentDetails", async (appointmentId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/${appointmentId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
