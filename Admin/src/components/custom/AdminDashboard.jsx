import React from "react";
import AdminHeader from "./AdminHeader";
import AdminStats from "./AdminStats";
import AdminQuickActions from "./AdminQuickActions";
import AdminUpcomingAppointments from "./AdminUpcomingAppointments"; // NEW COMPONENT

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100">
      
      <AdminHeader />

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <AdminStats />

        {/* 2 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SECTION (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <AdminUpcomingAppointments />
          </div>

          {/* RIGHT SECTION (1/3) */}
          <div className="space-y-8">
            <AdminQuickActions />
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
