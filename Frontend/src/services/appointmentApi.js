import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api";


export const checkAvailability = createAsyncThunk("appointment/checkAvailability", async (params, { rejectWithValue }) => {
  try {
    const res = await api.get("/appointments/availability", { params });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getAllAppointments = createAsyncThunk("appointment/getAllAppointments", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/appointments/");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const createAppointment = createAsyncThunk("appointment/createAppointment", async ({ doctorId, payload }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/appointments/book-appointment/${doctorId}`, payload);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const cancelAppointment = createAsyncThunk("appointment/cancelAppointment", async (appointmentid, { rejectWithValue }) => {
  try {
    const res = await api.post(`/appointments/cancelAppointment/${appointmentid}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const updateAppointment = createAsyncThunk("appointment/updateAppointment", async ({ appointmentid, payload }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/appointments/updateappointment/${appointmentid}`, payload);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


export const getAppointmentDetails = createAsyncThunk("appointment/getAppointmentDetails", async (appointmentId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/appointments/${appointmentId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
