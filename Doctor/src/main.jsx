import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import AuthLayout from "@/components/custom/authLayout"

import DoctorDashboard from './pages/DoctorDashboard'
import DoctorLogin from './pages/DoctorLogin'
import DoctorRegister from './pages/DoctorRegister'
import SendOtp from './pages/SendOtp'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import DoctorProfile from './pages/doctorprofile'
import UpdateProfile from './pages/UpdateProfile'
import AllAppointmentsPage from './pages/AllAppointmentPage'
import AppointmentDetails from './pages/AppointmentDetails'
import CreatePrescription from './pages/CreatePrescription'
import AllPrescriptions from './pages/AllPrescriptions'
import PrescriptionDetails from './pages/PrescriptionDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <DoctorDashboard />
      },
      {
        path: '/login',
        element: <DoctorLogin />
      },
      {
        path: '/register',
        element: <DoctorRegister />
      }, 
      {
        path: '/appointments/:appointmentid',
        element: (
          <AuthLayout authentication={true}>
            <AppointmentDetails />
          </AuthLayout>
        )
      },
      {
        path: '/todayappointments',
        element: (
          <AuthLayout authentication={true}>
            <AllAppointmentsPage />
          </AuthLayout>
        )
      },
      {
        path: '/appointments',
        element: (
          <AuthLayout authentication={true}>
            < AllAppointmentsPage/>
          </AuthLayout>
        )
      },
      {
        path: '/prescriptions',
        element: (
          <AuthLayout authentication={true}>
            < AllPrescriptions/>
          </AuthLayout>
        )
      },
      {
        path: '/prescriptions/:prescriptionid',
        element: (
          <AuthLayout authentication={true}>
            < PrescriptionDetails/>
          </AuthLayout>
        )
      },
      {
        path: '/prescription/:appointmentid/createprescription',
        element: (
          <AuthLayout authentication={true}>
            < CreatePrescription/>
          </AuthLayout>
        )
      },
      {
        path: '/prescriptions/:appointmentid/prescriptiondetails',
        element: (
          <AuthLayout authentication={true}>
            <PrescriptionDetails/>
          </AuthLayout>
        )
      },
      {
        path: '/profile/updateprofile',
        element: (
          <AuthLayout authentication={true}>
            <UpdateProfile />
          </AuthLayout>
        )
      },
      {
        path: '/profile',
        element: (
          <AuthLayout authentication={true}>
            <DoctorProfile />
          </AuthLayout>
        )
      },

      {
        path: '/update-password',
        element: <SendOtp />
      },
      {
        path: '/verify-otp',
        element: <VerifyOtp />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/forgot-password',
        element: <SendOtp />
      },

    ],
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
