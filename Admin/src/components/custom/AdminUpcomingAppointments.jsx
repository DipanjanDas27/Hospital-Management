import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Calendar, Clock, ArrowRight, User } from "lucide-react";

const AdminUpcomingAppointments = () => {
  const navigate = useNavigate();

  // 📌 Fetch from Redux
  const { todayAppointments } = useSelector((state) => state.admin);

  // Only show first 3
  const appointments = todayAppointments?.slice(0, 3) || [];

  return (
    <Card className="border-0 shadow-lg rounded-xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* If No Appointments */}
        {appointments.length === 0 && (
          <p className="text-sm text-gray-500 py-4 text-center">
            No appointments scheduled for today.
          </p>
        )}

        {/* Appointments List */}
        {appointments.map((app) => (
          <div
            key={app._id}
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition"
            onClick={() => navigate(`/appointments/${app._id}`)}
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-indigo-500" />
              <p className="font-semibold text-gray-800">
                {app.patientdetails?.patientname || "Unknown Patient"}
              </p>

              <Badge className="ml-auto bg-indigo-100 text-indigo-700">
                {app.status}
              </Badge>
            </div>

            <p className="text-sm flex items-center gap-2 text-gray-600 mt-1">
              <Clock className="w-4 h-4" /> {app.appointmenttime}
            </p>
          </div>
        ))}

        {/* View All Button */}
        <Button
          onClick={() => navigate("/todayappointments")}
          className="w-full mt-2 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-90"
        >
          View All Appointments
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

      </CardContent>
    </Card>
  );
};

export default AdminUpcomingAppointments;
