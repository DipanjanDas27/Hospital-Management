import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const AdminUpcomingAppointments = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition"
          >
            <p className="font-semibold text-gray-800">Patient #{i}</p>
            <p className="text-sm flex items-center gap-2 text-gray-600 mt-1">
              <Clock className="w-4 h-4" /> 10:00 AM
            </p>
          </div>
        ))}

      </CardContent>
    </Card>
  );
};

export default AdminUpcomingAppointments;
