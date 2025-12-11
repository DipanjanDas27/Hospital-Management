import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { getAdmin } from './services/adminApi.js'

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status on app mount
    dispatch(getAdmin());
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
     
      <main className="min-h-screen bg-gray-50 p-4">
        <Outlet />
      </main>
    </>
  )
}

export default App
