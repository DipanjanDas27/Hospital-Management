import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"; 

export const adminRegister = createAsyncThunk(
    "admin/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminLogin = createAsyncThunk(
    "admin/login",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/login", payload);
            return res.data.data; 
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const adminLogout = createAsyncThunk(
    "admin/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/logout");
            return res.data?.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const adminGetProfile = createAsyncThunk(
    "admin/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api("/get-profile");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminUpdateProfile = createAsyncThunk(
    "admin/updateProfile",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-profile", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminUpdateProfilePic = createAsyncThunk(
    "admin/updateProfilePic",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-profilepicture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const adminSendUpdatePasswordOtp = createAsyncThunk(
    "admin/sendUpdatePasswordOtp",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/update-password/send-otp");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const adminVerifyUpdatePasswordOtp = createAsyncThunk(
    "admin/verifyUpdatePasswordOtp",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/update-password/verify-otp", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminUpdatePassword = createAsyncThunk(
    "admin/updatePassword",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.patch("/update-password", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);



export const adminForgotPasswordSendOtp = createAsyncThunk(
    "admin/forgotSendOtp",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/forgot-password/send-otp", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminForgotVerifyOtp = createAsyncThunk(
    "admin/forgotVerifyOtp",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/forgot-password/verify-otp", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminForgotUpdatePassword = createAsyncThunk(
    "admin/forgotUpdatePassword",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.patch("/forgot-password/update-password", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const adminGetTodayAppointments = createAsyncThunk(
    "admin/todayAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/todayappointments");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const adminGetAllAppointments = createAsyncThunk(
    "admin/allAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/appointments");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
export const getAppointments = createAsyncThunk(
    "admin/getAppointment",
    async (appointmentid, { rejectWithValue }) => {
        try {
            const res = await api.get(`/appointments/${appointmentid}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminGetAllDoctors = createAsyncThunk(
    "admin/allDoctors",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/doctors");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
 export const adminGetDoctorsByDepartment = createAsyncThunk(
    "admin/doctorsByDepartment",
    async (deptname, { rejectWithValue }) => {
        try {
            const res = await api.get(`/departments/${deptname}/doctors`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminGetDoctorDetails = createAsyncThunk(
    "admin/doctorDetails",
    async (doctorid, { rejectWithValue }) => {
        try {
            const res = await api.get(`/doctors/${doctorid}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminCreateDepartment = createAsyncThunk(
    "admin/createDepartment",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/create-department", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminGetAllDepartments = createAsyncThunk(
    "admin/allDepartments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/departments");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminUpdateDepartment = createAsyncThunk(
    "admin/updateDepartment",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/update-department/${id}`, payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
export const getAdmin = createAsyncThunk(
    "admin/getAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api("/get-admin");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(null);
        }
    }
);
