// UpcomingSchedule.jsx - Keep as is
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const UpcomingSchedule = () => {
  const { appointments } = useSelector((state) => state.doctorAppointment);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const nextFiveDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    return d;
  });

  const schedule = useMemo(() => {
    return nextFiveDays.map((dateObj) => {
      const dateStr = dateObj.toDateString();
      const dayAppointments = appointments?.filter(
        (a) => new Date(a.appointmentdate).toDateString() === dateStr
      ) || [];

      if (dayAppointments.length === 0) {
        return {
          date: formatDate(dateObj),
          appointments: 0,
          hours: "No appointments",
        };
      }

      const times = dayAppointments.map((a) => a.appointmenttime);
      const sortedTimes = [...times].sort();

      return {
        date: formatDate(dateObj),
        appointments: dayAppointments.length,
        hours: `${sortedTimes[0]} - ${sortedTimes[sortedTimes.length - 1]}`,
      };
    });
  }, [appointments]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          Upcoming Schedule
        </CardTitle>
      </CardHeader>
 
      <CardContent className="space-y-3">
        {schedule.map((day, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-900 text-sm">{day.date}</p>
              <Badge
                variant={day.appointments > 0 ? "secondary" : "outline"}
                className="text-xs"
              >
                {day.appointments} appointments
              </Badge>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {day.hours}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingSchedule;