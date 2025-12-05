import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
     
      <main className="min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
    </>
  )
}

export default App
