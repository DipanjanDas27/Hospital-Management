import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './slices/adminSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth:authReducer,
  },
})

export default store
