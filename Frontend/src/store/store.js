import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import appointmentReducer from './slices/appointmentSlice'
import authReducer from './slices/authSlice'
const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    auth:authReducer,
  },
})

export default store
