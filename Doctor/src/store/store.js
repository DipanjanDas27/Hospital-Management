import { configureStore } from '@reduxjs/toolkit'

import appointmentReducer from './slices/appointmentSlice'
import authReducer from './slices/authSlice'
import doctorReducer from './slices/doctorSlice'
import labtestReducer from "./slices/labtestSlice"
import prescriptionReducer from "./slices/prescriptionSlice"
const store = configureStore({
  reducer: {
    doctorAppointment: appointmentReducer,
    auth:authReducer,
    doctor:doctorReducer,
    labtest:labtestReducer,
    prescription:prescriptionReducer


  },
})

export default store