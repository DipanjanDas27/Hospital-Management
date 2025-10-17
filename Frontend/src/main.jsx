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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/departments', element: <DepartmentList /> },
      { path: '/doctors', element: <DoctorsList /> },
      { path: '/book-appointment', element: <BookAppointment /> },
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
