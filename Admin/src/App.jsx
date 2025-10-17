import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
const App = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
    </>
  )
}

export default App
