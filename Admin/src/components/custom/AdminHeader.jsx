import React from "react";
import { Shield, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "@/services/adminApi";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-gray-600 font-medium">{admin?.adminname || "Admin"}</p>
        <button
          onClick={() => dispatch(adminLogout())}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
