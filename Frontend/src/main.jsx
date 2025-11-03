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
           <UpdateAppointment/>
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
        path: '/login',
        element: <Login />
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
