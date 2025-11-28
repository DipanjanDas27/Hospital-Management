import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "@/components/custom/DashboardHeader";
import StatsOverview from "@/components/custom/StatsOverview";
import TodayAppointments from "@/components/custom/TodayAppointments";
import QuickActions from "@/components/custom/QuickActions";
import UpcomingSchedule from "@/components/custom/UpcomingSchedule";
import { Loader2 } from "lucide-react";

const DoctorDashboard = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {/* Dashboard Header */}
      <DashboardHeader profile={user} isAuthenticated={isAuthenticated} />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <StatsOverview />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              <TodayAppointments />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              <QuickActions />
              <UpcomingSchedule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
