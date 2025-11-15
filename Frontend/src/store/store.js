import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import appointmentReducer from './slices/appointmentSlice'
import authReducer from './slices/authSlice'
import prescriptionReducer from './slices/prescriptionSlice'
import labtestReducer from './slices/labtestSlice'
const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    auth:authReducer,
    prescription: prescriptionReducer,
    labtest: labtestReducer,
  },
})

export default store
