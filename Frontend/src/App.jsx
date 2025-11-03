import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentPatient } from './services/patientApi.js'
import { Outlet } from 'react-router-dom'
import Navbar from './components/custom/Navbar.jsx'
import Footer from './components/custom/Footer.jsx'

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status on app mount
    dispatch(getCurrentPatient());
  }, [dispatch]);
    
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
