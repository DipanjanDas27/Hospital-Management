import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/custom/Navbar.jsx'
import Footer from './components/custom/Footer.jsx'

const App = () => {
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
