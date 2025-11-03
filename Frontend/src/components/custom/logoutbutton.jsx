import React from "react";
import { useDispatch } from "react-redux";
import { logoutPatient } from "../../services/patientApi"; 
import { clearAuthState } from "@/store/slices/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try { 
      await dispatch(logoutPatient()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearAuthState());
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-block px-5 py-2 hover:bg-gray-600 rounded-full transition duration-200"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
