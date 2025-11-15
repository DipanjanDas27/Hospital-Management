import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'

import BookAppointment from "./pages/BookAppointment"
import DepartmentList from "./pages/DepartmentList"
import DoctorsList from "./pages/DoctorsList"
import Home from "./pages/Home"
import Login from './pages/login'
import AuthLayout from './components/custom/authLayout'
import DoctorProfile from './pages/doctorProfile'
import AllAppointments from './pages/AllAppointments'
import AppointmentDetails from './pages/AppointmentDetails'
import UpdateAppointment from './pages/UpdateAppointment'
import Register from './pages/register'
import UpdateProfile from './pages/UpdateProfile'
import PatientProfile from './pages/patientprofile'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import SendOtp from './pages/SendOtp'
import AllPrescriptions from './pages/AllPrescriptions'
import PrescriptionDetails from './pages/PrescriptionDetails'
import AllLabTests from './pages/AllLabTests'
import LabTestDetails from './pages/LabTestDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/departments',
        element:
          (<AuthLayout authentication={true}>
            <DepartmentList />
          </AuthLayout>
          ),
      },
      {
        path: "/departments/:deptname/doctors",
        element: (
          <AuthLayout authentication={true}>
            <DoctorsList />
          </AuthLayout>
        ),
      },
      {
        path: "/departments/:deptname/doctors/:doctorid",
        element: (
          <AuthLayout authentication={true}>
            <DoctorProfile />
          </AuthLayout>
        ),
      },
      {
        path: "/doctors/:doctorid",
        element: (
          <AuthLayout authentication={true}>
            <DoctorProfile />
          </AuthLayout>
        ),
      },
      {
        path: '/doctors',
        element:
          (<AuthLayout authentication={true}>
            <DoctorsList />
          </AuthLayout>
          )
      },
      {
        path: '/appointments/book-appointment/:doctorid',
        element: (
          <AuthLayout authentication={true}>
            <BookAppointment />
          </AuthLayout>
        )
      },
      {
        path: '/appointments/updateAppointment/:appointmentid',
        element: (
          <AuthLayout authentication={true}>
            <UpdateAppointment />
          </AuthLayout>
        )
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
        path: '/appointments',
        element: (
          <AuthLayout authentication={true}>
            <AllAppointments />
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
            <PatientProfile />
          </AuthLayout>
        )
      },
      {
        path: '/prescriptions',
        element: (
          <AuthLayout authentication={true}>
            <AllPrescriptions />
          </AuthLayout>
        )
      },
      {
        path: '/prescriptions/:prescriptionid',
        element: (
          <AuthLayout authentication={true}>
            <PrescriptionDetails />
          </AuthLayout>
        )
      },
      {
        path: '/labtests',
        element: (
          <AuthLayout authentication={true}>
            <AllLabTests />
          </AuthLayout>
        )
      },
      {
        path: '/labtests/:labtestid',
        element: (
          <AuthLayout authentication={true}>
            <LabTestDetails />
          </AuthLayout>
        )
      },

      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
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
