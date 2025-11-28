import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "./api";

export const getTodayAppointments = createAsyncThunk("doctorappointment/getTodayAppointments", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/todayappointments");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
export const getAllAppointments = createAsyncThunk("doctorappointment/getAllAppointments", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/appointments");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getAppointmentDetails = createAsyncThunk("doctorappointment/getAppointmentDetailsForDoctor", async (appointmentid, { rejectWithValue }) => {
  try {
    const res = await api.get(`/appointments/${appointmentid}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
export const verifyappointment = createAsyncThunk("doctorappointment/verifyAppointment",async ({ appointmentid, code }, { rejectWithValue }) => {
  console.log(appointmentid,code)
    try {
      const res = await api.post(`/appointments/verify-appointment`, {
        appointmentid,
        code
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 